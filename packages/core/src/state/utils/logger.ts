/**
 * Simple logger utility for the application
 */
export const logger = {
  debug: (message: string): void => {
    if (process.env.DEBUG === "true") {
      console.debug(`[DEBUG] ${message}`);
    }
  },

  info: (message: string): void => {
    console.info(`[INFO] ${message}`);
  },

  warn: (message: string): void => {
    console.warn(`[WARN] ${message}`);
  },

  error: (message: string): void => {
    console.error(`[ERROR] ${message}`);
  },
};

export default logger;
