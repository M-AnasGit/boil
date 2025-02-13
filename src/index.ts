import { Command } from "commander";
import readline from 'readline';

import Recorder from "./classes/recorder";
import Logger from "./classes/logger";

import { CommandType, SaveActionOptions, UseActionOptions } from "./types";

const program = new Command();
const recorder = new Recorder();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

program.name("boil").description("A CLI tool to manage your boilerplate").version("1.0.0");

program
    .command("record")
    .description("Start recording a boil process")
    .action(async () => {
        Logger.logInfo(
            "Recording a boil process. Perform actions that you would like to be saved for future similar projects."
        );
        recorder.record();

        rl.on("line", (input) => {
            const args = input.trim().split(" ");

            if (args[0] === "save") {
                program.parse(["node", "cli", ...args]);
            } else if (args[0] === "exit") {
                Logger.logInfo("Exiting recording session...");
                rl.close();
                process.exit(0);
            } else {
                Logger.logError("Unknown command. Type 'save --name myfile --local/--global' or 'exit'.");
            }
        });
    });

program
    .command("save")
    .description("Save the boil process file globally or locally (but not both)")
    .option("-n, --name <name>", "The name of the file name")
    .option("-l, --local", "Save the file locally")
    .option("-g, --global", "Save the process globally")
    .action(async (options: SaveActionOptions) => {
        try {
            const commands: CommandType[] = recorder.getCommands();
            const { name, local, global } = options;

            if ((!name && local && global) || (!local && !local)) {
                Logger.logWarning(
                    "You must specify a name for the process and either --local or --global, but not both."
                );
                return;
            }

            const stop_msg = await recorder.stop();
            Logger.logInfo(stop_msg);

            // TODO: Save the process locally or globally
            Logger.logInfo(
                `Process ${name} is saved ${local ? "locally" : "globally"} with ${commands.length} commands.`
            );
            process.exit(0);
        } catch (err) {
            Logger.logError((err as Error).message);
            process.exit(1);
        }
    });

program
    .command("use")
    .description("Use a saved boil process")
    .option("-l, --local <name>", "Use a local file by providing its relative path")
    .option("-g, --global <name>", "Use a globally saved process")
    .action((options: UseActionOptions) => {
        const { local, global } = options;

        if ((local && global) || (!local && !global)) {
            Logger.logError("You must specify either a local or global process, not both.");
            process.exit(1);
        }

        let name = local ? local : global;

        // TODO: Handle parsing the global or local file and then perform the saved actions
        Logger.logInfo(`Process ${name} is applying to this directory.`);
        process.exit(0);
    });

program.parse(process.argv);
