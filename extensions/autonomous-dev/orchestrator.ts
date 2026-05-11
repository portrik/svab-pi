import {
  OrchestratorConfig,
  DEFAULT_CONFIG,
  OrchestratorStatus,
  WorkerResult,
  WorkerActivityCallback,
  WorkerAbortSignal,
  WorkerPidCallback,
  AUTONOMOUS_LABELS,
} from "./types.js";
import {
  listIssuesByLabel,
  getIssueWithComments,
  swapLabels,
  postComment,
  lockIssue,
  markNeedsClarification,
  resumeFromClarification,
} from "./github.js";
import { logAutonomousDev } from "./logger.js";

/**
 * States in the issue processing lifecycle
 */
type IssueState =
  | "ready"
  | "processing"
  | "clarifying"
  | "complete"
  | "failed";

interface TrackedIssueState {
  issueNumber: number;
  title: string;
  state: IssueState;
  clarificationRound: number;
  clarificationQuestionTimestamp: string | null;
  lockedAt: Date;
}

async function stubWorkerSpawn(
  _issueNumber: number,
  _config: OrchestratorConfig,
  _onActivity?: WorkerActivityCallback,
  _signal?: WorkerAbortSignal
): Promise<WorkerResult> {
  return {
    status: "completed",
    prUrl: "https://github.com/example/repo/pull/123",
    summary: "Implemented feature via stub",
  };
}

function describeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return { value: String(error) };
}

export class AutonomousDevOrchestrator {
  private config: OrchestratorConfig;
  private status: OrchestratorStatus;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private trackedIssues: Map<number, TrackedIssueState> = new Map();
  private runToken = 0;
  private activeWorkerControllers: Map<number, AbortController> = new Map();
  private activeWorkerPids: Map<number, { pid: number; pgid?: number }> = new Map();
  private workQueue: number[] = [];
  private dispatchInProgress = false;
  private workerSpawner: (
    issueNumber: number,
    config: OrchestratorConfig,
    onActivity?: WorkerActivityCallback,
    signal?: WorkerAbortSignal,
    onPid?: WorkerPidCallback,
  ) => Promise<WorkerResult> = stubWorkerSpawn;

  constructor(config: Partial<OrchestratorConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.status = {
      isRunning: false,
      repo: this.config.repo,
      pollIntervalMs: this.config.pollIntervalMs,
      trackedIssues: [],
      stats: {
        totalProcessed: 0,
        totalCompleted: 0,
        totalFailed: 0,
        totalClarificationAsked: 0,
      },
      lastPollStartedAt: null,
      lastPollCompletedAt: null,
      lastPollSucceededAt: null,
      lastError: null,
      lastErrorAt: null,
      currentActivity: "idle - waiting for work",
      currentIssueNumber: null,
      currentIssueTitle: null,
      activeWorkerCount: 0,
      recentActivities: [],
    };
    this.updateActivity("idle - waiting for work");
  }

  private logEvent(event: string, entry: {
    level?: "info" | "warn" | "error";
    issueNumber?: number;
    issueTitle?: string;
    message?: string;
    details?: Record<string, unknown>;
  } = {}): void {
    logAutonomousDev(entry.level ?? "info", event, {
      repo: this.config.repo || undefined,
      issueNumber: entry.issueNumber,
      issueTitle: entry.issueTitle,
      message: entry.message,
      details: entry.details,
    });
  }

  private updateActivity(activity: string, issueNumber: number | null = null, issueTitle: string | null = null): void {
    this.status.currentActivity = activity;
    this.status.currentIssueNumber = issueNumber;
    this.status.currentIssueTitle = issueTitle;

    const issueLabel = issueNumber !== null
      ? issueTitle
        ? ` (#${issueNumber}: ${issueTitle})`
        : ` (#${issueNumber})`
      : "";
    const entry = `${activity}${issueLabel}`;
    const timestamp = new Date().toISOString();
    const recent = this.status.recentActivities.filter((item) => item.text !== entry);
    recent.unshift({ text: entry, timestamp });
    this.status.recentActivities = recent.slice(0, 3);
  }

