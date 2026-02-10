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
 */
export class Logger {
  // ------------------------------------------------------------------
  // STATIC CONFIGURATION
  // ------------------------------------------------------------------

  // Default minimum level to display. Logs below this level are ignored.
  // Shared across all Logger instances — one knob to control global verbosity.
  private static minLevel: LogLevel = LogLevel.DEBUG;

  /**
   * Sets the minimum log level that will be displayed.
   * Logs with a severity less than this level will be suppressed.
   * This is a global setting shared by all Logger instances.
   * @param level - The new minimum LogLevel.
   */
  public static setMinLevel(level: LogLevel): void {
    Logger.minLevel = level;
  }

  // ------------------------------------------------------------------
  // INSTANCE CONFIGURATION
  // ------------------------------------------------------------------

  // Name of the module or service using this logger instance (useful for filtering)
  private readonly moduleName: string;

  /**
   * Creates a new Logger instance scoped to a specific module.
   * @param moduleName - The name of the module or service (e.g., 'AuthService', 'PaymentAPI').
   */
  constructor(moduleName: string) {
    this.moduleName = moduleName;
  }

  // ------------------------------------------------------------------
  // CORE LOGGING MECHANISM
  // ------------------------------------------------------------------

  /**
   * Central function that handles formatting and conditional output.
   * @param level - The severity level of the current log call.
   * @param message - The main log message (string).
   * @param optionalParams - Additional data (objects, arrays, errors) to log.
   */
  private log(
    level: LogLevel,
    message: string,
    ...optionalParams: any[]
  ): void {
    // 1. Level Check (Conditional Logging)
    if (level < Logger.minLevel) {
      return; // Suppress logs below the configured minimum level
    }

    // 2. Formatting
    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level]; // e.g., 'DEBUG', 'INFO'
    const prefix = `[${timestamp}] [${this.moduleName}:${levelName}]`;

    // 3. Output to Console
    // Use the native console methods for appropriate styling and functionality
    // (e.g., console.error provides stack traces; console.warn is styled)
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

  // ------------------------------------------------------------------
  // PUBLIC API METHODS
  // ------------------------------------------------------------------

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
    // Ensure the Error object itself is logged as the primary optional parameter
    // to maximize the chance of logging the full stack trace.
    this.log(LogLevel.ERROR, `EXCEPTION: ${msg}`, error, ...optionalParams);
  }
}
