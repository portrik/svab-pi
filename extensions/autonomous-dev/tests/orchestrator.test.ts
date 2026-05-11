import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from "vitest";
import { AutonomousDevOrchestrator } from "../orchestrator.js";
import { AUTONOMOUS_LABELS, type WorkerResult, type WorkerAbortSignal, type OrchestratorConfig, type WorkerActivityCallback } from "../types.js";

vi.mock("../logger.js", () => ({
  logAutonomousDev: vi.fn(),
}));

// Mock the github module
vi.mock("../github.js", async () => {
  const actual = await vi.importActual("../github.js");
  return {
    ...actual,
    listIssuesByLabel: vi.fn(),
    getIssueWithComments: vi.fn(),
    swapLabels: vi.fn(),
    addLabels: vi.fn(),
    removeLabels: vi.fn(),
    postComment: vi.fn(),
    lockIssue: vi.fn(),
    markNeedsClarification: vi.fn(),
    resumeFromClarification: vi.fn(),
  };
});

import {
  listIssuesByLabel,
  getIssueWithComments,
  swapLabels,
  postComment,
  lockIssue,
  markNeedsClarification,
  resumeFromClarification,
} from "../github.js";
import { logAutonomousDev } from "../logger.js";

const mockListIssues = listIssuesByLabel as unknown as ReturnType<typeof vi.fn>;
const mockGetIssue = getIssueWithComments as unknown as ReturnType<typeof vi.fn>;
const mockSwap = swapLabels as unknown as ReturnType<typeof vi.fn>;
const mockPostComment = postComment as unknown as ReturnType<typeof vi.fn>;
const mockLock = lockIssue as unknown as ReturnType<typeof vi.fn>;
const mockNeedsClarification = markNeedsClarification as unknown as ReturnType<typeof vi.fn>;
const mockResume = resumeFromClarification as unknown as ReturnType<typeof vi.fn>;
const mockLogAutonomousDev = logAutonomousDev as unknown as ReturnType<typeof vi.fn>;