  private staleLocksRecovered = false;

  start(): void {
    if (this.status.isRunning) return;
    this.status.isRunning = true;
    this.runToken++;
    this.staleLocksRecovered = false;
    this.workQueue = [];
    this.dispatchInProgress = false;
    this.logEvent("engine.start", {
      message: "Starting autonomous-dev polling loop",
      details: { pollIntervalMs: this.config.pollIntervalMs, staleLockRecovery: this.config.staleLockRecovery },
    });
    this.updateActivity("starting engine");
    void this.runPollCycle();
    this.intervalId = setInterval(
      () => {
        void this.runPollCycle();
      },
      this.config.pollIntervalMs
    );
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.runToken++;
    this.status.isRunning = false;
    for (const controller of this.activeWorkerControllers.values()) {
      controller.abort();
    }
    this.activeWorkerControllers.clear();
    this.status.activeWorkerCount = 0;
    this.staleLocksRecovered = false;
    this.reapActiveWorkers();
    this.workQueue = [];
    this.dispatchInProgress = false;

    // Clean up tracked processing issues that were not completed
    const processingIssues = Array.from(this.trackedIssues.values()).filter(
      (t) => t.state === "processing" || t.state === "clarifying"
    );

    this.logEvent("engine.stop", {
      message: "Stopping autonomous-dev polling loop",
      details: { trackedIssueCount: this.trackedIssues.size, processingIssues: processingIssues.length },
    });
    this.updateActivity("stopped");
    this.trackedIssues.clear();

    // Fire-and-forget cleanup for in-progress issues
    if (processingIssues.length > 0 && this.config.repo) {
      this.cleanupTrackedIssues(processingIssues);
    }
  }

  /**
   * Best-effort cleanup: moves tracked processing issues to FAILED on GitHub.
   * Fire-and-forget — does not block stop().
   */
  private async cleanupTrackedIssues(issues: TrackedIssueState[]): Promise<void> {
    this.logEvent("stop.cleanup", {
      level: "warn",
      message: `Cleaning up ${issues.length} tracked issue(s) that were still processing`,
      details: { issueNumbers: issues.map((i) => i.issueNumber) },
    });
    for (const tracked of issues) {
      try {
        await swapLabels(
          this.config.repo,
          tracked.issueNumber,
          [AUTONOMOUS_LABELS.IN_PROGRESS, AUTONOMOUS_LABELS.NEEDS_CLARIFICATION],
          [AUTONOMOUS_LABELS.FAILED]
        );
        await postComment(
          this.config.repo,
          tracked.issueNumber,
          "⚠️ **Orchestrator stopped while processing.** This issue has been moved to `failed` for manual review or re-processing. Relabel as `autonomous-dev:ready` to retry."
        );
        this.logEvent("stop.cleanup.issue", {
          level: "warn",
          issueNumber: tracked.issueNumber,
          issueTitle: tracked.title,
          message: "Moved to failed due to orchestrator stop",
        });
      } catch (err) {
        this.logEvent("stop.cleanup.failed", {
          level: "error",
          issueNumber: tracked.issueNumber,
          issueTitle: tracked.title,
          message: "Failed to clean up issue on stop",
          details: { error: describeError(err) },
        });
      }
    }
  }

