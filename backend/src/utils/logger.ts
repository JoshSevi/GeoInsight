/**
 * Simple logger utility for enterprise-level logging
 */
export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

class Logger {
  private nodeEnv: string;

  constructor() {
    this.nodeEnv = process.env.NODE_ENV || "development";
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    meta?: unknown
  ): string {
    const timestamp = new Date().toISOString();
    const metaString = meta ? ` ${JSON.stringify(meta)}` : "";
    return `[${timestamp}] [${level}] ${message}${metaString}`;
  }

  private log(level: LogLevel, message: string, meta?: unknown): void {
    const formattedMessage = this.formatMessage(level, message, meta);

    switch (level) {
      case LogLevel.DEBUG:
        if (this.nodeEnv === "development") {
          console.debug(formattedMessage);
        }
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage);
        break;
    }
  }

  debug(message: string, meta?: unknown): void {
    this.log(LogLevel.DEBUG, message, meta);
  }

  info(message: string, meta?: unknown): void {
    this.log(LogLevel.INFO, message, meta);
  }

  warn(message: string, meta?: unknown): void {
    this.log(LogLevel.WARN, message, meta);
  }

  error(message: string, error?: Error | unknown, meta?: unknown): void {
    const metaObj =
      meta && typeof meta === "object" && !Array.isArray(meta) ? meta : {};
    const errorMeta =
      error instanceof Error
        ? {
            ...metaObj,
            error: {
              message: error.message,
              stack: error.stack,
              name: error.name,
            },
          }
        : { ...metaObj, error };
    this.log(LogLevel.ERROR, message, errorMeta);
  }
}

export const logger = new Logger();
