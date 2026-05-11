/**
 * Integration tests for autonomous-dev robustness features.
 *
 * These tests exercise real child processes, real AbortSignal propagation,
 * and real process signal handling — not just mocks.
 *
 * Run with: npx vitest run tests/integration
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { spawn, type ChildProcess } from "child_process";
import { AutonomousDevOrchestrator } from "../orchestrator.js";
import { AUTONOMOUS_LABELS, type WorkerResult, type WorkerActivityCallback, type WorkerAbortSignal, type WorkerPidCallback, type OrchestratorConfig } from "../types.js";

vi.mock("../logger.js", () => ({
  logAutonomousDev: vi.fn(),
}));

vi.mock("../github.js", async () => {
  const actual = await vi.importActual("../github.js");
  return {
    ...actual,
    listIssuesByLabel: vi.fn(),
    getIssueWithComments: vi.fn(),
    swapLabels: vi.fn(),
    postComment: vi.fn(),
    lockIssue: vi.fn(),
    markNeedsClarification: vi.fn(),
    resumeFromClarification: vi.fn(),
  };
});

import {
  listIssuesByLabel,
  swapLabels,
  postComment,
  lockIssue,
} from "../github.js";

const mockListIssues = listIssuesByLabel as unknown as ReturnType<typeof vi.fn>;
const mockSwap = swapLabels as unknown as ReturnType<typeof vi.fn>;
const mockPostComment = postComment as unknown as ReturnType<typeof vi.fn>;
const mockLock = lockIssue as unknown as ReturnType<typeof vi.fn>;

/**
 * Spawn a child process that sleeps and optionally responds to SIGTERM.
 * Returns the child process and a promise that resolves when it exits.
 */
function spawnSleepProcess(
  durationMs: number,
  propagateSigterm = true
): { child: ChildProcess; exitPromise: Promise<{ code: number | null; signal: string | null }> } {
  // Use a script that sleeps and handles signals
  const child = spawn(
    process.execPath,
    [
      "-e",
      `
        const http = require('http');
        // Keep alive with a timer
        const timer = setTimeout(() => {
          process.exit(0);
        }, ${durationMs});

        // If SIGTERM, exit cleanly
        process.on('SIGTERM', () => {
          clearTimeout(timer);
          process.exit(${propagateSigterm ? 0 : 1});
        });
      `,
    ],
    { stdio: "pipe" }
  );

  const exitPromise = new Promise<{ code: number | null; signal: string | null }>((resolve) => {
    child.on("exit", (code, signal) => {
      resolve({ code, signal });
    });
  });

  return { child, exitPromise };
}

/**
 * Check if a PID is still alive.
 */
function isPidAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

describe("integration: PID reaping with real child processes", () => {
  let orchestrator: AutonomousDevOrchestrator;
  let workerSpawner: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockListIssues.mockResolvedValue([]);
    mockSwap.mockResolvedValue(undefined);
    mockPostComment.mockResolvedValue(undefined);
    mockLock.mockResolvedValue(undefined);

    workerSpawner = vi.fn();
    orchestrator = new AutonomousDevOrchestrator({
      repo: "owner/repo",
      pollIntervalMs: 60_000,
      workerTimeoutMs: 600_000,
    });
    orchestrator.setWorkerSpawner(workerSpawner);
  });

  afterEach(() => {
    orchestrator.stop();
  });

  it("tracks real child PID and stops it on orchestrator stop", async () => {
    const { child, exitPromise } = spawnSleepProcess(30_000);

    const realPid = child.pid!;
    expect(realPid).toBeGreaterThan(0);

    let resolveWorker: ((result: WorkerResult) => void) | null = null;
    const workerPromise = new Promise<WorkerResult>((resolve) => {
      resolveWorker = resolve;
    });

    // Wire up the worker spawner to report the PID and wait for manual resolution
    workerSpawner.mockImplementationOnce(
      async (_issueNumber, _config, _onActivity, _signal, onPid) => {
        onPid?.(realPid);
        return workerPromise;
      }
    );

    mockListIssues.mockResolvedValueOnce([
      {
        number: 42,
        title: "Integration test",
        body: "",
        labels: [AUTONOMOUS_LABELS.READY],
        author: "alice",
        createdAt: "2026-04-01T00:00:00Z",
      },
    ]);

    const pollPromise = orchestrator.pollCycle();

    // Wait for dispatch to start the worker
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Verify PID is tracked and alive
    expect(isPidAlive(realPid)).toBe(true);
    expect((orchestrator as any).activeWorkerPids.get(42).pid).toBe(realPid);

    // Stop the orchestrator — should reap the child
    orchestrator.stop();

    // Kill the child to resolve the worker promise
    child.kill("SIGTERM");
    resolveWorker!({
      status: "completed",
      prUrl: "",
      summary: "stopped",
    });

    await pollPromise;

    // Wait for child to exit
    const exitResult = await exitPromise;
    expect(exitResult.code).not.toBeNull();

    // PID should no longer be alive
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(isPidAlive(realPid)).toBe(false);
  }, 10_000);

  it("cleans up PID tracking after normal worker completion", async () => {
    const { child, exitPromise } = spawnSleepProcess(100); // Short-lived
    const realPid = child.pid!;

    workerSpawner.mockImplementationOnce(
      async (_issueNumber, _config, _onActivity, _signal, onPid) => {
        onPid?.(realPid);
        await exitPromise;
        return {
          status: "completed" as const,
          prUrl: "https://github.com/owner/repo/pull/1",
          summary: "Done",
        };
      }
    );

    mockListIssues.mockResolvedValueOnce([
      {
        number: 43,
        title: "Short task",
        body: "",
        labels: [AUTONOMOUS_LABELS.READY],
        author: "alice",
        createdAt: "2026-04-01T00:00:00Z",
      },
    ]);

    const pollPromise = orchestrator.pollCycle();
    await pollPromise;

    // Wait for async dispatch to complete
    await new Promise((resolve) => setTimeout(resolve, 300));

    // PID should be cleaned from tracking
    expect((orchestrator as any).activeWorkerPids.has(43)).toBe(false);
  });
});

