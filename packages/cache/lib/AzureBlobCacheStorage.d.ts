import { Logger } from "backfill-logger";
import { AzureBlobCacheStorageOptions } from "backfill-config";
import { CacheStorage } from "./CacheStorage";
export declare class AzureBlobCacheStorage extends CacheStorage {
    private options;
    constructor(options: AzureBlobCacheStorageOptions, logger: Logger, cwd: string);
    protected _fetch(hash: string): Promise<boolean>;
    protected _put(hash: string, filesToCache: string[]): Promise<void>;
}
//# sourceMappingURL=AzureBlobCacheStorage.d.ts.map