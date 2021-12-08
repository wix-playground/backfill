import { Logger } from "backfill-logger";
import { CacheStorage } from "./CacheStorage";
/**
 * A CacheStorage that essentially just lets fetch return nothing locally, skipping cache, but verifies whether the hash is still correct based on the hasher algorithm
 */
export declare class LocalSkipCacheStorage extends CacheStorage {
    private internalCacheFolder;
    constructor(internalCacheFolder: string, logger: Logger, cwd: string);
    protected getLocalCacheFolder(hash: string): string;
    protected _fetch(hash: string): Promise<boolean>;
    protected _put(hash: string, _filesToCache: string[]): Promise<void>;
}
//# sourceMappingURL=LocalSkipCacheStorage.d.ts.map