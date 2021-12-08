"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalSkipCacheStorage = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const CacheStorage_1 = require("./CacheStorage");
/**
 * A CacheStorage that essentially just lets fetch return nothing locally, skipping cache, but verifies whether the hash is still correct based on the hasher algorithm
 */
class LocalSkipCacheStorage extends CacheStorage_1.CacheStorage {
    constructor(internalCacheFolder, logger, cwd) {
        super(logger, cwd);
        this.internalCacheFolder = internalCacheFolder;
    }
    getLocalCacheFolder(hash) {
        return path_1.default.resolve(this.cwd, this.internalCacheFolder, hash);
    }
    async _fetch(hash) {
        const localCacheFolder = this.getLocalCacheFolder("skip-cache");
        const hashFile = path_1.default.join(localCacheFolder, "hash");
        if (!fs_extra_1.default.pathExistsSync(localCacheFolder) || !fs_extra_1.default.existsSync(hashFile)) {
            return false;
        }
        return hash === (await fs_extra_1.default.readFile(hashFile, "utf-8"));
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async _put(hash, _filesToCache) {
        const localCacheFolder = this.getLocalCacheFolder("skip-cache");
        const hashFile = path_1.default.join(localCacheFolder, "hash");
        await fs_extra_1.default.mkdirp(localCacheFolder);
        await fs_extra_1.default.writeFile(hashFile, hash);
    }
}
exports.LocalSkipCacheStorage = LocalSkipCacheStorage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9jYWxTa2lwQ2FjaGVTdG9yYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0xvY2FsU2tpcENhY2hlU3RvcmFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsd0RBQTBCO0FBSTFCLGlEQUE4QztBQUU5Qzs7R0FFRztBQUNILE1BQWEscUJBQXNCLFNBQVEsMkJBQVk7SUFDckQsWUFDVSxtQkFBMkIsRUFDbkMsTUFBYyxFQUNkLEdBQVc7UUFFWCxLQUFLLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBSlgsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFRO0lBS3JDLENBQUM7SUFFUyxtQkFBbUIsQ0FBQyxJQUFZO1FBQ3hDLE9BQU8sY0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRVMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFZO1FBQ2pDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2hFLE1BQU0sUUFBUSxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFckQsSUFBSSxDQUFDLGtCQUFFLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxrQkFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNwRSxPQUFPLEtBQUssQ0FBQztTQUNkO1FBRUQsT0FBTyxJQUFJLEtBQUssQ0FBQyxNQUFNLGtCQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCw2REFBNkQ7SUFDbkQsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFZLEVBQUUsYUFBdUI7UUFDeEQsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDaEUsTUFBTSxRQUFRLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVyRCxNQUFNLGtCQUFFLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDbEMsTUFBTSxrQkFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDckMsQ0FBQztDQUNGO0FBaENELHNEQWdDQyJ9