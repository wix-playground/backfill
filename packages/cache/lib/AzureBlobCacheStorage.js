"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureBlobCacheStorage = void 0;
const path = __importStar(require("path"));
const storage_blob_1 = require("@azure/storage-blob");
const tar_fs_1 = __importDefault(require("tar-fs"));
const fs_extra_1 = require("fs-extra");
const CacheStorage_1 = require("./CacheStorage");
const ONE_MEGABYTE = 1024 * 1024;
const FOUR_MEGABYTES = 4 * ONE_MEGABYTE;
const uploadOptions = {
    bufferSize: FOUR_MEGABYTES,
    maxBuffers: 5,
};
function createBlobClient(connectionString, containerName, blobName) {
    const blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    return blobClient;
}
class AzureBlobCacheStorage extends CacheStorage_1.CacheStorage {
    constructor(options, logger, cwd) {
        super(logger, cwd);
        this.options = options;
    }
    async _fetch(hash) {
        try {
            const blobClient = createBlobClient(this.options.connectionString, this.options.container, hash);
            // If a maxSize has been specified, make sure to check the properties for the size before transferring
            if (this.options.maxSize) {
                const sizeResponse = await blobClient.getProperties();
                if (sizeResponse.contentLength &&
                    sizeResponse.contentLength > this.options.maxSize) {
                    this.logger.verbose(`A blob is too large to be downloaded: ${hash}, size: ${sizeResponse.contentLength} bytes`);
                    return false;
                }
            }
            const response = await blobClient.download(0);
            const blobReadableStream = response.readableStreamBody;
            if (!blobReadableStream) {
                throw new Error("Unable to fetch blob.");
            }
            const tarWritableStream = tar_fs_1.default.extract(this.cwd);
            blobReadableStream.pipe(tarWritableStream);
            const blobPromise = new Promise((resolve, reject) => {
                blobReadableStream.on("end", () => resolve());
                blobReadableStream.on("error", (error) => reject(error));
            });
            await blobPromise;
            return true;
        }
        catch (error) {
            if (error && error.statusCode === 404) {
                return false;
            }
            else {
                throw new Error(error);
            }
        }
    }
    async _put(hash, filesToCache) {
        const blobClient = createBlobClient(this.options.connectionString, this.options.container, hash);
        const blockBlobClient = blobClient.getBlockBlobClient();
        const tarStream = tar_fs_1.default.pack(this.cwd, { entries: filesToCache });
        // If there's a maxSize limit, first sum up the total size of bytes of all the outputGlobbed files
        if (this.options.maxSize) {
            let total = 0;
            for (const file of filesToCache) {
                total = total + (await fs_extra_1.stat(path.join(this.cwd, file))).size;
            }
            if (total > this.options.maxSize) {
                this.logger.verbose(`The output is too large to be uploaded: ${hash}, size: ${total} bytes`);
                return;
            }
        }
        await blockBlobClient.uploadStream(tarStream, uploadOptions.bufferSize, uploadOptions.maxBuffers);
    }
}
exports.AzureBlobCacheStorage = AzureBlobCacheStorage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXp1cmVCbG9iQ2FjaGVTdG9yYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL0F6dXJlQmxvYkNhY2hlU3RvcmFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQTZCO0FBQzdCLHNEQUF3RDtBQUN4RCxvREFBMkI7QUFLM0IsdUNBQWdDO0FBQ2hDLGlEQUE4QztBQUU5QyxNQUFNLFlBQVksR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pDLE1BQU0sY0FBYyxHQUFHLENBQUMsR0FBRyxZQUFZLENBQUM7QUFFeEMsTUFBTSxhQUFhLEdBQUc7SUFDcEIsVUFBVSxFQUFFLGNBQWM7SUFDMUIsVUFBVSxFQUFFLENBQUM7Q0FDZCxDQUFDO0FBRUYsU0FBUyxnQkFBZ0IsQ0FDdkIsZ0JBQXdCLEVBQ3hCLGFBQXFCLEVBQ3JCLFFBQWdCO0lBRWhCLE1BQU0saUJBQWlCLEdBQUcsZ0NBQWlCLENBQUMsb0JBQW9CLENBQzlELGdCQUFnQixDQUNqQixDQUFDO0lBQ0YsTUFBTSxlQUFlLEdBQUcsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDNUUsTUFBTSxVQUFVLEdBQUcsZUFBZSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUUzRCxPQUFPLFVBQVUsQ0FBQztBQUNwQixDQUFDO0FBRUQsTUFBYSxxQkFBc0IsU0FBUSwyQkFBWTtJQUNyRCxZQUNVLE9BQXFDLEVBQzdDLE1BQWMsRUFDZCxHQUFXO1FBRVgsS0FBSyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUpYLFlBQU8sR0FBUCxPQUFPLENBQThCO0lBSy9DLENBQUM7SUFFUyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQVk7UUFDakMsSUFBSTtZQUNGLE1BQU0sVUFBVSxHQUFHLGdCQUFnQixDQUNqQyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixFQUM3QixJQUFJLENB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