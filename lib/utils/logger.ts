/**
 * Development-friendly error logging utility
 * Logs errors to console in development mode
 * Can be extended to send to error tracking service in production
 */

export const logger = {
  error: (message: string, error?: Error | unknown): void => {
    if (process.env.NODE_ENV === "development") {
      console.error(`[Error] ${message}`, error);
    }
  },

  warn: (message: string, context?: Record<string, unknown>): void => {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[Warn] ${message}`, context);
    }
  },
};
