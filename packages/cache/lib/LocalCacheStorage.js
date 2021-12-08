"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalCacheStorage = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const globby_1 = __importDefault(require("globby"));
const CacheStorage_1 = require("./CacheStorage");
class LocalCacheStorage extends CacheStorage_1.CacheStorage {
    constructor(internalCacheFolder, logger, cwd) {
        super(logger, cwd);
        this.internalCacheFolder = internalCacheFolder;
    }
    getLocalCacheFolder(hash) {
        return path_1.default.resolve(this.cwd, this.internalCacheFolder, hash);
    }
    async _fetch(hash) {
        const localCacheFolder = this.getLocalCacheFolder(hash);
        if (!fs_extra_1.default.pathExistsSync(localCacheFolder)) {
            return false;
        }
        const files = await globby_1.default(`**/*`, {
            cwd: localCacheFolder,
        });
        await Promise.all(files
            .filter(async (file) => {
            const src = path_1.default.join(localCacheFolder, file);
            const dest = path_1.default.join(this.cwd, file);
            try {
                const stats = await Promise.all([fs_extra_1.default.stat(src), fs_extra_1.default.stat(dest)]);
                return stats[0].mtime !== stats[1].mtime;
            }
            catch {
                // if an error is thrown, it means the stat was called on a non-existent file or directory
                return false;
            }
            return true;
        })
            .map(async (file) => {
            await fs_extra_1.default.mkdirp(path_1.default.dirname(path_1.default.join(this.cwd, file)));
            await fs_extra_1.default.copyFile(path_1.default.join(localCacheFolder, file), path_1.default.join(this.cwd, file));
        }));
        return true;
    }
    async _put(hash, filesToCache) {
        const localCacheFolder = this.getLocalCacheFolder(hash);
        await fs_extra_1.default.mkdirp(localCacheFolder);
        await Promise.all(filesToCache.map(async (file) => {
            const destinationFolder = path_1.default.join(localCacheFolder, path_1.default.dirname(file));
            await fs_extra_1.default.mkdirp(destinationFolder);
            await fs_extra_1.default.copy(path_1.default.join(this.cwd, file), path_1.default.join(localCacheFolder, file));
        }));
    }
}
exports.LocalCacheStorage = LocalCacheStorage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9jYWxDYWNoZVN0b3JhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvTG9jYWxDYWNoZVN0b3JhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsZ0RBQXdCO0FBQ3hCLHdEQUEwQjtBQUMxQixvREFBNEI7QUFHNUIsaURBQThDO0FBRTlDLE1BQWEsaUJBQWtCLFNBQVEsMkJBQVk7SUFDakQsWUFDVSxtQkFBMkIsRUFDbkMsTUFBYyxFQUNkLEdBQVc7UUFFWCxLQUFLLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBSlgsd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFRO0lBS3JDLENBQUM7SUFFUyxtQkFBbUIsQ0FBQyxJQUFZO1FBQ3hDLE9BQU8sY0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRVMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFZO1FBQ2pDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXhELElBQUksQ0FBQyxrQkFBRSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO1lBQ3hDLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxNQUFNLEtBQUssR0FBRyxNQUFNLGdCQUFNLENBQUMsTUFBTSxFQUFFO1lBQ2pDLEdBQUcsRUFBRSxnQkFBZ0I7U0FDdEIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUNmLEtBQUs7YUFDRixNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ3JCLE1BQU0sR0FBRyxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDOUMsTUFBTSxJQUFJLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRXZDLElBQUk7Z0JBQ0YsTUFBTSxLQUFLLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsa0JBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsa0JBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvRCxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQzthQUMxQztZQUFDLE1BQU07Z0JBQ04sMEZBQTBGO2dCQUMxRixPQUFPLEtBQUssQ0FBQzthQUNkO1lBRUQsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDLENBQUM7YUFDRCxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ2xCLE1BQU0sa0JBQUUsQ0FBQyxNQUFNLENBQUMsY0FBSSxDQUFDLE9BQU8sQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pELE1BQU0sa0JBQUUsQ0FBQyxRQUFRLENBQ2YsY0FBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsRUFDakMsY0FBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUMxQixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQ0wsQ0FBQztRQUVGLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVTLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBWSxFQUFFLFlBQXNCO1FBQ3ZELE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXhELE1BQU0sa0JBQUUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUVsQyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQ2YsWUFBWSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDOUIsTUFBTSxpQkFBaUIsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUNqQyxnQkFBZ0IsRUFDaEIsY0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FDbkIsQ0FBQztZQUNGLE1BQU0sa0JBQUUsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUNuQyxNQUFNLGtCQUFFLENBQUMsSUFBSSxDQUNYLGNBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFDekIsY0FBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FDbEMsQ0FBQztRQUNKLENBQUMsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDO0NBQ0Y7QUF2RUQsOENBdUVDIn0=