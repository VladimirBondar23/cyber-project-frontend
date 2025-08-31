import { env } from "@/env";

type Level = "debug" | "info" | "warn" | "error";
const levelOrder: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const threshold: Level = env.NODE_ENV === "production" ? "info" : "debug";

function log(level: Level, ...args: unknown[]) {
  if (levelOrder[level] < levelOrder[threshold]) return;
  const prefix = `[${new Date().toISOString()}] ${level.toUpperCase()}:`;
  (console as any)[level === "debug" ? "log" : level](prefix, ...args);
}

export const logger = {
  debug: (...a: unknown[]) => log("debug", ...a),
  info:  (...a: unknown[]) => log("info",  ...a),
  warn:  (...a: unknown[]) => log("warn",  ...a),
  error: (...a: unknown[]) => log("error", ...a),
};
