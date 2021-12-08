"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NpmCacheStorage = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const globby_1 = __importDefault(require("globby"));
const package_json_1 = __importDefault(require("package-json"));
const CacheStorage_1 = require("./CacheStorage");
const npm_1 = require("./npm");
class NpmCacheStorage extends CacheStorage_1.CacheStorage {
    constructor(options, internalCacheFolder, logger, cwd) {
        super(logger, cwd);
        this.options = options;
        this.internalCacheFolder = internalCacheFolder;
        this.publishedVersions = NpmCacheStorage.getPublishedVersions(options.npmPackageName);
    }
    static getPublishedVersions(packageName) {
        return package_json_1.default(packageName, {
            allVersions: true,
        }).then(({ versions }) => versions || {});
    }
    getLocalCacheFolder(hash) {
        return path_1.default.resolve(this.cwd, this.internalCacheFolder, "npm", hash);
    }
    static async copy(src, dest) {
        await fs_extra_1.default.mkdirp(path_1.default.dirname(dest));
        await fs_extra_1.default.copy(src, dest);
    }
    async isPublished(version) {
        try {
            const versions = await this.publishedVersions;
            return !!versions[version];
        }
        catch {
            return false;
        }
    }
    async _fetch(hash) {
        const { npmPackageName, npmrcUserconfig } = this.options;
        const rootCacheFolder = this.getLocalCacheFolder(hash);
        const packageFolder = path_1.default.join(rootCacheFolder, "node_modules", npmPackageName);
        if (!fs_extra_1.default.existsSync(packageFolder)) {
            fs_extra_1.default.mkdirpSync(rootCacheFolder);
            try {
                const runner = npm_1.npmInstall({
                    prefix: rootCacheFolder,
                    packageName: npmPackageName,
                    version: `0.0.0-${hash}`,
                    npmrcUserconfig,
                });
                this.logger.pipeProcessOutput(runner.stdout, runner.stderr);
                await runner;
            }
            catch (error) {
                fs_extra_1.default.removeSync(rootCacheFolder);
                if (error.stderr.toString().indexOf("ETARGET") > -1) {
                    return false;
                }
                else {
                    throw new Error(error);
                }
            }
        }
        const files = await globby_1.default(`**/*`, {
            cwd: packageFolder,
        });
        await Promise.all(files.map(async (file) => {
            if (!file.endsWith("package.json")) {
                await NpmCacheStorage.copy(path_1.default.join(packageFolder, file), path_1.default.join(this.cwd, file));
            }
        }));
        return true;
    }
    async _put(hash, filesToCache) {
        const version = `0.0.0-${hash}`;
        const isPublished = await this.isPublished(version);
        if (!isPublished) {
            const { npmPackageName, npmrcUserconfig } = this.options;
            const temporaryNpmOutputFolder = path_1.default.resolve(this.getLocalCacheFolder(hash), "upload");
            // Create package.json file
            fs_extra_1.default.outputJSONSync(path_1.default.join(temporaryNpmOutputFolder, "package.json"), {
                name: npmPackageName,
                version,
            });
            await fs_extra_1.default.mkdirp(temporaryNpmOutputFolder);
            await Promise.all(filesToCache.map(async (file) => {
                await NpmCacheStorage.copy(path_1.default.join(this.cwd, file), path_1.default.join(temporaryNpmOutputFolder, file));
            }));
            try {
                const runner = npm_1.npmPublish({
                    npmrcUserconfig,
                    cwd: temporaryNpmOutputFolder,
                });
                this.logger.pipeProcessOutput(runner.stdout, runner.stderr);
                await runner;
            }
            catch (error) {
                if (error.stderr.toString().indexOf("403") === -1) {
                    throw new Error(error);
                }
            }
        }
    }
}
exports.NpmCacheStorage = NpmCacheStorage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTnBtQ2FjaGVTdG9yYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL05wbUNhY2hlU3RvcmFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsd0RBQTBCO0FBQzFCLG9EQUE0QjtBQUs1QixnRUFBdUM7QUFDdkMsaURBQThDO0FBQzlDLCtCQUErQztBQUUvQyxNQUFhLGVBQWdCLFNBQVEsMkJBQVk7SUFDL0MsWUFDVSxPQUErQixFQUMvQixtQkFBMkIsRUFDbkMsTUFBYyxFQUNkLEdBQVc7UUFFWCxLQUFLLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBTFgsWUFBTyxHQUFQLE9BQU8sQ0FBd0I7UUFDL0Isd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFRO1FBS25DLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxlQUFlLENBQUMsb0JBQW9CLENBQzNELE9BQU8sQ0FBQyxjQUFjLENBQ3ZCLENBQUM7SUFDSixDQUFDO0lBRU8sTUFBTSxDQUFDLG9CQUFvQixDQUFDLFdBQW1CO1FBQ3JELE9BQU8sc0JBQVcsQ0FBQyxXQUFXLEVBQUU7WUFDOUIsV0FBVyxFQUFFLElBQUk7U0FDbEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFvQixFQUFFLEVBQUUsQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUlPLG1CQUFtQixDQUFDLElBQVk7UUFDdEMsT0FBTyxjQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRU8sTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBVyxFQUFFLElBQVk7UUFDakQsTUFBTSxrQkFBRSxDQUFDLE1BQU0sQ0FBQyxjQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENB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