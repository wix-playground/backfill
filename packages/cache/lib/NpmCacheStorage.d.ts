import { NpmCacheStorageOptions } from "backfill-config";
import { Logger } from "backfill-logger";
import { CacheStorage } from "./CacheStorage";
export declare class NpmCacheStorage extends CacheStorage {
    private options;
    private internalCacheFolder;
    constructor(options: NpmCacheStorageOptions, internalCacheFolder: string, logger: Logger, cwd: string);
    private static getPublishedVersions;
    private readonly publishedVersions;
    private getLocalCacheFolder;
    private static copy;
    private isPublished;
    protected _fetch(hash: string): Promise<boolean>;
    protected _put(hash: string, filesToCache: string[]): Promise<void>;
}
//# sourceMappingURL=NpmCacheStorage.d.ts.map