  /**
   * Best-effort SIGTERM → SIGKILL for tracked worker PIDs.
   * Safe to call multiple times; no-ops if no PIDs are tracked.
   */
  private reapActiveWorkers(): void {
    const pidEntries = Array.from(this.activeWorkerPids.values());
    this.activeWorkerPids.clear();
    if (pidEntries.length === 0) return;

    this.logEvent("worker.reap", {
      level: "warn",
      message: `Reaping ${pidEntries.length} orphaned worker process(es)`,
      details: { pids: pidEntries.map((e) => e.pid) },
    });

    for (const entry of pidEntries) {
      const killTarget = process.platform !== "win32" && entry.pgid ? -entry.pgid : -entry.pid;
      try {
        process.kill(killTarget, "SIGTERM");
        this.logEvent("worker.reap.sigterm", {
          message: `Sent SIGTERM to ${entry.pgid ? `PGID ${entry.pgid}` : `PID ${entry.pid}`}`,
          details: { pid: entry.pid, pgid: entry.pgid },
        });
      } catch (err: any) {
        if (err?.code === "ESRCH") {
          continue;
        }
        this.logEvent("worker.reap.sigterm_failed", {
          level: "warn",
          message: `SIGTERM failed for PID ${entry.pid}`,
          details: { pid: entry.pid, error: describeError(err) },
        });
      }
    }

    const killTimer = setTimeout(() => {
      for (const entry of pidEntries) {
        const killTarget = process.platform !== "win32" && entry.pgid ? -entry.pgid : -entry.pid;
        try {
          process.kill(killTarget, "SIGKILL");
        } catch {
          // Already dead, good
        }
      }
    }, 5000);
    killTimer.unref?.();
  }

  getStatus(): OrchestratorStatus {
    this.status.trackedIssues = Array.from(this.trackedIssues.values()).map(
      (t) => ({
        issueNumber: t.issueNumber,
        title: t.title,
        status:
          t.state === "clarifying"
            ? ("waiting_clarification" as const)
            : ("processing" as const),
        clarificationRound: t.clarificationRound,
        lockedAt: t.lockedAt,
      })
    );
    return {
      ...this.status,
      recentActivities: this.status.recentActivities.map((item) => ({ ...item })),
    };
  }

  setWorkerSpawner(
    spawner: (
      issueNumber: number,
      config: OrchestratorConfig,
      onActivity?: WorkerActivityCallback,
      signal?: WorkerAbortSignal,
      onPid?: WorkerPidCallback,
    ) => Promise<WorkerResult>
  ): void {
    this.workerSpawner = spawner;
  }

  async pollCycle(): Promise<void> {
    await this.runPollCycle();
  }

  private async runPollCycle(): Promise<void> {
    const runToken = this.runToken;
    const pollStartedAt = Date.now();
    this.status.lastPollStartedAt = new Date().toISOString();
    this.logEvent("poll.started", {
      message: "Polling GitHub issues",
      details: { trackedIssueCount: this.trackedIssues.size },
    });
    this.updateActivity("polling GitHub issues");

    try {
      if (!this.config.repo) {
        console.warn("[autonomous-dev] No repo configured, skipping poll");
        this.logEvent("poll.skipped", {
          level: "warn",
          message: "Skipping poll because no repo is configured",
        });
        this.status.lastPollCompletedAt = new Date().toISOString();
        this.status.lastPollSucceededAt = this.status.lastPollCompletedAt;
        this.status.lastError = null;
        this.status.lastErrorAt = null;
        if (runToken !== this.runToken) return;
        this.updateActivity("idle - waiting for work");
        return;
      }

      await this.pickupReadyIssues();
      await this.checkClarificationResponses();

      if (runToken !== this.runToken) return;

      if (this.config.staleLockRecovery && !this.staleLocksRecovered) {
        await this.recoverStaleLocks();
        this.staleLocksRecovered = true;
      }

      this.status.lastPollCompletedAt = new Date().toISOString();
      this.status.lastPollSucceededAt = this.status.lastPollCompletedAt;
      this.status.lastError = null;
      this.status.lastErrorAt = null;
      this.logEvent("poll.completed", {
        message: "Poll cycle completed",
        details: {
          durationMs: Date.now() - pollStartedAt,
          trackedIssueCount: this.trackedIssues.size,
          totalProcessed: this.status.stats.totalProcessed,
        },
      });
      if (runToken !== this.runToken) return;
      this.updateActivity(this.trackedIssues.size > 0 ? "tracking active issues" : "idle - waiting for work");
    } catch (error) {
      this.status.lastPollCompletedAt = new Date().toISOString();
      this.status.lastError = error instanceof Error ? error.message : String(error);
      this.status.lastErrorAt = this.status.lastPollCompletedAt;
      this.logEvent("poll.failed", {
        level: "error",
        message: "Poll cycle failed",
        details: {
          durationMs: Date.now() - pollStartedAt,
          error: describeError(error),
        },
      });
      if (runToken !== this.runToken) return;
      this.updateActivity("error while polling GitHub");
      throw error;
    }
  }

