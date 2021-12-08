/// <reference types="node" />
import { Writable } from "stream";
import { Config } from "backfill-config";
import { Logger, LogLevel } from "backfill-logger";
export declare function makeLogger(logLevel: LogLevel, stdout: Writable, stderr: Writable): Logger;
export declare function computeHash(cwd: string, logger: Logger, hashSalt?: string, config?: Pick<Config, "packageRoot">): Promise<string>;
export declare function computeHashOfOutput(cwd: string, logger: Logger, config?: Pick<Config, "packageRoot">): Promise<string>;
export declare function fetch(cwd: string, hash: string, logger: Logger, config?: Pick<Config, "cacheStorageConfig" | "internalCacheFolder">): Promise<boolean>;
export declare function put(cwd: string, hash: string, logger: Logger, config?: Pick<Config, "cacheStorageConfig" | "internalCacheFolder" | "outputGlob">): Promise<void>;
//# sourceMappingURL=api.d.ts.map