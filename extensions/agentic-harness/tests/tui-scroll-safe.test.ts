import { afterEach, describe, expect, it } from "vitest";
import { CURSOR_MARKER, TUI } from "@earendil-works/pi-tui";
import { installScrollSafeTuiPatch, setScrollSafeRenderQuiet } from "../tui-scroll-safe.js";

class MockTerminal {
  columns = 40;
  rows = 6;
  writes: string[] = [];

  start() {}
  stop() {}
  write(data: string) { this.writes.push(data); }
  hideCursor() { this.writes.push("\x1b[?25l"); }
  showCursor() { this.writes.push("\x1b[?25h"); }
  clear() { this.writes = []; }
}

afterEach(() => {
  setScrollSafeRenderQuiet(false);
});

describe("scroll-safe TUI patch", () => {
  it("does not write cursor escapes on no-change renders", () => {
    const terminal = new MockTerminal();
    const ui = new TUI(terminal as any, false);
    installScrollSafeTuiPatch(ui);
    ui.addChild({
      render: () => Array.from({ length: 12 }, (_, index) => `stable line ${index}`),
      invalidate() {},
    });

    (ui as any).doRender();
    terminal.clear();
    (ui as any).doRender();

    expect(terminal.writes).toEqual([]);
  });

  it("still repositions the cursor after real render output", () => {
    const terminal = new MockTerminal();
    const ui = new TUI(terminal as any, false);
    installScrollSafeTuiPatch(ui);
    let changed = false;
    ui.addChild({
      render: () => Array.from({ length: 12 }, (_, index) => {
        if (index === 10) return changed ? "visible line changed" : "visible line stable";
        if (index === 11) return `${CURSOR_MARKER}editor line`;
        return `stable line ${index}`;
      }),
      invalidate() {},
    });

    (ui as any).doRender();
    terminal.clear();
    (ui as any).doRender();
    expect(terminal.writes).toEqual([]);

    changed = true;
    (ui as any).doRender();

    expect(terminal.writes.join("")).toContain("\x1b[1B");
  });

  it("continues to write appended bottom content", () => {
    const terminal = new MockTerminal();
    const ui = new TUI(terminal as any, false);
    installScrollSafeTuiPatch(ui);
    let lines = Array.from({ length: 12 }, (_, index) => `stable line ${index}`);
    ui.addChild({
      render: () => lines,
      invalidate() {},
    });

    (ui as any).doRender();
    terminal.clear();
    lines = [...lines, "new bottom line"];
    (ui as any).doRender();

    const output = terminal.writes.join("");
    expect(output).toContain("new bottom line");
    expect(output).not.toContain("\x1b[3J");
  });

  it("coalesces non-forced render requests while quiet", () => {
    class FakeTui {
      calls = 0;
      requestRender(_force = false) { this.calls += 1; }
    }
    const tui = new FakeTui();
    installScrollSafeTuiPatch(tui);

    setScrollSafeRenderQuiet(true, tui);
    tui.requestRender();
    tui.requestRender();
    expect(tui.calls).toBe(0);

    setScrollSafeRenderQuiet(false, tui);
    expect(tui.calls).toBe(1);
    setScrollSafeRenderQuiet(false, tui);
    expect(tui.calls).toBe(1);
  });

  it("suppresses forced renders while quiet and flushes once afterward", () => {
    class FakeTui {
      calls = 0;
      renders = 0;
      terminal = new MockTerminal();
      hardwareCursorRow = 0;
      showHardwareCursor = false;

      requestRender(_force = false) {
        this.calls += 1;
        this.doRender();
      }

      doRender() { this.renders += 1; }
    }
    const tui = new FakeTui();
    installScrollSafeTuiPatch(tui);

    setScrollSafeRenderQuiet(true, tui);
    tui.requestRender(true);
    expect(tui.calls).toBe(1);
    expect(tui.renders).toBe(0);

    setScrollSafeRenderQuiet(false, tui);
    expect(tui.calls).toBe(2);
    expect(tui.renders).toBe(1);
  });

  it("skips already scheduled renders while quiet", () => {
    const terminal = new MockTerminal();
    const ui = new TUI(terminal as any, false);
    installScrollSafeTuiPatch(ui);
    ui.addChild({
      render: () => ["line"],
      invalidate() {},
    });

    setScrollSafeRenderQuiet(true, ui);
    (ui as any).doRender();
    expect(terminal.writes).toEqual([]);
    setScrollSafeRenderQuiet(false, ui);
  });

  it("restores terminal methods after render-output tracking", () => {
    const terminal = new MockTerminal();
    const originalWrite = terminal.write;
    const originalHideCursor = terminal.hideCursor;
    const originalShowCursor = terminal.showCursor;
    const ui = new TUI(terminal as any, false);
    installScrollSafeTuiPatch(ui);
    ui.addChild({
      render: () => ["line"],
      invalidate() {},
    });

    (ui as any).doRender();

    expect(terminal.write).toBe(originalWrite);
    expect(terminal.hideCursor).toBe(originalHideCursor);
    expect(terminal.showCursor).toBe(originalShowCursor);
  });
});
