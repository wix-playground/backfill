"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeWatcher = exports.noSideEffectString = exports.sideEffectCallToActionString = exports.sideEffectWarningString = exports.initializeWatcher = void 0;
const path_1 = __importDefault(require("path"));
const chokidar_1 = __importDefault(require("chokidar"));
const find_up_1 = __importDefault(require("find-up"));
const anymatch_1 = __importDefault(require("anymatch"));
let changedFilesOutsideScope = [];
let changedFilesInsideScope = [];
let watcher;
function getGitRepositoryRoot(packageRoot) {
    // .git is typically a folder but will be a file in a worktree
    const nearestGitInfo = find_up_1.default.sync(".git", { cwd: packageRoot, type: "directory" }) ||
        find_up_1.default.sync(".git", { cwd: packageRoot, type: "file" });
    if (nearestGitInfo) {
        // Return the parent folder of some/path/.git
        return path_1.default.join(nearestGitInfo, "..");
    }
    return packageRoot;
}
function addGlobstars(globPatterns) {
    const folders = globPatterns.map((p) => path_1.default.posix.join("**", p, "**", "*"));
    const files = globPatterns.map((p) => path_1.default.posix.join("**", p));
    return [...folders, ...files];
}
function initializeWatcher(packageRoot, internalCacheFolder, logFolder, outputGlob, logger) {
    // Trying to find the git root and using it as an approximation of code boundary
    const repositoryRoot = getGitRepositoryRoot(packageRoot);
    // Empty the arrays
    changedFilesOutsideScope = [];
    changedFilesInsideScope = [];
    logger.info("Running in AUDIT mode");
    logger.info(`[audit] Watching file changes in: ${repositoryRoot}`);
    logger.info(`[audit] Backfill will cache folder: ${outputGlob}`);
    // Define globs
    const ignoreGlobs = addGlobstars([
        ".git",
        ".cache",
        logFolder,
        internalCacheFolder,
    ]);
    watcher = chokidar_1.default
        .watch("**", {
        ignored: ignoreGlobs,
        cwd: repositoryRoot,
        persistent: true,
        ignoreInitial: true,
        followSymlinks: false,
        usePolling: true,
    })
        .on("all", (event, filePath) => {
        const logLine = `${filePath} (${event})`;
        logger.silly(`[audit] File change: ${logLine}`);
        if (!anymatch_1.default(outputGlob.map((glob) => path_1.default.posix.join("**", glob)), filePath)) {
            changedFilesOutsideScope.push(logLine);
        }
        else {
            changedFilesInsideScope.push(logLine);
        }
    });
}
exports.initializeWatcher = initializeWatcher;
exports.sideEffectWarningString = "[audit] The following files got changed outside of the scope of the folder to be cached:";
exports.sideEffectCallToActionString = "[audit] You should make sure that these changes are non-essential, as they would not be brought back on a cache-hit.";
exports.noSideEffectString = "[audit] All observed file changes were within the scope of the folder to be cached.";
async function delay(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}
async function closeWatcher(logger) {
    // Wait for one second before closing, giving time for file changes to propagate
    await delay(1000);
    if (changedFilesOutsideScope.length > 0) {
        logger.warn(exports.sideEffectWarningString);
        changedFilesOutsideScope.forEach((file) => logger.warn(`- ${file}`));
        logger.warn(exports.sideEffectCallToActionString);
    }
    else {
        logger.info(exports.noSideEffectString);
    }
    watcher.close();
}
exports.closeWatcher = closeWatcher;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXVkaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYXVkaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsZ0RBQXdCO0FBQ3hCLHdEQUFnQztBQUNoQyxzREFBNkI7QUFDN0Isd0RBQWdDO0FBSWhDLElBQUksd0JBQXdCLEdBQWEsRUFBRSxDQUFDO0FBQzVDLElBQUksdUJBQXVCLEdBQWEsRUFBRSxDQUFDO0FBRTNDLElBQUksT0FBMkIsQ0FBQztBQUVoQyxTQUFTLG9CQUFvQixDQUFDLFdBQW1CO0lBQy9DLDhEQUE4RDtJQUM5RCxNQUFNLGNBQWMsR0FDbEIsaUJBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLENBQUM7UUFDNUQsaUJBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUUxRCxJQUFJLGNBQWMsRUFBRTtRQUNsQiw2Q0FBNkM7UUFDN0MsT0FBTyxjQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUN4QztJQUVELE9BQU8sV0FBVyxDQUFDO0FBQ3JCLENBQUM7QUFFRCxTQUFTLFlBQVksQ0FBQyxZQUFzQjtJQUMxQyxNQUFNLE9BQU8sR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxjQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzdFLE1BQU0sS0FBSyxHQUFHLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLGNBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FB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