  private async recoverStaleLocks(): Promise<void> {
    if (!this.config.staleLockRecovery || !this.config.repo) return;

    this.logEvent("lock.recovery.started", {
      message: "Scanning for orphaned in-progress locks",
    });

    try {
      const inProgressIssues = await listIssuesByLabel(
        this.config.repo,
        AUTONOMOUS_LABELS.IN_PROGRESS,
        []
      );

      if (inProgressIssues.length === 0) {
        this.logEvent("lock.recovery.clean", {
          message: "No orphaned in-progress issues found",
        });
        return;
      }

      this.updateActivity("recovering stale locks");

      const orphaned = inProgressIssues.filter(
        (issue) => !this.trackedIssues.has(issue.number)
      );

      if (orphaned.length === 0) {
        this.logEvent("lock.recovery.all_tracked", {
          message: "All in-progress issues are actively tracked",
          details: { count: inProgressIssues.length },
        });
        return;
      }

      this.logEvent("lock.recovery.found", {
        level: "warn",
        message: `Found ${orphaned.length} orphaned in-progress issue(s)`,
        details: { issueNumbers: orphaned.map((i) => i.number) },
      });

      for (const issue of orphaned) {
        try {
          await swapLabels(
            this.config.repo,
            issue.number,
            [AUTONOMOUS_LABELS.IN_PROGRESS],
            [AUTONOMOUS_LABELS.FAILED]
          );
          await postComment(
            this.config.repo,
            issue.number,
            "⚠️ **Orphaned lock recovered:** This issue was marked `in-progress` but no active orchestrator owns it. It has been moved to `failed` for re-processing. Relabel as `autonomous-dev:ready` to retry."
          );
          this.logEvent("lock.recovered", {
            level: "warn",
            issueNumber: issue.number,
            issueTitle: issue.title,
            message: "Recovered orphaned in-progress lock",
          });
        } catch (err) {
          this.logEvent("lock.recovery.failed", {
            level: "error",
            issueNumber: issue.number,
            issueTitle: issue.title,
            message: "Failed to recover orphaned lock",
            details: { error: describeError(err) },
          });
        }
      }

      this.status.stats.totalFailed += orphaned.length;
      this.status.stats.totalProcessed += orphaned.length;
    } catch (error) {
      this.logEvent("lock.recovery.error", {
        level: "error",
        message: "Stale lock recovery scan failed",
        details: { error: describeError(error) },
      });
    }
  }

  private async pickupReadyIssues(): Promise<void> {
    const issues = await listIssuesByLabel(
      this.config.repo,
      AUTONOMOUS_LABELS.READY,
      [
        AUTONOMOUS_LABELS.IN_PROGRESS,
        AUTONOMOUS_LABELS.NEEDS_CLARIFICATION,
        AUTONOMOUS_LABELS.COMPLETED,
        AUTONOMOUS_LABELS.FAILED,
      ]
    );

    this.logEvent("issues.ready.found", {
      message: `Found ${issues.length} ready issue(s)`,
      details: { issueNumbers: issues.map((issue) => issue.number) },
    });

    for (const issue of issues) {
      if (this.trackedIssues.has(issue.number)) {
        this.logEvent("issue.skip_tracked", {
          issueNumber: issue.number,
          issueTitle: issue.title,
          message: "Skipping issue already tracked in memory",
        });
        continue;
      }

      this.logEvent("issue.locking", {
        issueNumber: issue.number,
        issueTitle: issue.title,
        message: "Locking ready issue",
      });
      this.updateActivity("locking GitHub issue", issue.number, issue.title);
      await lockIssue(this.config.repo, issue.number);

      this.trackedIssues.set(issue.number, {
        issueNumber: issue.number,
        title: issue.title,
        state: "processing",
        clarificationRound: 0,
        clarificationQuestionTimestamp: null,
        lockedAt: new Date(),
      });

      this.workQueue.push(issue.number);
      this.logEvent("issue.enqueued", {
        issueNumber: issue.number,
        issueTitle: issue.title,
        message: "Issue enqueued for dispatch",
        details: { queueLength: this.workQueue.length },
      });
    }

    // Dispatch any queued work
    this.dispatchNext();
  }

