import chokidar, { type FSWatcher } from "chokidar";
import { DEFAULT_IGNORED_DIRS } from "../constants";

import { CommandType } from "../types";

export default class Recorder {
    basePath: string;
    commands: CommandType[];
    watcher: FSWatcher | undefined;

    constructor() {
        this.basePath = process.cwd();
        this.commands = [];
    }

    record() {
        this.watcher = chokidar.watch(".", {
            ignored: (path, _stats) => {
                let flag = false;

                for (const d of DEFAULT_IGNORED_DIRS) {
                    if (path.includes(d)) {
                        flag = true;
                        break;
                    }
                }

                return flag;
            },
            persistent: true,
        });

        this.watcher
            .on("add", (path) => this.addFile(path))
            .on("change", (path) => this.changeFile(path))
            .on("unlink", (path) => this.unlink(path));
    }

    async stop(): Promise<string> {
        if (!this.watcher) {
            throw new Error("No recording found. Start recording before stopping.");
        }

        try {
            await this.watcher.close();
            this.watcher = undefined;
            return "✅ Recording stopped successfully.";
        } catch (error) {
            throw new Error(`Error stopping the watcher: ${error}`);
        }
    }

    getCommands(): CommandType[] {
        return this.commands;
    }

    private addFile(path: string): void {
        console.log(`File ${path} has been added`);
    }

    private changeFile(path: string): void {
        console.log(`File ${path} has been changed`);
    }

    private unlink(path: string): void {
        console.log(`File ${path} has been removed`);
    }
}
