/**
 * Defines the available log levels, ordered by severity (lowest to highest).
 */
export enum LogLevel {
  DEBUG = 0, // Most verbose (e.g., component render cycles, state changes)
  INFO = 1, // General information (e.g., service calls, successful actions)
  WARN = 2, // Potential problems (e.g., deprecated usage, fallback logic)
  ERROR = 3, // Actual errors (e.g., failed network calls, exceptions)
  SILENT = 4, // Turns off all logging
}

/**
 * A custom, lightweight Logger class without third-party dependencies.
 * It provides structured, level-based logging for clear diagnostics.
 * This class is purely instance-based.
 */
export class Logger {
  private static minLevel: LogLevel = LogLevel.DEBUG;
  private readonly context: string;

  /**
   * Creates a new Logger instance with a specific context (module name).
   * @param context - The name of the module or service using this logger.
   */
  constructor(context: string = "APP") {
    this.context = context;
  }

  /**
   * Sets the global minimum log level for all logger instances.
   */
  public static setMinLevel(level: LogLevel): void {
    Logger.minLevel = level;
  }

  /**
   * Core logging logic shared by all instance methods.
   */
  private log(
    level: LogLevel,
    message: string,
    ...optionalParams: any[]
  ): void {
    if (level < Logger.minLevel) {
      return;
    }

    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    const prefix = `[${timestamp}] [${this.context}:${levelName}]`;
    const output = [prefix, message, ...optionalParams];

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(...output);
        break;
      case LogLevel.INFO:
        console.info(...output);
        break;
      case LogLevel.WARN:
        console.warn(...output);
        break;
      case LogLevel.ERROR:
        console.error(...output);
        break;
      default:
        console.log(...output);
    }
  }

  /** Logs detailed information, typically suppressed in production. */
  public debug(message: string, ...optionalParams: any[]): void {
    this.log(LogLevel.DEBUG, message, ...optionalParams);
  }

  /** Logs general application flow information. */
  public info(message: string, ...optionalParams: any[]): void {
    this.log(LogLevel.INFO, message, ...optionalParams);
  }

  /** Logs potential issues that do not immediately stop execution. */
  public warn(message: string, ...optionalParams: any[]): void {
    this.log(LogLevel.WARN, message, ...optionalParams);
  }

  /** Logs critical errors that prevent normal operation. */
  public error(message: string, ...optionalParams: any[]): void {
    this.log(LogLevel.ERROR, message, ...optionalParams);
  }

  /** Logs critical errors, including a full stack trace for exceptions. */
  public exception(
    error: Error,
    message?: string,
    ...optionalParams: any[]
  ): void {
    const msg = message || error.message;
    this.log(LogLevel.ERROR, `EXCEPTION: ${msg}`, error, ...optionalParams);
  }
}