  /**
   * Dispatch the next queued issue to a worker.
   * Runs asynchronously — does not block the caller.
   * Skips if already dispatching or if queue is empty.
   */
  private dispatchNext(): void {
    while (this.workQueue.length > 0) {
      if (this.dispatchInProgress) return;
      const issueNumber = this.workQueue.shift()!;
      // Skip if no longer tracked (e.g., stop was called)
      if (!this.trackedIssues.has(issueNumber)) continue;

      this.dispatchInProgress = true;
      this.spawnWorkerForIssue(issueNumber)
        .catch((err) => {
          this.logEvent("dispatch.error", {
            level: "error",
            issueNumber,
            message: "Unhandled error in dispatch chain",
            details: { error: describeError(err) },
          });
        })
        .finally(() => {
          this.dispatchInProgress = false;
          this.dispatchNext();
        });
      return;
    }
  }

  private async spawnWorkerForIssue(issueNumber: number): Promise<void> {
    const tracked = this.trackedIssues.get(issueNumber);
    if (!tracked) return;

    const runToken = this.runToken;
    const controller = new AbortController();
    this.activeWorkerControllers.set(issueNumber, controller);
    this.status.activeWorkerCount = this.activeWorkerControllers.size;

    let workerTimeoutTimer: ReturnType<typeof setTimeout> | null = null;
    let timedOut = false;
    let timeoutStatsRecorded = false;

    try {
      const trackedTitle = tracked.title;
      this.logEvent("worker.started", {
        issueNumber,
        issueTitle: trackedTitle,
        message: "Launching autonomous worker",
        details: { workerTimeoutMs: this.config.workerTimeoutMs },
      });
      this.updateActivity("processing issue", issueNumber, trackedTitle);

      // Set up watchdog timeout
      workerTimeoutTimer = setTimeout(() => {
        if (controller.signal.aborted) return;
        timedOut = true;
        this.logEvent("worker.timeout", {
          level: "error",
          issueNumber,
          issueTitle: trackedTitle,
          message: `Worker exceeded timeout of ${this.config.workerTimeoutMs}ms, aborting`,
        });
        controller.abort();
      }, this.config.workerTimeoutMs);

      const result = await this.workerSpawner(
        issueNumber,
        this.config,
        (activity) => {
          if (controller.signal.aborted || runToken !== this.runToken) return;
          this.logEvent("worker.activity", {
            issueNumber,
            issueTitle: trackedTitle,
            message: activity,
          });
          this.updateActivity(activity, issueNumber, trackedTitle);
        },
        controller.signal,
        (pid, pgid) => {
          this.activeWorkerPids.set(issueNumber, { pid, pgid });
          this.logEvent("worker.pid", {
            issueNumber,
            issueTitle: trackedTitle,
            message: `Worker process started with PID ${pid}`,
            details: { pid, pgid },
          });
        }
      );

      if (workerTimeoutTimer) {
        clearTimeout(workerTimeoutTimer);
        workerTimeoutTimer = null;
      }

      if (controller.signal.aborted || runToken !== this.runToken) {
        if (timedOut) {
          // Worker was aborted due to timeout
          tracked.state = "failed";
          timeoutStatsRecorded = true;
          this.status.stats.totalFailed++;
          this.status.stats.totalProcessed++;
          await postComment(
            this.config.repo,
            issueNumber,
            `❌ **Timeout:** Worker exceeded the maximum runtime of ${Math.round(this.config.workerTimeoutMs / 1000)}s. The task may be too complex or stuck.`
          );
          await this.handleFailure(issueNumber);
        } else {
          this.logEvent("worker.aborted", {
            issueNumber,
            issueTitle: trackedTitle,
            message: "Discarding worker result after stop or superseding run",
          });
        }
        return;
      }

      this.logEvent("worker.result", {
        issueNumber,
        issueTitle: trackedTitle,
        message: `Worker returned ${result.status}`,
        details: result.status === "completed"
          ? { prUrl: result.prUrl, summary: result.summary }
          : result.status === "needs-clarification"
            ? { question: result.question }
            : { error: result.error },
      });
      await this.handleWorkerResult(issueNumber, result);
    } catch (err) {
      if (workerTimeoutTimer) {
        clearTimeout(workerTimeoutTimer);
        workerTimeoutTimer = null;
      }

      if (controller.signal.aborted && timedOut) {
        // Worker threw after timeout abort — only record stats if not already done in try path
        tracked.state = "failed";
        if (!timeoutStatsRecorded) {
          this.status.stats.totalFailed++;
          this.status.stats.totalProcessed++;
        }
        await postComment(
          this.config.repo,
          issueNumber,
          `❌ **Timeout:** Worker exceeded the maximum runtime of ${Math.round(this.config.workerTimeoutMs / 1000)}s.`
        );
        await this.handleFailure(issueNumber);
        return;
      }

      if (controller.signal.aborted || runToken !== this.runToken) {
        this.logEvent("worker.aborted", {
          issueNumber,
          issueTitle: tracked.title,
          message: "Worker aborted after stop or superseding run",
          details: { error: describeError(err) },
        });
        return;
      }

      console.error(
        `[autonomous-dev] Worker failed for #${issueNumber}:`,
        err
      );
      this.logEvent("worker.failed", {
        level: "error",
        issueNumber,
        issueTitle: tracked.title,
        message: "Worker threw before returning a result",
        details: { error: describeError(err) },
      });
      tracked.state = "failed";
      this.status.stats.totalFailed++;
      this.status.stats.totalProcessed++;
      await this.handleFailure(issueNumber);
    } finally {
      if (workerTimeoutTimer) {
        clearTimeout(workerTimeoutTimer);
        workerTimeoutTimer = null;
      }
      const active = this.activeWorkerControllers.get(issueNumber);
      if (active === controller) {
        this.activeWorkerControllers.delete(issueNumber);
      }
      this.activeWorkerPids.delete(issueNumber);
      this.status.activeWorkerCount = this.activeWorkerControllers.size;
    }
  }