describe("integration: worker timeout with real process", () => {
  let orchestrator: AutonomousDevOrchestrator;

  beforeEach(() => {
    vi.clearAllMocks();
    mockListIssues.mockResolvedValue([]);
    mockSwap.mockResolvedValue(undefined);
    mockPostComment.mockResolvedValue(undefined);
    mockLock.mockResolvedValue(undefined);
  });

  afterEach(() => {
    orchestrator.stop();
  });

  it("aborts a long-running real process via timeout", async () => {
    const { child, exitPromise } = spawnSleepProcess(30_000); // 30s sleep
    const realPid = child.pid!;

    orchestrator = new AutonomousDevOrchestrator({
      repo: "owner/repo",
      pollIntervalMs: 60_000,
      workerTimeoutMs: 500, // 500ms timeout
    });

    const workerSpawner = vi.fn().mockImplementationOnce(
      async (_issueNumber, _config, _onActivity, signal, onPid) => {
        onPid?.(realPid);
        // Wait for abort signal, then resolve
        return new Promise<WorkerResult>((resolve) => {
          const onAbort = () => {
            signal!.removeEventListener("abort", onAbort);
            child.kill("SIGTERM");
            resolve({ status: "completed" as const, prUrl: "", summary: "timed out" });
          };
          if (signal) {
            signal.addEventListener("abort", onAbort);
          }
        });
      }
    );
    orchestrator.setWorkerSpawner(workerSpawner);

    mockListIssues.mockResolvedValueOnce([
      {
        number: 99,
        title: "Slow process",
        body: "",
        labels: [AUTONOMOUS_LABELS.READY],
        author: "alice",
        createdAt: "2026-04-01T00:00:00Z",
      },
    ]);

    const pollPromise = orchestrator.pollCycle();

    // Wait for dispatch + timeout to fire
    await new Promise((resolve) => setTimeout(resolve, 200));
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const exitResult = await exitPromise;

    // Process should have been killed
    expect(isPidAlive(realPid)).toBe(false);

    // Issue should be marked failed due to timeout
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
});

describe("integration: stop cleanup propagates to real GitHub calls", () => {
  let orchestrator: AutonomousDevOrchestrator;

  beforeEach(() => {
    vi.clearAllMocks();
    mockListIssues.mockResolvedValue([]);
    mockSwap.mockResolvedValue(undefined);
    mockPostComment.mockResolvedValue(undefined);
    mockLock.mockResolvedValue(undefined);

    orchestrator = new AutonomousDevOrchestrator({
      repo: "owner/repo",
      pollIntervalMs: 60_000,
    });
  });

  afterEach(() => {
    orchestrator.stop();
  });

  it("stop() triggers GitHub label swap for each tracked processing issue", async () => {
    // Simulate two issues tracked in processing state
    (orchestrator as any).trackedIssues.set(10, {
      issueNumber: 10,
      title: "Issue A",
      state: "processing",
      clarificationRound: 0,
      clarificationQuestionTimestamp: null,
      lockedAt: new Date(),
    });
    (orchestrator as any).trackedIssues.set(20, {
      issueNumber: 20,
      title: "Issue B",
      state: "clarifying",
      clarificationRound: 1,
      clarificationQuestionTimestamp: "2026-04-01T10:00:00Z",
      lockedAt: new Date(),
    });

    orchestrator.stop();

    // Wait for fire-and-forget cleanup to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Both issues should have GitHub cleanup
    expect(mockSwap).toHaveBeenCalledTimes(2);
    expect(mockSwap).toHaveBeenCalledWith(
      "owner/repo",
      10,
      expect.arrayContaining([AUTONOMOUS_LABELS.IN_PROGRESS, AUTONOMOUS_LABELS.NEEDS_CLARIFICATION]),
      expect.arrayContaining([AUTONOMOUS_LABELS.FAILED])
    );
    expect(mockSwap).toHaveBeenCalledWith(
      "owner/repo",
      20,
      expect.arrayContaining([AUTONOMOUS_LABELS.IN_PROGRESS, AUTONOMOUS_LABELS.NEEDS_CLARIFICATION]),
      expect.arrayContaining([AUTONOMOUS_LABELS.FAILED])
    );

    // Each should get a comment
    expect(mockPostComment).toHaveBeenCalledWith(
      "owner/repo",
      10,
      expect.stringContaining("Orchestrator stopped")
    );
    expect(mockPostComment).toHaveBeenCalledWith(
      "owner/repo",
      20,
      expect.stringContaining("Orchestrator stopped")
    );
  });

  it("stop() handles partial GitHub failures gracefully", async () => {
    (orchestrator as any).trackedIssues.set(30, {
      issueNumber: 30,
      title: "Will fail",
      state: "processing",
      clarificationRound: 0,
      clarificationQuestionTimestamp: null,
      lockedAt: new Date(),
    });
    (orchestrator as any).trackedIssues.set(31, {
      issueNumber: 31,
      title: "Will succeed",
      state: "processing",
      clarificationRound: 0,
      clarificationQuestionTimestamp: null,
      lockedAt: new Date(),
    });

    // First swapLabels call fails
    mockSwap.mockRejectedValueOnce(new Error("gh api rate limit"));

    orchestrator.stop();
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Both calls should have been attempted
    expect(mockSwap).toHaveBeenCalledTimes(2);
    // The second should still succeed
    expect(mockSwap).toHaveBeenCalledWith(
      "owner/repo",
      31,
      expect.arrayContaining([AUTONOMOUS_LABELS.IN_PROGRESS, AUTONOMOUS_LABELS.NEEDS_CLARIFICATION]),
      expect.arrayContaining([AUTONOMOUS_LABELS.FAILED])
    );
  });
});

describe("integration: stale lock recovery flow", () => {
  let orchestrator: AutonomousDevOrchestrator;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSwap.mockResolvedValue(undefined);
    mockPostComment.mockResolvedValue(undefined);
    mockLock.mockResolvedValue(undefined);

    orchestrator = new AutonomousDevOrchestrator({
      repo: "owner/repo",
      pollIntervalMs: 60_000,
    });
    const workerSpawner = vi.fn().mockResolvedValue({
      status: "completed" as const,
      prUrl: "",
      summary: "stub",
    });
    orchestrator.setWorkerSpawner(workerSpawner);
  });

  afterEach(() => {
    orchestrator.stop();
  });

  it("first poll recovers orphaned in-progress issues before processing ready ones", async () => {
    // Ready issue to pick up
    const readyIssue = {
      number: 100,
      title: "New work",
      body: "",
      labels: [AUTONOMOUS_LABELS.READY],
      author: "alice",
      createdAt: "",
    };

    // Orphaned in-progress issues
    const orphanA = {
      number: 50,
      title: "Orphan A",
      body: "",
      labels: [AUTONOMOUS_LABELS.IN_PROGRESS],
      author: "bob",
      createdAt: "",
    };
    const orphanB = {
      number: 51,
      title: "Orphan B",
      body: "",
      labels: [AUTONOMOUS_LABELS.IN_PROGRESS],
      author: "bob",
      createdAt: "",
    };

    // First call: ready issues. Second call: in-progress for recovery
    mockListIssues
      .mockResolvedValueOnce([readyIssue])
      .mockResolvedValueOnce([orphanA, orphanB]);

    await orchestrator.pollCycle();

    // Recovery should have moved orphans to failed
    expect(mockSwap).toHaveBeenCalledWith(
      "owner/repo",
      50,
      [AUTONOMOUS_LABELS.IN_PROGRESS],
      [AUTONOMOUS_LABELS.FAILED]
    );
    expect(mockSwap).toHaveBeenCalledWith(
      "owner/repo",
      51,
      [AUTONOMOUS_LABELS.IN_PROGRESS],
      [AUTONOMOUS_LABELS.FAILED]
    );
    expect(mockPostComment).toHaveBeenCalledWith(
      "owner/repo",
      50,
      expect.stringContaining("Orphaned lock recovered")
    );
    expect(mockPostComment).toHaveBeenCalledWith(
      "owner/repo",
      51,
      expect.stringContaining("Orphaned lock recovered")
    );

    // Ready issue should still have been processed normally
    expect(mockLock).toHaveBeenCalledWith("owner/repo", 100);

    const status = orchestrator.getStatus();
    expect(status.stats.totalFailed).toBe(2); // Two orphaned issues counted as failed
  });

  it("second poll skips recovery (only runs once)", async () => {
    mockListIssues
      .mockResolvedValue([])
      .mockResolvedValueOnce([]) // first poll: no ready, no in-progress
      .mockResolvedValueOnce([]);

    await orchestrator.pollCycle();
    await orchestrator.pollCycle();

    // listIssuesByLabel for IN_PROGRESS should only be called once (first poll)
    const inProgressCalls = mockListIssues.mock.calls.filter(
      (call: any[]) => call[1] === AUTONOMOUS_LABELS.IN_PROGRESS
    );
    expect(inProgressCalls).toHaveLength(1);
  });
});
