import chalk from "chalk";

export default class Logger {
    static logError(message: string) {
        console.error(chalk.red.bold("❌ ERROR: "), chalk.red(message));
    }

    static logInfo(message: string) {
        console.log(chalk.blue.bold("ℹ️ INFO: "), chalk.blue(message));
    }

    static logWarning(message: string) {
        console.warn(chalk.yellow.bold("⚠️ WARNING: "), chalk.yellow(message));
    }
}
