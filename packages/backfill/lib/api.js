"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.put = exports.fetch = exports.computeHashOfOutput = exports.computeHash = exports.makeLogger = void 0;
const os_1 = require("os");
const backfill_config_1 = require("backfill-config");
const backfill_logger_1 = require("backfill-logger");
const backfill_hasher_1 = require("backfill-hasher");
const backfill_cache_1 = require("backfill-cache");
function makeConsole(stdout, stderr) {
    return {
        info(...args) {
            stdout.write(args.join(" ") + os_1.EOL);
        },
        warn(...args) {
            stderr.write(args.join(" ") + os_1.EOL);
        },
        error(...args) {
            stderr.write(args.join(" ") + os_1.EOL);
        },
    };
}
function makeLogger(logLevel, stdout, stderr) {
    return backfill_logger_1.makeLogger(logLevel, { console: makeConsole(stdout, stderr) });
}
exports.makeLogger = makeLogger;
async function computeHash(cwd, logger, hashSalt, config) {
    if (!config) {
        config = backfill_config_1.createConfig(logger, cwd);
    }
    const { packageRoot } = config;
    const hasher = new backfill_hasher_1.Hasher({ packageRoot }, logger);
    const hash = await hasher.createPackageHash(hashSalt || "");
    return hash;
}
exports.computeHash = computeHash;
async function computeHashOfOutput(cwd, logger, config) {
    if (!config) {
        config = backfill_config_1.createConfig(logger, cwd);
    }
    const { packageRoot } = config;
    const hasher = new backfill_hasher_1.Hasher({ packageRoot }, logger);
    const hash = await hasher.hashOfOutput();
    return hash;
}
exports.computeHashOfOutput = computeHashOfOutput;
async function fetch(cwd, hash, logger, config) {
    if (!config) {
        config = backfill_config_1.createConfig(logger, cwd);
    }
    const { cacheStorageConfig, internalCacheFolder } = config;
    const cacheStorage = backfill_cache_1.getCacheStorageProvider(cacheStorageConfig, internalCacheFolder, logger, cwd);
    const fetch = await cacheStorage.fetch(hash);
    return fetch;
}
exports.fetch = fetch;
async function put(cwd, hash, logger, config) {
    if (!config) {
        config = backfill_config_1.createConfig(logger, cwd);
    }
    const { cacheStorageConfig, internalCacheFolder, outputGlob } = config;
    const cacheStorage = backfill_cache_1.getCacheStorageProvider(cacheStorageConfig, internalCacheFolder, logger, cwd);
    await cacheStorage.put(hash, outputGlob);
}
exports.put = put;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSwyQkFBeUI7QUFFekIscURBQXVEO0FBQ3ZELHFEQUt5QjtBQUN6QixxREFBeUM7QUFDekMsbURBQXlEO0FBRXpELFNBQVMsV0FBVyxDQUFDLE1BQWdCLEVBQUUsTUFBZ0I7SUFDckQsT0FBTztRQUNMLElBQUksQ0FBQyxHQUFHLElBQWM7WUFDcEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFFBQUcsQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFDRCxJQUFJLENBQUMsR0FBRyxJQUFjO1lBQ3BCLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxRQUFHLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FBQ0QsS0FBSyxDQUFDLEdBQUcsSUFBYztZQUNyQixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBRyxDQUFDLENBQUM7UUFDckMsQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsU0FBZ0IsVUFBVSxDQUN4QixRQUFrQixFQUNsQixNQUFnQixFQUNoQixNQUFnQjtJQUVoQixPQUFPLDRCQUFrQixDQUFDLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNoRixDQUFDO0FBTkQsZ0NBTUM7QUFFTSxLQUFLLFVBQVUsV0FBVyxDQUMvQixHQUFXLEVBQ1gsTUFBYyxFQUNkLFFBQWlCLEVBQ2pCLE1BQW9DO0lBRXBDLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDWCxNQUFNLEdBQUcsOEJBQVksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDcEM7SUFDRCxNQUFNLEVBQUUsV0FBVyxFQUFFLEdBQUcsTUFBTSxDQUFDO0lBQy9CLE1BQU0sTUFBTSxHQUFHLElBQUksd0JBQU0sQ0FBQyxFQUFFLFdBQVcsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBRW5ELE1BQU0sSUFBSSxHQUFHLE1BQU0sTUFBTSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUM1RCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFkRCxrQ0FjQztBQUVNLEtBQUssVUFBVSxtQkFBbUIsQ0FDdkMsR0FBVyxFQUNYLE1BQWMsRUFDZCxNQUFvQztJQUVwQyxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ1gsTUFBTSxHQUFHLDhCQUFZLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ3BDO0lBQ0QsTUFBTSxFQUFFLFdBQVcsRUFBRSxHQUFHLE1BQU0sQ0FBQztJQUMvQixNQUFNLE1BQU0sR0FBRyxJQUFJLHdCQUFNLENBQUMsRUFBRSxXQUFXLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNuRCxNQUFNLElBQUksR0FBRyxNQUFNLE1BQU0sQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN6QyxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFaRCxrREFZQztBQUVNLEtBQUssVUFBVSxLQUFLLENBQ3pCLEdBQVcsRUFDWCxJQUFZLEVBQ1osTUFBYyxFQUNkLE1BQW1FO0lBRW5FLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDWCxNQUFNLEdBQUcsOEJBQVksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDcEM7SUFDRCxNQUFNLEVBQUUsa0JBQWtCLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxNQUFNLENBQUM7SUFDM0QsTUFBTSxZQUFZLEdBQUcsd0NBQXVCLENBQzFDLGtCQUFrQixFQUNsQixtQkFBbUIsRUFDbkIsTUFBTSxFQUNOLEdBQUcsQ0FDSixDQUFDO0lBQ0YsTUFBTSxLQUFLLEdBQUcsTUFBTSxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdDLE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQWxCRCxzQkFrQkM7QUFFTSxLQUFLLFVBQVUsR0FBRyxDQUN2QixHQUFXLEVBQ1gsSUFBWSxFQUNaLE1BQWMsRUFDZCxNQUdDO0lBRUQsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUNYLE1BQU0sR0FBRyw4QkFBWSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztLQUNwQztJQUNELE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxtQkFBbUIsRUFBRSxVQUFVLEVBQUUsR0FBRyxNQUFNLENBQUM7SUFDdkUsTUFBTSxZQUFZLEdBQUcsd0NBQXVCLENBQzFDLGtCQUFrQixFQUNsQixtQkFBbUIsRUFDbkIsTUFBTSxFQUNOLEdBQUcsQ0FDSixDQUFDO0lBQ0YsTUFBTSxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztBQUMzQyxDQUFDO0FBcEJELGtCQW9CQyJ9