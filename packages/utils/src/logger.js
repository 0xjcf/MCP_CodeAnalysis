import chalk from 'chalk';
export class Logger {
    constructor(context) {
        this.context = context;
    }
    debug(message, ...args) {
        if (process.env.NODE_ENV !== 'production') {
            console.debug(chalk.blue(`[${this.context}] ${message}`), ...args);
        }
    }
    info(message, ...args) {
        console.info(chalk.green(`[${this.context}] ${message}`), ...args);
    }
    warn(message, ...args) {
        console.warn(chalk.yellow(`[${this.context}] ${message}`), ...args);
    }
    error(message, ...args) {
        console.error(chalk.red(`[${this.context}] ${message}`), ...args);
    }
}
