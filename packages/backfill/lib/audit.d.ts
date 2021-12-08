import { Logger } from "backfill-logger";
export declare function initializeWatcher(packageRoot: string, internalCacheFolder: string, logFolder: string, outputGlob: string[], logger: Logger): void;
export declare const sideEffectWarningString = "[audit] The following files got changed outside of the scope of the folder to be cached:";
export declare const sideEffectCallToActionString = "[audit] You should make sure that these changes are non-essential, as they would not be brought back on a cache-hit.";
export declare const noSideEffectString = "[audit] All observed file changes were within the scope of the folder to be cached.";
export declare function closeWatcher(logger: Logger): Promise<void>;
//# sourceMappingURL=audit.d.ts.map