  private async handleWorkerResult(
    issueNumber: number,
    result: WorkerResult
  ): Promise<void> {
    const tracked = this.trackedIssues.get(issueNumber);
    if (!tracked) return;

    if (result.status === "completed") {
      tracked.state = "complete";
      this.status.stats.totalCompleted++;
      this.status.stats.totalProcessed++;
      await this.handleCompletion(issueNumber, result.prUrl, result.summary);
    } else if (result.status === "needs-clarification") {
      if (tracked.clarificationRound >= this.config.maxClarificationRounds) {
        tracked.state = "failed";
        this.status.stats.totalFailed++;
        this.status.stats.totalProcessed++;
        await postComment(
          this.config.repo,
          issueNumber,
          `❌ Max clarification rounds (${this.config.maxClarificationRounds}) reached. Please reopen if still needed.`
        );
        await this.handleFailure(issueNumber);
      } else {
        this.logEvent("issue.needs_clarification", {
          issueNumber,
          issueTitle: tracked.title,
          message: "Worker requested clarification",
          details: { question: result.question, clarificationRound: tracked.clarificationRound + 1 },
        });
        tracked.state = "clarifying";
        tracked.clarificationRound++;
        tracked.clarificationQuestionTimestamp = new Date().toISOString();
        this.status.stats.totalClarificationAsked++;
        this.updateActivity("waiting for clarification", issueNumber, tracked.title);
        await markNeedsClarification(this.config.repo, issueNumber);
        await postComment(
          this.config.repo,
          issueNumber,
          `🤔 **Clarification needed:** ${result.question}`
        );
      }
    } else if (result.status === "failed") {
      this.logEvent("issue.failed_result", {
        level: "error",
        issueNumber,
        issueTitle: tracked.title,
        message: "Worker reported failure",
        details: { error: result.error },
      });
      tracked.state = "failed";
      this.status.stats.totalFailed++;
      this.status.stats.totalProcessed++;
      await postComment(
        this.config.repo,
        issueNumber,
        `❌ **Error:** ${result.error}`
      );
      await this.handleFailure(issueNumber);
    }
  }

