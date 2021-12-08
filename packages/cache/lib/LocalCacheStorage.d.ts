import { Logger } from "backfill-logger";
import { CacheStorage } from "./CacheStorage";
export declare class LocalCacheStorage extends CacheStorage {
    private internalCacheFolder;
    constructor(internalCacheFolder: string, logger: Logger, cwd: string);
    protected getLocalCacheFolder(hash: string): string;
    protected _fetch(hash: string): Promise<boolean>;
    protected _put(hash: string, filesToCache: string[]): Promise<void>;
}
//# sourceMappingURL=LocalCacheStorage.d.ts.map