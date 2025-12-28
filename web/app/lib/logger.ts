import { format } from "date-fns";

function print(
  func: (...args: unknown[]) => void,
  ...args: unknown[]
) {
  const timestamp = format(new Date(), "HH:mm:ss.SSS");
  func(`[${timestamp}]`, ...args);
}

export const logger = {
  debug: (...args: unknown[]) => print(console.debug, ...args),
  log: (...args: unknown[]) => print(console.log, ...args),
  info: (...args: unknown[]) => print(console.info, ...args),
  warn: (...args: unknown[]) => print(console.warn, ...args),
  error: (...args: unknown[]) => print(console.error, ...args),
};
