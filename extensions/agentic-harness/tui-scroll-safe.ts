import { TUI } from "@earendil-works/pi-tui";

const PATCHED = Symbol.for("svab-pi.tui-scroll-safe.patched");
const CURSOR_STATE = Symbol.for("svab-pi.tui-scroll-safe.cursor-state");
const RENDER_EMITTED_OUTPUT = Symbol.for("svab-pi.tui-scroll-safe.render-emitted-output");
const POSITIONING_CURSOR = Symbol.for("svab-pi.tui-scroll-safe.positioning-cursor");

type CursorState = {
  row?: number;
  col?: number;
  visible?: boolean;
};

type PatchedTui = {
  terminal: {
    write(data: string): void;
    hideCursor(): void;
    showCursor(): void;
  };
  hardwareCursorRow: number;
  showHardwareCursor: boolean;
  [CURSOR_STATE]?: CursorState;
  [RENDER_EMITTED_OUTPUT]?: boolean;
  requestRender?(force?: boolean): void;
  [POSITIONING_CURSOR]?: boolean;
};

export function setScrollSafeRenderQuiet(_active: boolean, tui?: unknown): void {
  if (tui) installScrollSafeTuiPatch(tui);
}

/**
 * Avoid terminal output for no-op renders.
 *
 * pi-tui's renderer calls positionHardwareCursor() even when rendered lines are
 * unchanged. The stock implementation writes cursor-position/hide escapes on
 * every render, so any extension timer that merely requests a render can still
 * produce terminal output and pull native scrollback back to the live bottom.
 *
 * The patch tracks whether the current render already emitted terminal output.
 * It skips cursor writes only when no prior output occurred and the requested
 * cursor row/column/visibility already match the last positioned state. If the
 * render touched chat/tool/editor lines, cursor positioning still runs so TUI's
 * hardware cursor bookkeeping stays synchronized.
 */
export function installScrollSafeTuiPatch(tui?: unknown): void {
  const proto = (tui && typeof tui === "object" ? Object.getPrototypeOf(tui) : TUI.prototype) as Record<PropertyKey, unknown> | undefined;
  if (!proto || proto[PATCHED]) return;

  const originalRequestRender = proto.requestRender;
  if (typeof originalRequestRender === "function") {
    proto.requestRender = function requestRender(this: PatchedTui, force = false): void {
      return (originalRequestRender as (this: PatchedTui, force?: boolean) => void).call(this, force);
    };
  }

  const originalDoRender = proto.doRender;
  if (typeof originalDoRender === "function") {
    proto.doRender = function doRender(this: PatchedTui, ...args: unknown[]): unknown {
      const terminal = this.terminal;
      const originalWrite = terminal.write;
      const originalHideCursor = terminal.hideCursor;
      const originalShowCursor = terminal.showCursor;
      const write = originalWrite.bind(terminal);
      const hideCursor = originalHideCursor.bind(terminal);
      const showCursor = originalShowCursor.bind(terminal);
      const markRenderOutput = () => {
        if (!this[POSITIONING_CURSOR]) this[RENDER_EMITTED_OUTPUT] = true;
      };

      this[RENDER_EMITTED_OUTPUT] = false;
      terminal.write = (data: string) => {
        markRenderOutput();
        return write(data);
      };
      terminal.hideCursor = () => {
        markRenderOutput();
        return hideCursor();
      };
      terminal.showCursor = () => {
        markRenderOutput();
        return showCursor();
      };

      try {
        return originalDoRender.apply(this, args);
      } finally {
        terminal.write = originalWrite;
        terminal.hideCursor = originalHideCursor;
        terminal.showCursor = originalShowCursor;
        this[POSITIONING_CURSOR] = false;
        this[RENDER_EMITTED_OUTPUT] = false;
      }
    };
  }

  const originalPositionHardwareCursor = proto.positionHardwareCursor;

  proto.positionHardwareCursor = function positionHardwareCursor(
    this: PatchedTui,
    cursorPos: { row: number; col: number } | null,
    totalLines: number,
  ): void {
    const previous = this[CURSOR_STATE] ?? {};
    const renderAlreadyWrote = this[RENDER_EMITTED_OUTPUT] === true;

    if (!cursorPos || totalLines <= 0) {
      if (!renderAlreadyWrote && previous.visible === false) return;
      this[POSITIONING_CURSOR] = true;
      try {
        if (typeof originalPositionHardwareCursor === "function") {
          originalPositionHardwareCursor.call(this, cursorPos, totalLines);
        } else {
          this.terminal.hideCursor();
        }
      } finally {
        this[POSITIONING_CURSOR] = false;
      }
      this[CURSOR_STATE] = { ...previous, visible: false };
      return;
    }

    const targetRow = Math.max(0, Math.min(cursorPos.row, totalLines - 1));
    const targetCol = Math.max(0, cursorPos.col);
    const targetVisible = this.showHardwareCursor;

    if (
      !renderAlreadyWrote
      && previous.row === targetRow
      && previous.col === targetCol
      && previous.visible === targetVisible
      && this.hardwareCursorRow === targetRow
    ) {
      return;
    }

    this[POSITIONING_CURSOR] = true;
    try {
      if (typeof originalPositionHardwareCursor === "function") {
        originalPositionHardwareCursor.call(this, cursorPos, totalLines);
      }
    } finally {
      this[POSITIONING_CURSOR] = false;
    }

    this[CURSOR_STATE] = { row: targetRow, col: targetCol, visible: targetVisible };
  };

  proto[PATCHED] = true;
}
