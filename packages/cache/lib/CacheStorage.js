"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheStorage = void 0;
const path_1 = require("path");
const globby_1 = __importDefault(require("globby"));
const find_up_1 = __importDefault(require("find-up"));
const package_deps_hash_1 = require("@rushstack/package-deps-hash");
const savedHashOfRepos = {};
function getRepoRoot(cwd) {
    // .git is typically a folder but will be a file in a worktree
    const nearestGitInfo = find_up_1.default.sync(".git", { cwd, type: "directory" }) ||
        find_up_1.default.sync(".git", { cwd, type: "file" });
    if (!nearestGitInfo) {
        throw new Error("The location that backfill is being run against is not in a git repo");
    }
    return path_1.dirname(nearestGitInfo);
}
function fetchHashesFor(cwd) {
    const gitRoot = getRepoRoot(cwd);
    savedHashOfRepos[gitRoot] ||
        (savedHashOfRepos[gitRoot] = package_deps_hash_1.getPackageDeps(gitRoot).files);
}
function getMemoizedHashesFor(cwd) {
    fetchHashesFor(cwd);
    const gitRoot = getRepoRoot(cwd);
    const savedHashOfThisRepo = savedHashOfRepos[gitRoot];
    const pathRelativeToRepo = path_1.relative(gitRoot, cwd);
    const filesInCwd = Object.keys(savedHashOfThisRepo).filter((o) => !path_1.relative(pathRelativeToRepo, o).startsWith(".."));
    const results = {};
    for (const file in filesInCwd) {
        results[path_1.relative(pathRelativeToRepo, file).replace(/\\/g, "/")] =
            savedHashOfThisRepo[file];
    }
    return results;
}
class CacheStorage {
    constructor(logger, cwd) {
        this.logger = logger;
        this.cwd = cwd;
    }
    async fetch(hash) {
        const tracer = this.logger.setTime("fetchTime");
        const result = await this._fetch(hash);
        tracer.stop();
        this.logger.setHit(result);
        // Save hash of files if not already memoized
        fetchHashesFor(this.cwd);
        return result;
    }
    async put(hash, outputGlob) {
        const tracer = this.logger.setTime("putTime");
        const filesMatchingOutputGlob = await globby_1.default(outputGlob, { cwd: this.cwd });
        // Get the list of files that have not changed so we don't need to cache them.
        const hashesNow = package_deps_hash_1.getPackageDeps(this.cwd).files;
        const hashesThen = getMemoizedHashesFor(this.cwd);
        const unchangedFiles = Object.keys(hashesThen).filter((s) => hashesThen[s] === hashesNow[s]);
        // Make this feature opt-in as it has not get been tested at scale
        const excludeUnchanged = process.env["BACKFILL_EXCLUDE_UNCHANGED"] === "1";
        const filesToCache = excludeUnchanged
            ? filesMatchingOutputGlob.filter((f) => !unchangedFiles.includes(f))
            : filesMatchingOutputGlob;
        await this._put(hash, filesToCache);
        tracer.stop();
    }
}
exports.CacheStorage = CacheStorage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FjaGVTdG9yYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0NhY2hlU3RvcmFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwrQkFBeUM7QUFDekMsb0RBQTRCO0FBQzVCLHNEQUE2QjtBQUM3QixvRUFBOEQ7QUFLOUQsTUFBTSxnQkFBZ0IsR0FBc0QsRUFBRSxDQUFDO0FBRS9FLFNBQVMsV0FBVyxDQUFDLEdBQVc7SUFDOUIsOERBQThEO0lBQzlELE1BQU0sY0FBYyxHQUNsQixpQkFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDO1FBQy9DLGlCQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUM3QyxJQUFJLENBQUMsY0FBYyxFQUFFO1FBQ25CLE1BQU0sSUFBSSxLQUFLLENBQ2Isc0VBQXNFLENBQ3ZFLENBQUM7S0FDSDtJQUVELE9BQU8sY0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ2pDLENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBQyxHQUFXO0lBQ2pDLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUVqQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7UUFDdkIsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsR0FBRyxrQ0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hFLENBQUM7QUFFRCxTQUFTLG9CQUFvQixDQUFDLEdBQVc7SUFDdkMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRXBCLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUVqQyxNQUFNLG1CQUFtQixHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FFbkQsQ0FBQztJQUVGLE1BQU0sa0JBQWtC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