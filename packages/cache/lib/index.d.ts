import { CacheStorageConfig, CustomStorageConfig } from "backfill-config";
import { Logger } from "backfill-logger";
import { ICacheStorage } from "./CacheStorage";
export { ICacheStorage, CacheStorage } from "./CacheStorage";
export declare function isCustomProvider(config: CacheStorageConfig): config is CustomStorageConfig;
export declare function getCacheStorageProvider(cacheStorageConfig: CacheStorageConfig, internalCacheFolder: string, logger: Logger, cwd: string): ICacheStorage;
//# sourceMappingURL=index.d.ts.map