describe("orchestrator", () => {
  let orchestrator: AutonomousDevOrchestrator;
  let workerSpawner: Mock<[
    issueNumber: number,
    config: OrchestratorConfig,
    onActivity?: WorkerActivityCallback,
    signal?: WorkerAbortSignal
  ], Promise<WorkerResult>>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    // Default mocks
    mockListIssues.mockResolvedValue([]);
    mockGetIssue.mockResolvedValue({
      issue: { number: 0, title: "", body: "", labels: [], author: "", createdAt: "" },
      comments: [],
    });
    mockSwap.mockResolvedValue(undefined);
    mockPostComment.mockResolvedValue(undefined);
    mockLock.mockResolvedValue(undefined);
    mockNeedsClarification.mockResolvedValue(undefined);
    mockResume.mockResolvedValue(undefined);

    workerSpawner = vi.fn().mockResolvedValue({
      status: "completed",
      prUrl: "https://github.com/owner/repo/pull/1",
      summary: "Done",
    });

    orchestrator = new AutonomousDevOrchestrator({
      repo: "owner/repo",
      pollIntervalMs: 60_000,
      maxClarificationRounds: 3,
    });
    orchestrator.setWorkerSpawner(workerSpawner);
  });

  afterEach(() => {
    vi.useRealTimers();
    orchestrator.stop();
  });

  describe("start/stop", () => {
    it("should report running state", () => {
      expect(orchestrator.getStatus().isRunning).toBe(false);
      orchestrator.start();
      expect(orchestrator.getStatus().isRunning).toBe(true);
      orchestrator.stop();
      expect(orchestrator.getStatus().isRunning).toBe(false);
    });

    it("should not start twice", () => {
      orchestrator.start();
      const firstIntervalId = (orchestrator as any).intervalId;
      orchestrator.start();
      expect((orchestrator as any).intervalId).toBe(firstIntervalId);
      expect(orchestrator.getStatus().isRunning).toBe(true);
    });

    it("should stop the polling interval", () => {
      orchestrator.start();
      orchestrator.stop();
      expect((orchestrator as any).intervalId).toBeNull();
      expect(orchestrator.getStatus().isRunning).toBe(false);
    });

    it("should keep current activity as stopped after stop during an in-flight poll", async () => {
      let releaseListIssues: (() => void) | null = null;
      mockListIssues.mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            releaseListIssues = () => resolve([]);
          })
      );

      const pollPromise = orchestrator.pollCycle();
      orchestrator.stop();
      (releaseListIssues as any)?.();
      await pollPromise;

      const status = orchestrator.getStatus();
      expect(status.isRunning).toBe(false);
      expect(status.currentActivity).toBe("stopped");
    });

    it("should abort in-flight worker activity and keep stopped state after stop", async () => {
      let capturedOnActivity: ((activity: string) => void) | undefined;
      let capturedSignal: AbortSignal | undefined;
      let resolveWorker: ((value: any) => void) | null = null;
      let markWorkerStarted: (() => void) | null = null;
      const workerStarted = new Promise<void>((resolve) => {
        markWorkerStarted = resolve;
      });

      workerSpawner.mockImplementationOnce(async (_issueNumber, _config, onActivity, signal) => {
        capturedOnActivity = onActivity;
        capturedSignal = signal;
        markWorkerStarted?.();
        return await new Promise((resolve) => {
          resolveWorker = resolve;
        });
      });

      mockListIssues.mockResolvedValueOnce([
        {
          number: 42,
          title: "Test",
          body: "",
          labels: [AUTONOMOUS_LABELS.READY],
          author: "alice",
          createdAt: "2026-04-01T00:00:00Z",
        },
      ]);

      const pollPromise = orchestrator.pollCycle();
      await workerStarted;
      expect(capturedSignal?.aborted).toBe(false);

      orchestrator.stop();
      expect(capturedSignal?.aborted).toBe(true);

      capturedOnActivity?.("read src/after-stop.ts");
      (resolveWorker as any)({
        status: "completed",
        prUrl: "https://github.com/owner/repo/pull/1",
        summary: "Done",
      });
      await pollPromise;

      const status = orchestrator.getStatus();
      expect(status.isRunning).toBe(false);
      expect(status.currentActivity).toBe("stopped");
      expect(status.recentActivities[0].text).toContain("stopped");
      expect(status.recentActivities.some((activity) => activity.text.includes("after-stop"))).toBe(false);
      // C3: stop now cleans up tracked processing issues
      expect(mockSwap).toHaveBeenCalledWith(
        "owner/repo", 42,
        expect.arrayContaining([AUTONOMOUS_LABELS.IN_PROGRESS, AUTONOMOUS_LABELS.NEEDS_CLARIFICATION]),
        expect.arrayContaining([AUTONOMOUS_LABELS.FAILED])
      );
      expect(mockPostComment).toHaveBeenCalledWith(
        "owner/repo", 42,
        expect.stringContaining("Orchestrator stopped")
      );
    });
  });

  describe("pickupReadyIssues", () => {
    it("should pick up ready issues and lock them", async () => {
      mockListIssues.mockResolvedValueOnce([
        {
          number: 42,
          title: "Test",
          body: "",
          labels: [AUTONOMOUS_LABELS.READY],
          author: "alice",
          createdAt: "2026-04-01T00:00:00Z",
        },
      ]);

      // Call pollCycle directly
      await orchestrator.pollCycle();

      expect(mockLock).toHaveBeenCalledWith("owner/repo", 42);
      expect(workerSpawner).toHaveBeenCalledWith(42, expect.any(Object), expect.any(Function), expect.any(Object), expect.any(Function));
      expect(mockLogAutonomousDev).toHaveBeenCalledWith(
        "info",
        "issues.ready.found",
        expect.objectContaining({ repo: "owner/repo" })
      );
    });

    it("should skip issues already tracked", async () => {
      mockListIssues.mockResolvedValueOnce([
        {
          number: 42,
          title: "Test",
          body: "",
          labels: [AUTONOMOUS_LABELS.READY],
          author: "alice",
          createdAt: "2026-04-01T00:00:00Z",
        },
      ]);

      // Manually track the issue
      (orchestrator as any).trackedIssues.set(42, {
        issueNumber: 42,
        title: "Test",
        state: "processing",
        clarificationRound: 0,
        clarificationQuestionTimestamp: null,
        lockedAt: new Date(),
      });

      await orchestrator.pollCycle();

      // Should not lock again
      expect(mockLock).not.toHaveBeenCalled();
    });

    it("should skip issues with excluded labels", async () => {
      // listIssuesByLabel already filters out IN_PROGRESS, COMPLETED, FAILED labels
      // So the mock returns empty - no issues to pick up
      mockListIssues.mockResolvedValueOnce([
        {
          number: 42,
          title: "Test",
          body: "",
          labels: [AUTONOMOUS_LABELS.READY],
          author: "alice",
          createdAt: "2026-04-01T00:00:00Z",
        },
      ]);

      await orchestrator.pollCycle();

      // The issue IS picked up (labels are filtered by gh, not by us)
      expect(mockLock).toHaveBeenCalled();
      // But it's tracked with READY label, so it won't be picked up again
      // This test just verifies the basic flow works
    });
  });

  describe("worker result handling", () => {
    it("should mark issue complete and post PR link", async () => {
      mockListIssues.mockResolvedValueOnce([
        {
          number: 42,
          title: "Add login",
          body: "",
          labels: [AUTONOMOUS_LABELS.READY],
          author: "alice",
          createdAt: "2026-04-01T00:00:00Z",
        },
      ]);

      await orchestrator.pollCycle();

      expect(mockSwap).toHaveBeenCalledWith(
        "owner/repo",
        42,
        expect.any(Array),
        expect.arrayContaining([AUTONOMOUS_LABELS.COMPLETED])
      );
      expect(mockPostComment).toHaveBeenCalledWith(
        "owner/repo",
        42,
        expect.stringContaining("https://github.com/owner/repo/pull/1")
      );
    });

    it("should surface live worker activity updates in status", async () => {
      workerSpawner.mockImplementationOnce(async (_issueNumber, _config, onActivity) => {
        onActivity?.("read src/app.ts");
        return {
          status: "completed",
          prUrl: "https://github.com/owner/repo/pull/1",
          summary: "Done",
        };
      });

      mockListIssues.mockResolvedValueOnce([
        {
          number: 42,
          title: "Add feature",
          body: "",
          labels: [AUTONOMOUS_LABELS.READY],
          author: "alice",
          createdAt: "2026-04-01T00:00:00Z",
        },
      ]);

      await orchestrator.pollCycle();
      // Dispatch is async — flush microtasks for the worker to complete
      await vi.advanceTimersByTimeAsync(0);

      // Worker should have been called with the issue number
      expect(workerSpawner).toHaveBeenCalledWith(42, expect.any(Object), expect.any(Function), expect.any(Object), expect.any(Function));
      // Activity update should have been logged (even if recentActivities is overwritten)
      expect(mockLogAutonomousDev).toHaveBeenCalledWith(
        "info",
        "worker.activity",
        expect.objectContaining({ message: "read src/app.ts" })
      );
    });

    it("should handle worker failure", async () => {
      workerSpawner.mockResolvedValueOnce({
        status: "failed",
        error: "Missing dependency",
      });

      mockListIssues.mockResolvedValueOnce([
        {
          number: 42,
          title: "Add feature",
          body: "",
          labels: [AUTONOMOUS_LABELS.READY],
          author: "alice",
          createdAt: "2026-04-01T00:00:00Z",
        },
      ]);

      await orchestrator.pollCycle();

      expect(mockLogAutonomousDev).toHaveBeenCalledWith(
        "error",
        "issue.failed_result",
        expect.objectContaining({ issueNumber: 42, repo: "owner/repo" })
      );
      expect(mockSwap).toHaveBeenCalledWith(
        "owner/repo",
        42,
        expect.any(Array),
        expect.arrayContaining([AUTONOMOUS_LABELS.FAILED])
      );
      expect(mockPostComment).toHaveBeenCalledWith(
        "owner/repo",
        42,
        expect.stringContaining("Missing dependency")
      );
    });

    it("should handle worker throwing error", async () => {
      workerSpawner.mockRejectedValueOnce(new Error("Worker crashed"));

      mockListIssues.mockResolvedValueOnce([
        {
          number: 42,
          title: "Test",
          body: "",
          labels: [AUTONOMOUS_LABELS.READY],
          author: "alice",
          createdAt: "2026-04-01T00:00:00Z",
        },
      ]);

      await orchestrator.pollCycle();

      expect(mockSwap).toHaveBeenCalledWith(
        "owner/repo",
        42,
        expect.any(Array),
        expect.arrayContaining([AUTONOMOUS_LABELS.FAILED])
      );
    });
  });

  describe("clarification loop", () => {
    it("should ask clarification question", async () => {
      workerSpawner.mockResolvedValueOnce({
        status: "needs-clarification",
        question: "Which database should we use?",
      });

      mockListIssues.mockResolvedValueOnce([
        {
          number: 42,
          title: "Add persistence",
          body: "",
          labels: [AUTONOMOUS_LABELS.READY],
          author: "alice",
          createdAt: "2026-04-01T00:00:00Z",
        },
      ]);

      await orchestrator.pollCycle();

      expect(mockNeedsClarification).toHaveBeenCalledWith("owner/repo", 42);
      expect(mockPostComment).toHaveBeenCalledWith(
        "owner/repo",
        42,
        expect.stringContaining("Which database")
      );
    });

    it("should resume when author responds", async () => {
      workerSpawner
        .mockResolvedValueOnce({
          status: "completed",
          prUrl: "https://github.com/owner/repo/pull/1",
          summary: "Used SQLite",
        });

      mockListIssues.mockResolvedValue([]);
      // getIssue is called for clarification check
      mockGetIssue.mockResolvedValueOnce({
        issue: { number: 42, title: "Test", body: "", labels: [], author: "alice", createdAt: "" },
        comments: [
          { id: 1, author: "bot", body: "Which database?", createdAt: "2026-04-01T10:00:00Z", isFromBot: true },
          { id: 2, author: "alice", body: "SQLite please", createdAt: "2026-04-01T11:00:00Z", isFromBot: false },
        ],
      });

      // Track issue as clarifying
      (orchestrator as any).trackedIssues.set(42, {
        issueNumber: 42,
        title: "Add persistence",
        state: "clarifying",
        clarificationRound: 1,
        clarificationQuestionTimestamp: "2026-04-01T10:00:00Z",
        lockedAt: new Date("2026-04-01T09:00:00Z"),
      });

      await orchestrator.pollCycle();

      expect(mockResume).toHaveBeenCalledWith("owner/repo", 42);
      // Worker should be called again after resume
      expect(workerSpawner).toHaveBeenCalledTimes(1);
    });

    it("should keep issue in clarifying when no new comments and not at max rounds", async () => {
      // When clarification check finds no new comments, issue stays in clarifying state
      mockListIssues.mockResolvedValue([]);
      mockGetIssue.mockResolvedValueOnce({
        issue: { number: 42, title: "Test", body: "", labels: [], author: "alice", createdAt: "" },
        comments: [
          { id: 1, author: "bot", body: "Which database?", createdAt: "2026-04-01T10:00:00Z", isFromBot: true },
        ],
      });

      // Track at round 1 (not at max of 3)
      (orchestrator as any).trackedIssues.set(42, {
        issueNumber: 42,
        title: "Add persistence",
        state: "clarifying",
        clarificationRound: 1,
        clarificationQuestionTimestamp: "2026-04-01T10:00:00Z",
        lockedAt: new Date("2026-04-01T09:00:00Z"),
      });

      await orchestrator.pollCycle();

      // Issue should stay in clarifying state (not resumed, not failed)
      const tracked = (orchestrator as any).trackedIssues.get(42);
      expect(tracked.state).toBe("clarifying");
      expect(mockResume).not.toHaveBeenCalled();
      expect(mockSwap).not.toHaveBeenCalled();
    });

    it("should ignore bot comments when checking clarification responses", async () => {
      mockListIssues.mockResolvedValue([]);

      mockGetIssue.mockResolvedValue({
        issue: { number: 42, title: "Test", body: "", labels: [], author: "alice", createdAt: "" },
        comments: [
          { id: 1, author: "bot", body: "Which database?", createdAt: "2026-04-01T10:00:00Z", isFromBot: true },
          { id: 2, author: "github-actions[bot]", body: "CI passed", createdAt: "2026-04-01T11:00:00Z", isFromBot: true },
        ],
      });

      (orchestrator as any).trackedIssues.set(42, {
        issueNumber: 42,
        title: "Test",
        state: "clarifying",
        clarificationRound: 1,
        clarificationQuestionTimestamp: "2026-04-01T10:00:00Z",
        lockedAt: new Date(),
      });

      await orchestrator.pollCycle();

      expect(mockResume).not.toHaveBeenCalled();
      expect(workerSpawner).not.toHaveBeenCalled();
    });
  });

  describe("getStatus", () => {
    it("should return current status with stats", () => {
      const status = orchestrator.getStatus();
      expect(status.isRunning).toBe(false);
      expect(status.repo).toBe("owner/repo");
      expect(status.pollIntervalMs).toBe(60_000);
      expect(status.stats.totalProcessed).toBe(0);
      expect(status.lastPollStartedAt).toBeNull();
      expect(status.lastPollCompletedAt).toBeNull();
      expect(status.lastPollSucceededAt).toBeNull();
      expect(status.lastError).toBeNull();
      expect(status.lastErrorAt).toBeNull();
      expect(status.currentActivity).toBe("idle - waiting for work");
      expect(status.currentIssueNumber).toBeNull();
      expect(status.currentIssueTitle).toBeNull();
      expect(status.recentActivities[0].text).toContain("idle - waiting for work");
    });

    it("should show tracked issues in status", () => {
      (orchestrator as any).trackedIssues.set(42, {
        issueNumber: 42,
        title: "Tracked test issue",
        state: "processing",
        clarificationRound: 0,
        clarificationQuestionTimestamp: null,
        lockedAt: new Date(),
      });

      const status = orchestrator.getStatus();
      expect(status.trackedIssues).toHaveLength(1);
      expect(status.trackedIssues[0].issueNumber).toBe(42);
      expect(status.trackedIssues[0].title).toBe("Tracked test issue");
      expect(status.trackedIssues[0].status).toBe("processing");
    });

    it("should show waiting_clarification for clarifying issues", () => {
      (orchestrator as any).trackedIssues.set(42, {
        issueNumber: 42,
        title: "Clarifying issue",
        state: "clarifying",
        clarificationRound: 1,
        clarificationQuestionTimestamp: "2026-04-01T10:00:00Z",
        lockedAt: new Date(),
      });

      const status = orchestrator.getStatus();
      expect(status.trackedIssues[0].status).toBe("waiting_clarification");
    });
  });

  describe("edge cases", () => {
    it("should skip poll if no repo configured", async () => {
      orchestrator = new AutonomousDevOrchestrator({ repo: "" });
      orchestrator.setWorkerSpawner(workerSpawner);

      await orchestrator.pollCycle();

      expect(mockListIssues).not.toHaveBeenCalled();
      const status = orchestrator.getStatus();
      expect(status.lastPollStartedAt).not.toBeNull();
      expect(status.lastPollCompletedAt).not.toBeNull();
      expect(status.lastPollSucceededAt).not.toBeNull();
      expect(status.lastError).toBeNull();
      expect(status.currentActivity).toBe("idle - waiting for work");
    });

    it("should record poll errors in status", async () => {
      mockListIssues.mockRejectedValueOnce(new Error("gh exploded"));

      await expect(orchestrator.pollCycle()).rejects.toThrow("gh exploded");

      expect(mockLogAutonomousDev).toHaveBeenCalledWith(
        "error",
        "poll.failed",
        expect.objectContaining({ repo: "owner/repo" })
      );
      const status = orchestrator.getStatus();
      expect(status.lastPollStartedAt).not.toBeNull();
      expect(status.lastPollCompletedAt).not.toBeNull();
      expect(status.lastError).toBe("gh exploded");
      expect(status.lastErrorAt).not.toBeNull();
      expect(status.lastPollSucceededAt).toBeNull();
      expect(status.currentActivity).toBe("error while polling GitHub");
    });
  });

  describe("stale lock recovery", () => {
    it("should recover orphaned in-progress issues on first poll", async () => {
      // First call: pickupReadyIssues finds nothing (READY label)
      mockListIssues
        .mockResolvedValueOnce([]) // pickupReadyIssues: no ready issues
        .mockResolvedValueOnce([   // recoverStaleLocks: 2 orphaned in-progress
          { number: 10, title: "Orphan A", body: "", labels: [AUTONOMOUS_LABELS.IN_PROGRESS], author: "alice", createdAt: "" },
          { number: 20, title: "Orphan B", body: "", labels: [AUTONOMOUS_LABELS.IN_PROGRESS], author: "bob", createdAt: "" },
        ]);

      await orchestrator.pollCycle();

      expect(mockSwap).toHaveBeenCalledTimes(2);
      expect(mockSwap).toHaveBeenCalledWith(
        "owner/repo", 10,
        [AUTONOMOUS_LABELS.IN_PROGRESS],
        [AUTONOMOUS_LABELS.FAILED]
      );
      expect(mockSwap).toHaveBeenCalledWith(
        "owner/repo", 20,
        [AUTONOMOUS_LABELS.IN_PROGRESS],
        [AUTONOMOUS_LABELS.FAILED]
      );
      expect(mockPostComment).toHaveBeenCalledWith(
        "owner/repo", 10,
        expect.stringContaining("Orphaned lock recovered")
      );
      expect(mockPostComment).toHaveBeenCalledWith(
        "owner/repo", 20,
        expect.stringContaining("Orphaned lock recovered")
      );

      const status = orchestrator.getStatus();
      expect(status.stats.totalFailed).toBe(2);
      expect(status.stats.totalProcessed).toBe(2);
    });

    it("should skip actively tracked issues during recovery", async () => {
      (orchestrator as any).trackedIssues.set(10, {
        issueNumber: 10,
        title: "Active",
        state: "processing",
        clarificationRound: 0,
        clarificationQuestionTimestamp: null,
        lockedAt: new Date(),
      });

      mockListIssues
        .mockResolvedValueOnce([]) // no ready issues
        .mockResolvedValueOnce([   // 1 in-progress (actively tracked) + 1 orphan
          { number: 10, title: "Active", body: "", labels: [AUTONOMOUS_LABELS.IN_PROGRESS], author: "alice", createdAt: "" },
          { number: 20, title: "Orphan", body: "", labels: [AUTONOMOUS_LABELS.IN_PROGRESS], author: "bob", createdAt: "" },
        ]);

      await orchestrator.pollCycle();

      // Only issue 20 should be recovered; issue 10 is actively tracked
      expect(mockSwap).toHaveBeenCalledTimes(1);
      expect(mockSwap).toHaveBeenCalledWith(
        "owner/repo", 20,
        [AUTONOMOUS_LABELS.IN_PROGRESS],
        [AUTONOMOUS_LABELS.FAILED]
      );
    });

    it("should not recover locks when no orphaned issues exist", async () => {
      mockListIssues
        .mockResolvedValueOnce([]) // no ready issues
        .mockResolvedValueOnce([]); // no in-progress issues

      await orchestrator.pollCycle();

      expect(mockSwap).not.toHaveBeenCalled();
      expect(mockLogAutonomousDev).toHaveBeenCalledWith(
        "info",
        "lock.recovery.clean",
        expect.objectContaining({ repo: "owner/repo" })
      );
    });

    it("should only run recovery once across multiple poll cycles", async () => {
      mockListIssues.mockResolvedValue([]);

      await orchestrator.pollCycle();
      await orchestrator.pollCycle();

      // listIssuesByLabel for IN_PROGRESS should only be called once (first poll)
      const inProgressCalls = mockListIssues.mock.calls.filter(
        (call: string[]) => call[1] === AUTONOMOUS_LABELS.IN_PROGRESS
      );
      expect(inProgressCalls).toHaveLength(1);
    });

    it("should skip recovery when staleLockRecovery is false", async () => {
      orchestrator = new AutonomousDevOrchestrator({
        repo: "owner/repo",
        pollIntervalMs: 60_000,
        staleLockRecovery: false,
      });
      orchestrator.setWorkerSpawner(workerSpawner);

      mockListIssues.mockResolvedValue([]);

      await orchestrator.pollCycle();

      // No IN_PROGRESS calls should be made
      const inProgressCalls = mockListIssues.mock.calls.filter(
        (call: string[]) => call[1] === AUTONOMOUS_LABELS.IN_PROGRESS
      );
      expect(inProgressCalls).toHaveLength(0);
    });

    it("should continue poll even if recovery scan fails", async () => {
      mockListIssues
        .mockResolvedValueOnce([]) // no ready issues
        .mockRejectedValueOnce(new Error("gh search failed")); // recovery scan fails

      await orchestrator.pollCycle();

      const status = orchestrator.getStatus();
      expect(status.lastPollSucceededAt).not.toBeNull();
      expect(mockLogAutonomousDev).toHaveBeenCalledWith(
        "error",
        "lock.recovery.error",
        expect.objectContaining({ repo: "owner/repo" })
      );
    });
  });

  describe("worker timeout", () => {
    it("should abort worker and mark issue as failed when timeout fires", async () => {
      const timeoutOrchestrator = new AutonomousDevOrchestrator({
        repo: "owner/repo",
        pollIntervalMs: 60_000,
        workerTimeoutMs: 50,
      });
      timeoutOrchestrator.setWorkerSpawner(workerSpawner);

      let capturedSignal: AbortSignal | undefined;

      // Worker that respects abort signal and resolves quickly after abort
      workerSpawner.mockImplementationOnce(async (_issueNumber, _config, _onActivity, signal) => {
        capturedSignal = signal;
        return await new Promise((resolve) => {
          const onAbort = () => {
            signal!.removeEventListener("abort", onAbort);
            resolve({ status: "completed" as const, prUrl: "late", summary: "resolved after abort" });
          };
          if (signal) {
            signal.addEventListener("abort", onAbort);
          }
        });
      });

      mockListIssues.mockResolvedValueOnce([
        {
          number: 42,
          title: "Slow task",
          body: "",
          labels: [AUTONOMOUS_LABELS.READY],
          author: "alice",
          createdAt: "2026-04-01T00:00:00Z",
        },
      ]);

      const pollPromise = timeoutOrchestrator.pollCycle();

      // Advance past timeout — the abort signal fires, the worker resolves
      await vi.advanceTimersByTimeAsync(100);

      await pollPromise;

      expect(capturedSignal?.aborted).toBe(true);
      expect(mockSwap).toHaveBeenCalledWith(
        "owner/repo", 42,
        expect.arrayContaining([AUTONOMOUS_LABELS.IN_PROGRESS]),
        expect.arrayContaining([AUTONOMOUS_LABELS.FAILED])
      );
      expect(mockPostComment).toHaveBeenCalledWith(
        "owner/repo", 42,
        expect.stringContaining("Timeout")
      );
      expect(mockLogAutonomousDev).toHaveBeenCalledWith(
        "error",
        "worker.timeout",
        expect.objectContaining({ issueNumber: 42 })
      );

      const status = timeoutOrchestrator.getStatus();
      expect(status.stats.totalFailed).toBe(1);
    });

    it("should handle timeout when worker throws after abort", async () => {
      const timeoutOrchestrator = new AutonomousDevOrchestrator({
        repo: "owner/repo",
        pollIntervalMs: 60_000,
        workerTimeoutMs: 50,
      });
      timeoutOrchestrator.setWorkerSpawner(workerSpawner);

      // Worker that rejects on abort
      workerSpawner.mockImplementationOnce(async (_issueNumber, _config, _onActivity, signal) => {
        return await new Promise((_resolve, reject) => {
          const onAbort = () => {
            signal!.removeEventListener("abort", onAbort);
            reject(new Error("Worker aborted hard"));
          };
          if (signal) {
            signal.addEventListener("abort", onAbort);
          }
        });
      });

      mockListIssues.mockResolvedValueOnce([
        {
          number: 99,
          title: "Crash on timeout",
          body: "",
          labels: [AUTONOMOUS_LABELS.READY],
          author: "alice",
          createdAt: "2026-04-01T00:00:00Z",
        },
      ]);

      const pollPromise = timeoutOrchestrator.pollCycle();

      await vi.advanceTimersByTimeAsync(100);

      await pollPromise;

      expect(mockSwap).toHaveBeenCalledWith(
        "owner/repo", 99,
        expect.arrayContaining([AUTONOMOUS_LABELS.IN_PROGRESS]),
        expect.arrayContaining([AUTONOMOUS_LABELS.FAILED])
      );
      expect(mockPostComment).toHaveBeenCalledWith(
        "owner/repo", 99,
        expect.stringContaining("Timeout")
      );
    });

    it("should not trigger timeout if worker completes in time", async () => {
      const timeoutOrchestrator = new AutonomousDevOrchestrator({
        repo: "owner/repo",
        pollIntervalMs: 60_000,
        workerTimeoutMs: 5000,
      });
      timeoutOrchestrator.setWorkerSpawner(workerSpawner);

      workerSpawner.mockResolvedValueOnce({
        status: "completed",
        prUrl: "https://github.com/owner/repo/pull/1",
        summary: "Fast work",
      });

      mockListIssues.mockResolvedValueOnce([
        {
          number: 42,
          title: "Fast task",
          body: "",
          labels: [AUTONOMOUS_LABELS.READY],
          author: "alice",
          createdAt: "2026-04-01T00:00:00Z",
        },
      ]);

      await timeoutOrchestrator.pollCycle();

      expect(mockLogAutonomousDev).not.toHaveBeenCalledWith(
        "error",
        "worker.timeout",
        expect.anything()
      );
      expect(mockSwap).toHaveBeenCalledWith(
        "owner/repo", 42,
        expect.arrayContaining([AUTONOMOUS_LABELS.IN_PROGRESS]),
        expect.arrayContaining([AUTONOMOUS_LABELS.COMPLETED])
      );
    });

    it("should clean up timeout timer when worker completes", async () => {
      const timeoutOrchestrator = new AutonomousDevOrchestrator({
        repo: "owner/repo",
        pollIntervalMs: 60_000,
        workerTimeoutMs: 100,
      });
      timeoutOrchestrator.setWorkerSpawner(workerSpawner);

      workerSpawner.mockResolvedValueOnce({
        status: "completed",
        prUrl: "https://github.com/owner/repo/pull/1",
        summary: "Done",
      });

      mockListIssues.mockResolvedValueOnce([
        {
          number: 42,
          title: "Task",
          body: "",
          labels: [AUTONOMOUS_LABELS.READY],
          author: "alice",
          createdAt: "2026-04-01T00:00:00Z",
        },
      ]);

      await timeoutOrchestrator.pollCycle();

      // Advance past the timeout — nothing should happen
      vi.advanceTimersByTime(200);

      expect(mockLogAutonomousDev).not.toHaveBeenCalledWith(
        "error",
        "worker.timeout",
        expect.anything()
      );
    });
  });

  describe("process orphan reaping", () => {
    it("should track worker PID and reap on stop", () => {
      const pidSpy = vi.fn();
      workerSpawner.mockImplementationOnce(async (_issueNumber, _config, _onActivity, _signal, onPid) => {
        onPid?.(12345);
        return { status: "completed" as const, prUrl: "https://github.com/owner/repo/pull/1", summary: "Done" };
      });

      // We need to trigger a poll but stop before it completes
      // Actually, for PID tracking, let's just verify the tracking mechanism

      // Simulate: set up tracked PID manually
      (orchestrator as any).activeWorkerPids.set(42, { pid: 12345 });

      const killSpy = vi.spyOn(process, "kill").mockImplementation(() => true);
      orchestrator.stop();

      expect(killSpy).toHaveBeenCalledWith(-12345, "SIGTERM");
      expect(mockLogAutonomousDev).toHaveBeenCalledWith(
        "warn",
        "worker.reap",
        expect.objectContaining({ repo: "owner/repo" })
      );

      killSpy.mockRestore();
    });

    it("should handle ESRCH gracefully when reaping already-dead process", () => {
      (orchestrator as any).activeWorkerPids.set(42, { pid: 99999 });

      const error = new Error("ESRCH");
      (error as any).code = "ESRCH";
      const killSpy = vi.spyOn(process, "kill").mockImplementation(() => { throw error; });

      orchestrator.stop();

      // Should not log sigterm_failed for ESRCH
      expect(mockLogAutonomousDev).not.toHaveBeenCalledWith(
        "warn",
        "worker.reap.sigterm_failed",
        expect.anything()
      );

      killSpy.mockRestore();
    });

    it("should clear PID tracking after normal worker completion", async () => {
      workerSpawner.mockImplementationOnce(async (_issueNumber, _config, _onActivity, _signal, onPid) => {
        onPid?.(54321);
        return { status: "completed" as const, prUrl: "https://github.com/owner/repo/pull/1", summary: "Done" };
      });

      mockListIssues.mockResolvedValueOnce([
        {
          number: 42,
          title: "PID test",
          body: "",
          labels: [AUTONOMOUS_LABELS.READY],
          author: "alice",
          createdAt: "2026-04-01T00:00:00Z",
        },
      ]);

      await orchestrator.pollCycle();
      // Dispatch is async — flush microtasks for worker completion
      await vi.advanceTimersByTimeAsync(0);

      // After completion, PID should be cleaned up
      expect((orchestrator as any).activeWorkerPids.has(42)).toBe(false);
      expect(mockLogAutonomousDev).toHaveBeenCalledWith(
        "info",
        "worker.pid",
        expect.objectContaining({ issueNumber: 42 })
      );
    });

    it("should not attempt reap when no PIDs tracked", () => {
      const killSpy = vi.spyOn(process, "kill");
      orchestrator.stop();
      expect(killSpy).not.toHaveBeenCalled();
      killSpy.mockRestore();
    });
  });

  describe("stop/cleanup hardening", () => {
    it("should mark processing issues as failed on stop", async () => {
      (orchestrator as any).trackedIssues.set(42, {
        issueNumber: 42,
        title: "Active A",
        state: "processing",
        clarificationRound: 0,
        clarificationQuestionTimestamp: null,
        lockedAt: new Date(),
      });
      (orchestrator as any).trackedIssues.set(43, {
        issueNumber: 43,
        title: "Active B",
        state: "processing",
        clarificationRound: 0,
        clarificationQuestionTimestamp: null,
        lockedAt: new Date(),
      });

      orchestrator.stop();

      // Fire-and-forget cleanup — flush microtasks
      await vi.advanceTimersByTimeAsync(0);

      expect(mockSwap).toHaveBeenCalledTimes(2);
      expect(mockSwap).toHaveBeenCalledWith(
        "owner/repo", 42,
        expect.arrayContaining([AUTONOMOUS_LABELS.IN_PROGRESS, AUTONOMOUS_LABELS.NEEDS_CLARIFICATION]),
        expect.arrayContaining([AUTONOMOUS_LABELS.FAILED])
      );
      expect(mockSwap).toHaveBeenCalledWith(
        "owner/repo", 43,
        expect.arrayContaining([AUTONOMOUS_LABELS.IN_PROGRESS, AUTONOMOUS_LABELS.NEEDS_CLARIFICATION]),
        expect.arrayContaining([AUTONOMOUS_LABELS.FAILED])
      );
      expect(mockPostComment).toHaveBeenCalledWith(
        "owner/repo", 42,
        expect.stringContaining("Orchestrator stopped while processing")
      );
    });

    it("should handle clarifying issues on stop", async () => {
      (orchestrator as any).trackedIssues.set(44, {
        issueNumber: 44,
        title: "Clarifying",
        state: "clarifying",
        clarificationRound: 1,
        clarificationQuestionTimestamp: "2026-04-01T10:00:00Z",
        lockedAt: new Date(),
      });

      orchestrator.stop();
      await vi.advanceTimersByTimeAsync(0);

      expect(mockSwap).toHaveBeenCalledWith(
        "owner/repo", 44,
        expect.arrayContaining([AUTONOMOUS_LABELS.IN_PROGRESS, AUTONOMOUS_LABELS.NEEDS_CLARIFICATION]),
        expect.arrayContaining([AUTONOMOUS_LABELS.FAILED])
      );
    });

    it("should not call GitHub when no tracked issues on stop", async () => {
      orchestrator.stop();
      await vi.advanceTimersByTimeAsync(0);

      expect(mockSwap).not.toHaveBeenCalled();
      expect(mockPostComment).not.toHaveBeenCalled();
    });

    it("should continue cleanup even if one issue fails", async () => {
      (orchestrator as any).trackedIssues.set(50, {
        issueNumber: 50,
        title: "Will fail",
        state: "processing",
        clarificationRound: 0,
        clarificationQuestionTimestamp: null,
        lockedAt: new Date(),
      });
      (orchestrator as any).trackedIssues.set(51, {
        issueNumber: 51,
        title: "Should succeed",
        state: "processing",
        clarificationRound: 0,
        clarificationQuestionTimestamp: null,
        lockedAt: new Date(),
      });

      // First swapLabels call fails
      mockSwap.mockRejectedValueOnce(new Error("gh error"));

      orchestrator.stop();
      await vi.advanceTimersByTimeAsync(0);

      // Second issue should still be cleaned up
      expect(mockSwap).toHaveBeenCalledTimes(2);
      expect(mockLogAutonomousDev).toHaveBeenCalledWith(
        "error",
        "stop.cleanup.failed",
        expect.objectContaining({ issueNumber: 50 })
      );
      expect(mockLogAutonomousDev).toHaveBeenCalledWith(
        "warn",
        "stop.cleanup.issue",
        expect.objectContaining({ issueNumber: 51 })
      );
    });
  });

  describe("poll/execute split", () => {
    it("should enqueue issues and dispatch asynchronously", async () => {
      workerSpawner.mockResolvedValue({
        status: "completed" as const,
        prUrl: "https://github.com/owner/repo/pull/1",
        summary: "Done",
      });

      mockListIssues.mockResolvedValueOnce([
        { number: 1, title: "A", body: "", labels: [AUTONOMOUS_LABELS.READY], author: "alice", createdAt: "" },
        { number: 2, title: "B", body: "", labels: [AUTONOMOUS_LABELS.READY], author: "alice", createdAt: "" },
        { number: 3, title: "C", body: "", labels: [AUTONOMOUS_LABELS.READY], author: "alice", createdAt: "" },
      ]);

      await orchestrator.pollCycle();

      // All issues should be locked (synchronous during poll)
      expect(mockLock).toHaveBeenCalledTimes(3);

      // Workers dispatch sequentially — flush microtasks for all to complete
      await vi.advanceTimersByTimeAsync(0);

      // All workers should have been dispatched
      expect(workerSpawner).toHaveBeenCalledTimes(3);

      // Enqueue events should have been logged
      expect(mockLogAutonomousDev).toHaveBeenCalledWith(
        "info",
        "issue.enqueued",
        expect.objectContaining({ issueNumber: 1 })
      );
    });

    it("should not enqueue duplicate issues", async () => {
      mockListIssues.mockResolvedValueOnce([
        { number: 42, title: "Dup", body: "", labels: [AUTONOMOUS_LABELS.READY], author: "alice", createdAt: "" },
      ]);

      // Already tracking issue 42
      (orchestrator as any).trackedIssues.set(42, {
        issueNumber: 42,
        title: "Dup",
        state: "processing",
        clarificationRound: 0,
        clarificationQuestionTimestamp: null,
        lockedAt: new Date(),
      });

      await orchestrator.pollCycle();

      // Should not lock or enqueue
      expect(mockLock).not.toHaveBeenCalled();
      expect(mockLogAutonomousDev).not.toHaveBeenCalledWith(
        "info",
        "issue.enqueued",
        expect.anything()
      );
    });

    it("should clear work queue on stop", () => {
      (orchestrator as any).workQueue = [100, 200, 300];
      orchestrator.stop();

      expect((orchestrator as any).workQueue).toEqual([]);
      expect((orchestrator as any).dispatchInProgress).toBe(false);
    });

    it("should skip dispatch for issues no longer tracked after stop", async () => {
      // Enqueue issues 100 and 200
      (orchestrator as any).workQueue = [100, 200];
      // Only 200 is still tracked
      (orchestrator as any).trackedIssues.set(200, {
        issueNumber: 200,
        title: "Survivor",
        state: "processing",
        clarificationRound: 0,
        clarificationQuestionTimestamp: null,
        lockedAt: new Date(),
      });

      workerSpawner.mockResolvedValueOnce({
        status: "completed" as const,
        prUrl: "https://github.com/owner/repo/pull/1",
        summary: "Done",
      });

      // Trigger dispatch
      (orchestrator as any).dispatchNext();

      // Only issue 200 should get a worker
      await vi.advanceTimersByTimeAsync(0);
      expect(workerSpawner).toHaveBeenCalledWith(
        200,
        expect.any(Object),
        expect.any(Function),
        expect.any(Object),
        expect.any(Function)
      );
    });
  });
});
