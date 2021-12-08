"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.backfill = exports.createDefaultConfig = void 0;
const yargs_1 = __importDefault(require("yargs"));
const backfill_utils_dotenv_1 = require("backfill-utils-dotenv");
const backfill_logger_1 = require("backfill-logger");
const backfill_config_1 = require("backfill-config");
var backfill_config_2 = require("backfill-config");
Object.defineProperty(exports, "createDefaultConfig", { enumerable: true, get: function () { return backfill_config_2.createDefaultConfig; } });
const backfill_cache_1 = require("backfill-cache");
const commandRunner_1 = require("./commandRunner");
const audit_1 = require("./audit");
const api_1 = require("./api");
// Load environment variables
backfill_utils_dotenv_1.loadDotenv();
async function backfill(config, buildCommand, hashSalt, logger) {
    const { cacheStorageConfig, name, mode, logFolder, packageRoot, producePerformanceLogs, validateOutput, } = config;
    logger.setName(name);
    logger.setMode(mode, mode === "READ_WRITE" ? "info" : "verbose");
    logger.setCacheProvider(backfill_cache_1.isCustomProvider(cacheStorageConfig)
        ? cacheStorageConfig.name || "custom-storage-provider"
        : cacheStorageConfig.provider);
    const createPackageHash = async () => await api_1.computeHash(packageRoot, logger, hashSalt);
    const fetch = async (hash) => await api_1.fetch(packageRoot, hash, logger, config);
    const run = async () => {
        try {
            await buildCommand();
        }
        catch (err) {
            throw new Error(`Command failed with the following error:\n\n${err}`);
        }
    };
    const put = async (hash) => {
        try {
            await api_1.put(packageRoot, hash, logger, config);
        }
        catch (err) {
            logger.error(`Failed to persist the cache with the following error:\n\n${err}`);
        }
    };
    switch (mode) {
        case "READ_WRITE": {
            const hash = await createPackageHash();
            if (!(await fetch(hash))) {
                await run();
                await put(hash);
            }
            break;
        }
        case "READ_ONLY": {
            const hash = await createPackageHash();
            if (!(await fetch(hash))) {
                await run();
            }
            break;
        }
        case "WRITE_ONLY": {
            await run();
            const hash = await createPackageHash();
            await put(hash);
            break;
        }
        case "PASS": {
            await run();
            break;
        }
    }
    if (validateOutput) {
        const hashOfOutput = await api_1.computeHashOfOutput(packageRoot, logger);
        logger.setHashOfOutput(hashOfOutput);
    }
    if (producePerformanceLogs) {
        await logger.toFile(logFolder);
    }
}
exports.backfill = backfill;
async function main() {
    let logger = backfill_logger_1.makeLogger("info");
    const cwd = process.cwd();
    try {
        const config = backfill_config_1.createConfig(logger, cwd);
        const { clearOutput, internalCacheFolder, logFolder, logLevel, outputGlob, packageRoot, } = config;
        if (logLevel) {
            logger = backfill_logger_1.makeLogger(logLevel);
        }
        const helpString = "Backfills unchanged packages.";
        const argv = yargs_1.default
            .strict()
            .usage(helpString)
            .alias("h", "help")
            .version(false)
            .option("audit", {
            description: "Compare files changed with those cached",
            type: "boolean",
        }).argv;
        const buildCommand = commandRunner_1.createBuildCommand(argv["_"], clearOutput, outputGlob, logger);
        if (argv["audit"]) {
            audit_1.initializeWatcher(packageRoot, internalCacheFolder, logFolder, outputGlob, logger);
        }
        await backfill(config, buildCommand, commandRunner_1.getRawBuildCommand(), logger);
        if (argv["audit"]) {
            await audit_1.closeWatcher(logger);
        }
    }
    catch (err) {
        logger.error(err);
        process.exit(1);
    }
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsa0RBQTBCO0FBRTFCLGlFQUFtRDtBQUNuRCxxREFBcUQ7QUFDckQscURBQXVEO0FBQ3ZELG1EQUFzRDtBQUE3QyxzSEFBQSxtQkFBbUIsT0FBQTtBQUU1QixtREFBa0Q7QUFDbEQsbURBSXlCO0FBQ3pCLG1DQUEwRDtBQUMxRCwrQkFLZTtBQUVmLDZCQUE2QjtBQUM3QixrQ0FBVSxFQUFFLENBQUM7QUFFTixLQUFLLFVBQVUsUUFBUSxDQUM1QixNQUFjLEVBQ2QsWUFBMEIsRUFDMUIsUUFBZ0IsRUFDaEIsTUFBYztJQUVkLE1BQU0sRUFDSixrQkFBa0IsRUFDbEIsSUFBSSxFQUNKLElBQUksRUFDSixTQUFTLEVBQ1QsV0FBVyxFQUNYLHNCQUFzQixFQUN0QixjQUFjLEdBQ2YsR0FBRyxNQUFNLENBQUM7SUFFWCxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JCLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDakUsTUFBTSxDQUFDLGdCQUFnQixDQUNyQixpQ0FBZ0IsQ0FBQyxrQkFBa0IsQ0FBQztRQUNsQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsSUFBSSxJQUFJLHlCQUF5QjtRQUN0RCxDQUFDLENBQUMsa0JBQWtCLENBQUMsUUFBUSxDQUNoQyxDQUFDO0lBRUYsTUFBTSxpQkFBaUIsR0FBRyxLQUFLLElBQUksRUFBRSxDQUNuQyxNQUFNLGlCQUFXLENBQUMsV0FBVyxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNuRCxNQUFNLEtBQUssR0FBRyxLQUFLLEVBQUUsSUFBWSxFQUFFLEVBQUUsQ0FDbkMsTUFBTSxXQUFTLENBQUMsV0FBVyxF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