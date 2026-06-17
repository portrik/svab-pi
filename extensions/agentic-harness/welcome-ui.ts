import type { Component, TUI } from "@earendil-works/pi-tui";
import type { ExtensionAPI, ExtensionCommandContext, Theme } from "@earendil-works/pi-coding-agent";
import { keyHint, keyText, rawKeyHint } from "@earendil-works/pi-coding-agent";
import { Text } from "@earendil-works/pi-tui";

export type HeaderFactory = (tui: TUI, theme: Theme) => Component & { dispose?(): void };

export type HeaderUi = {
  setHeader: (factory: HeaderFactory | undefined) => void;
  notify?: (message: string, level?: "info" | "warning" | "error") => void;
};

let welcomeVisible = true;

const BANNER_LINES = [
  "███████╗██╗   ██╗ █████╗ ██████╗     ██████╗ ██╗",
  "██╔════╝██║   ██║██╔══██╗██╔══██╗    ██╔══██╗██║",
  "███████╗██║   ██║███████║██████╔╝    ██████╔╝██║",
  "╚════██║╚██╗ ██╔╝██╔══██║██╔══██╗    ██╔═══╝ ██║",
  "███████║ ╚████╔╝ ██║  ██║██████╔╝    ██║     ██║",
  "╚══════╝  ╚═══╝  ╚═╝  ╚═╝╚═════╝     ╚═╝     ╚═╝",
];

function renderStaticBanner(theme: Theme): string {
  return BANNER_LINES.map((line) => theme.bold(theme.fg("accent", line))).join("\n");
}

class WelcomeHeaderComponent implements Component {
  constructor(private readonly theme: Theme) {}

  invalidate(): void {}

  render(width: number): string[] {
    return new Text(this.content(), 1, 0).render(width);
  }

  private content(): string {
    const banner = renderStaticBanner(this.theme);
    const tagline = this.theme.fg("dim", "Šváb Pi Engineering Discipline Extension");
    const tipLine = this.theme.fg("muted", "Tip: Always start with /clarify. Then activate a durable /goal.");
    const clarifyLine = this.theme.fg("dim", "Never skip /clarify — it prevents wasted effort.");
    const hints = [
      keyHint("app.interrupt", "to interrupt"),
      keyHint("app.clear", "to clear"),
      rawKeyHint(`${keyText("app.clear")} twice`, "to exit"),
      keyHint("app.tools.expand", "to expand tools"),
      rawKeyHint("/", "for commands"),
      rawKeyHint("!", "to run bash"),
    ].join("\n");

    return `\n${banner}\n${tagline}\n\n${tipLine}\n${clarifyLine}\n\n${hints}`;
  }
}

export function createWelcomeHeader(): HeaderFactory {
  return (_tui, theme) => new WelcomeHeaderComponent(theme);
}

export function showWelcomeHeader(ui: HeaderUi): void {
  welcomeVisible = true;
  ui.setHeader(createWelcomeHeader());
}

export function dismissWelcomeHeader(ui: HeaderUi): void {
  welcomeVisible = false;
  ui.setHeader(undefined);
}

export function toggleWelcomeHeader(ui: HeaderUi): boolean {
  if (welcomeVisible) {
    dismissWelcomeHeader(ui);
    return false;
  }
  showWelcomeHeader(ui);
  return true;
}

export function isWelcomeVisible(): boolean {
  return welcomeVisible;
}

export function registerWelcomeCommand(pi: ExtensionAPI): void {
  pi.registerCommand("welcome", {
    description: "Show, hide, or toggle the Agentic Harness welcome header",
    handler: async (args: string, ctx: ExtensionCommandContext) => {
      const ui = ctx.ui as HeaderUi;
      const action = args.trim().toLowerCase();
      if (action === "off" || action === "hide" || action === "dismiss") {
        dismissWelcomeHeader(ui);
        ui.notify?.("Welcome header hidden", "info");
        return;
      }
      if (action === "on" || action === "show" || action === "restore") {
        showWelcomeHeader(ui);
        ui.notify?.("Welcome header shown", "info");
        return;
      }
      const visible = toggleWelcomeHeader(ui);
      ui.notify?.(visible ? "Welcome header shown" : "Welcome header hidden", "info");
    },
  });
}