  private async checkClarificationResponses(): Promise<void> {
    const clarifyingIssues = Array.from(this.trackedIssues.values()).filter(
      (t) => t.state === "clarifying"
    );

    for (const tracked of clarifyingIssues) {
      if (!tracked.clarificationQuestionTimestamp) continue;

      const ctx = await getIssueWithComments(
        this.config.repo,
        tracked.issueNumber
      );

      const hasNewComment = ctx.comments.some(
        (c) =>
          !c.isFromBot &&
          c.author.toLowerCase() !== "github-actions[bot]" &&
          new Date(c.createdAt) >
            new Date(tracked.clarificationQuestionTimestamp!)
      );

      if (hasNewComment) {
        this.logEvent("issue.resume", {
          issueNumber: tracked.issueNumber,
          issueTitle: tracked.title,
          message: "Resuming issue after clarification response",
        });
        this.updateActivity("resuming issue", tracked.issueNumber, tracked.title);
        tracked.state = "processing";
        tracked.clarificationQuestionTimestamp = null;
        await resumeFromClarification(this.config.repo, tracked.issueNumber);
        await this.spawnWorkerForIssue(tracked.issueNumber);
      }
    }
  }

  private async handleCompletion(
    issueNumber: number,
    prUrl: string,
    summary: string
  ): Promise<void> {
    const tracked = this.trackedIssues.get(issueNumber);
    this.logEvent("issue.completed", {
      issueNumber,
      issueTitle: tracked?.title,
      message: "Marking issue as completed",
      details: { prUrl, summary },
    });
    this.updateActivity("completing issue", issueNumber, tracked?.title ?? null);
    await swapLabels(
      this.config.repo,
      issueNumber,
      [
        AUTONOMOUS_LABELS.IN_PROGRESS,
        AUTONOMOUS_LABELS.NEEDS_CLARIFICATION,
      ],
      [AUTONOMOUS_LABELS.COMPLETED]
    );
    await postComment(
      this.config.repo,
      issueNumber,
      `✅ **Autonomous implementation complete!**\n\n${summary}\n\nPR: ${prUrl}`
    );
    this.trackedIssues.delete(issueNumber);
    this.updateActivity(this.trackedIssues.size > 0 ? "tracking active issues" : "idle - waiting for work");
  }

  private async handleFailure(issueNumber: number): Promise<void> {
    const tracked = this.trackedIssues.get(issueNumber);
    this.logEvent("issue.failed", {
      level: "warn",
      issueNumber,
      issueTitle: tracked?.title,
      message: "Marking issue as failed",
    });
    this.updateActivity("failing issue", issueNumber, tracked?.title ?? null);
    await swapLabels(
      this.config.repo,
      issueNumber,
      [
        AUTONOMOUS_LABELS.IN_PROGRESS,
        AUTONOMOUS_LABELS.NEEDS_CLARIFICATION,
      ],
      [AUTONOMOUS_LABELS.FAILED]
    );
    this.trackedIssues.delete(issueNumber);
    this.updateActivity(this.trackedIssues.size > 0 ? "tracking active issues" : "idle - waiting for work");
  }
}
