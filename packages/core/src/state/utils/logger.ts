/**
 * Simple logger utility for the application
 */
export const logger = {
  debug: (message: string): void => {
    if (process.env.DEBUG === 'true') {
      // eslint-disable-next-line no-console
      console.debug(`[DEBUG] ${message}`);
    }
  },

  info: (message: string): void => {
    // eslint-disable-next-line no-console
    console.info(`[INFO] ${message}`);
  },

  warn: (message: string): void => {
    // eslint-disable-next-line no-console
    console.warn(`[WARN] ${message}`);
  },

  error: (message: string): void => {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] ${message}`);
  },
};

export default logger;
