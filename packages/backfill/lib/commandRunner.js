"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBuildCommand = exports.getRawBuildCommand = void 0;
const execa_1 = __importDefault(require("execa"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const globby_1 = __importDefault(require("globby"));
function getRawBuildCommand() {
    return process.argv.slice(2).join(" ");
}
exports.getRawBuildCommand = getRawBuildCommand;
function createBuildCommand(buildCommand, clearOutput, outputGlob, logger) {
    return async () => {
        const parsedBuildCommand = buildCommand.join(" ");
        if (!parsedBuildCommand) {
            throw new Error("Command not provided");
        }
        if (clearOutput) {
            const filesToClear = globby_1.default.sync(outputGlob);
            await Promise.all(filesToClear.map(async (file) => await fs_extra_1.default.remove(file)));
        }
        try {
            // Set up runner
            const tracer = logger.setTime("buildTime");
            const runner = execa_1.default(parsedBuildCommand, {
                shell: true,
            });
            logger.pipeProcessOutput(runner.stdout, runner.stderr);
            await runner;
            tracer.stop();
        }
        catch (e) {
            logger.error(`Failed while running: "${parsedBuildCommand}"`);
            throw e;
        }
    };
}
exports.createBuildCommand = createBuildCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZFJ1bm5lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21tYW5kUnVubmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGtEQUEwQjtBQUMxQix3REFBMEI7QUFDMUIsb0RBQTRCO0FBTzVCLFNBQWdCLGtCQUFrQjtJQUNoQyxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6QyxDQUFDO0FBRkQsZ0RBRUM7QUFFRCxTQUFnQixrQkFBa0IsQ0FDaEMsWUFBc0IsRUFDdEIsV0FBb0IsRUFDcEIsVUFBb0IsRUFDcEIsTUFBYztJQUVkLE9BQU8sS0FBSyxJQUFrQyxFQUFFO1FBQzlDLE1BQU0sa0JBQWtCLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVsRCxJQUFJLENBQUMsa0JBQWtCLEVBQUU7WUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1NBQ3pDO1FBRUQsSUFBSSxXQUFXLEVBQUU7WUFDZixNQUFNLFlBQVksR0FBRyxnQkFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUM3QyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQ2YsWUFBWSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxNQUFNLGtCQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQ3hELENBQUM7U0FDSDtRQUVELElBQUk7WUFDRixnQkFBZ0I7WUFDaEIsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMzQyxNQUFNLE1BQU0sR0FBRyxlQUFLLENBQUMsa0JBQWtCLEVBQUU7Z0JBQ3ZDLEtBQUssRUFBRSxJQUFJO2FBQ1osQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRXZELE1BQU0sTUFBTSxDQUFDO1lBQ2IsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2Y7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE1BQU0sQ0FBQyxLQUFLLENBQUMsMEJBQTBCLGtCQUFrQixHQUFHLENBQUMsQ0FBQztZQUM5RCxNQUFNLENBQUMsQ0FBQztTQUNUO0lBQ0gsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQXBDRCxnREFvQ0MifQ==