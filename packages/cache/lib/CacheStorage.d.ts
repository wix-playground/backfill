import { Logger } from "backfill-logger";
import { ICacheStorage } from "backfill-config";
export { ICacheStorage };
export declare abstract class CacheStorage implements ICacheStorage {
    protected logger: Logger;
    protected cwd: string;
    constructor(logger: Logger, cwd: string);
    fetch(hash: string): Promise<boolean>;
    put(hash: string, outputGlob: string[]): Promise<void>;
    protected abstract _fetch(hash: string): Promise<boolean>;
    protected abstract _put(hash: string, filesToCache: string[]): Promise<void>;
}
//# sourceMappingURL=CacheStorage.d.ts.map