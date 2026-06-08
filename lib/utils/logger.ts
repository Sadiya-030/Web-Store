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
