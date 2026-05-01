import { homedir } from "os";
import { join } from "path";

function expandHomePath(path: string, homeDir: string): string {
  if (path === "~") return homeDir;
  if (path.startsWith("~/")) return join(homeDir, path.slice(2));
  return path;
}

export function resolvePiAgentDir(
  envDir = process.env.PI_CODING_AGENT_DIR,
  homeDir = homedir(),
): string {
  if (!envDir) return join(homeDir, ".pi", "agent");
  return expandHomePath(envDir, homeDir);
}

export function resolvePiSessionDir(
  envDir = process.env.PI_CODING_AGENT_SESSION_DIR,
  homeDir = homedir(),
): string | undefined {
  if (!envDir) return undefined;
  return expandHomePath(envDir, homeDir);
}
