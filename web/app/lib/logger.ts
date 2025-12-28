import { formatISO } from "date-fns";

type Level = "DEBUG" | "INFO" | "WARN" | "ERROR";

function print(level: Level, ...args: unknown[]) {
  const timestamp = formatISO(new Date());
  console.log(`[${timestamp}] [${level}]`, ...args);
}

export const logger = {
  debug: (...args: unknown[]) => print("DEBUG", ...args),
  info: (...args: unknown[]) => print("INFO", ...args),
  warn: (...args: unknown[]) => print("WARN", ...args),
  error: (...args: unknown[]) => print("ERROR", ...args),
};
