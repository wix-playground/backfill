"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCacheStorageProvider = exports.isCustomProvider = exports.CacheStorage = void 0;
const AzureBlobCacheStorage_1 = require("./AzureBlobCacheStorage");
const LocalCacheStorage_1 = require("./LocalCacheStorage");
const NpmCacheStorage_1 = require("./NpmCacheStorage");
const LocalSkipCacheStorage_1 = require("./LocalSkipCacheStorage");
var CacheStorage_1 = require("./CacheStorage");
Object.defineProperty(exports, "CacheStorage", { enumerable: true, get: function () { return CacheStorage_1.CacheStorage; } });
function isCustomProvider(config) {
    return typeof config.provider === "function";
}
exports.isCustomProvider = isCustomProvider;
function getCacheStorageProvider(cacheStorageConfig, internalCacheFolder, logger, cwd) {
    let cacheStorage;
    if (isCustomProvider(cacheStorageConfig)) {
        const createCacheStorage = cacheStorageConfig.provider;
        try {
            cacheStorage = createCacheStorage(logger, cwd);
        }
        catch {
            throw new Error("cacheStorageConfig.provider cannot be creaated");
        }
    }
    else {
        if (cacheStorageConfig.provider === "npm") {
            cacheStorage = new NpmCacheStorage_1.NpmCacheStorage(cacheStorageConfig.options, internalCacheFolder, logger, cwd);
        }
        else if (cacheStorageConfig.provider === "azure-blob") {
            cacheStorage = new AzureBlobCacheStorage_1.AzureBlobCacheStorage(cacheStorageConfig.options, logger, cwd);
        }
        else if (cacheStorageConfig.provider === "local-skip") {
            cacheStorage = new LocalSkipCacheStorage_1.LocalSkipCacheStorage(internalCacheFolder, logger, cwd);
        }
        else {
            cacheStorage = new LocalCacheStorage_1.LocalCacheStorage(internalCacheFolder, logger, cwd);
        }
    }
    return cacheStorage;
}
exports.getCacheStorageProvider = getCacheStorageProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBSUEsbUVBQWdFO0FBQ2hFLDJEQUF3RDtBQUN4RCx1REFBb0Q7QUFDcEQsbUVBQWdFO0FBQ2hFLCtDQUE2RDtBQUFyQyw0R0FBQSxZQUFZLE9BQUE7QUFFcEMsU0FBZ0IsZ0JBQWdCLENBQzlCLE1BQTBCO0lBRTFCLE9BQU8sT0FBTyxNQUFNLENBQUMsUUFBUSxLQUFLLFVBQVUsQ0FBQztBQUMvQyxDQUFDO0FBSkQsNENBSUM7QUFFRCxTQUFnQix1QkFBdUIsQ0FDckMsa0JBQXNDLEVBQ3RDLG1CQUEyQixFQUMzQixNQUFjLEVBQ2QsR0FBVztJQUVYLElBQUksWUFBMkIsQ0FBQztJQUVoQyxJQUFJLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLEVBQUU7UUFDeEMsTUFBTSxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQyxRQUFRLENBQUM7UUFFdkQsSUFBSTtZQUNGLFlBQVksR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDaEQ7UUFBQyxNQUFNO1lBQ04sTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO1NBQ25FO0tBQ0Y7U0FBTTtRQUNMLElBQUksa0JBQWtCLENBQUMsUUFBUSxLQUFLLEtBQUssRUFBRTtZQUN6QyxZQUFZLEdBQUcsSUFBSSxpQ0FBZSxDQUNoQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQzFCLG1CQUFtQixFQUNuQixNQUFNLEVBQ04sR0FBRyxDQUNKLENBQUM7U0FDSDthQUFNLElBQUksa0JBQWtCLENBQUMsUUFBUSxLQUFLLFlBQVksRUFBRTtZQUN2RCxZQUFZLEdBQUcsSUFBSSw2Q0FBcUIsQ0FDdEMsa0JBQWtCLENBQUMsT0FBTyxFQUMxQixNQUFNLEVBQ04sR0FBRyxDQUNKLENBQUM7U0FDSDthQUFNLElBQUksa0JBQWtCLENBQUMsUUFBUSxLQUFLLFlBQVksRUFBRTtZQUN2RCxZQUFZLEdBQUcsSUFBSSw2Q0FBcUIsQ0FDdEMsbUJBQW1CLEVBQ25CLE1BQU0sRUFDTixHQUFHLENBQ0osQ0FBQztTQUNIO2FBQU07WUFDTCxZQUFZLEdBQUcsSUFBSSxxQ0FBaUIsQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDeEU7S0FDRjtJQUVELE9BQU8sWUFBWSxDQUFDO0FBQ3RCLENBQUM7QUExQ0QsMERBMENDIn0=