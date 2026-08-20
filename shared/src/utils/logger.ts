type LogMethod = (message: string, ...args: unknown[]) => void

export interface Logger {
  log: LogMethod
  info: LogMethod
  warn: LogMethod
  error: LogMethod
}

/**
 * Prefixed console wrapper. With several microfrontends writing to one console,
 * an unprefixed `console.log` gives no clue which app produced it.
 */
export function createLogger(prefix: string): Logger {
  const tag = `[${prefix}]`
  return {
    log: (message, ...args) => console.log(tag, message, ...args),
    info: (message, ...args) => console.info(tag, message, ...args),
    warn: (message, ...args) => console.warn(tag, message, ...args),
    error: (message, ...args) => console.error(tag, message, ...args),
  }
}
