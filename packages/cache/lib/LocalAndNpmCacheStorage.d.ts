import { NpmCacheStorageOptions } from "backfill-config";
import { Logger } from "backfill-logger";
import { CacheStorage } from "./CacheStorage";
export declare class NpmCacheStorage extends CacheStorage {
    private options;
    private internalCacheFolder;
    constructor(options: NpmCacheStorageOptions, internalCacheFolder: string, logger: Logger, cwd: string);
    protected _fetch(hash: string): Promise<boolean>;
    protected _put(hash: string, filesToCache: string[]): Promise<void>;
}
//# sourceMappingURL=LocalAndNpmCacheStorage.d.ts.map