"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NpmCacheStorage = void 0;
const path_1 = __importDefault(require("path"));
const execa_1 = __importDefault(require("execa"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const globby_1 = __importDefault(require("globby"));
const CacheStorage_1 = require("./CacheStorage");
class NpmCacheStorage extends CacheStorage_1.CacheStorage {
    constructor(options, internalCacheFolder, logger, cwd) {
        super(logger, cwd);
        this.options = options;
        this.internalCacheFolder = internalCacheFolder;
    }
    async _fetch(hash) {
        const { npmPackageName, registryUrl, npmrcUserconfig } = this.options;
        const temporaryNpmOutputFolder = path_1.default.resolve(this.cwd, this.internalCacheFolder, "npm", hash);
        const packageFolderInTemporaryFolder = path_1.default.join(temporaryNpmOutputFolder, "node_modules", npmPackageName);
        if (!fs_extra_1.default.existsSync(packageFolderInTemporaryFolder)) {
            fs_extra_1.default.mkdirpSync(temporaryNpmOutputFolder);
            try {
                const runner = execa_1.default("npm", [
                    "install",
                    "--prefix",
                    temporaryNpmOutputFolder,
                    `${npmPackageName}@0.0.0-${hash}`,
                    "--registry",
                    registryUrl,
                    "--prefer-offline",
                    "--ignore-scripts",
                    "--no-shrinkwrap",
                    "--no-package-lock",
                    "--loglevel",
                    "error",
                    ...(npmrcUserconfig ? ["--userconfig", npmrcUserconfig] : []),
                ]);
                this.logger.pipeProcessOutput(runner.stdout, runner.stderr);
                await runner;
            }
            catch (error) {
                fs_extra_1.default.removeSync(temporaryNpmOutputFolder);
                if (error.stderr.toString().indexOf("ETARGET") > -1) {
                    return false;
                }
                else {
                    throw new Error(error);
                }
            }
        }
        const files = await globby_1.default(`**/*`, {
            cwd: packageFolderInTemporaryFolder,
        });
        await Promise.all(files.map(async (file) => {
            if (file.endsWith("package.json")) {
                await fs_extra_1.default.mkdirp(path_1.default.dirname(path_1.default.join(this.cwd, file)));
                await fs_extra_1.default.copy(path_1.default.join(packageFolderInTemporaryFolder, file), path_1.default.join(this.cwd, file));
            }
        }));
        return true;
    }
    async _put(hash, filesToCache) {
        const { npmPackageName, registryUrl, npmrcUserconfig } = this.options;
        const temporaryNpmOutputFolder = path_1.default.resolve(this.cwd, this.internalCacheFolder, "npm", hash, "upload");
        // Create package.json file
        fs_extra_1.default.outputJSONSync(path_1.default.join(temporaryNpmOutputFolder, "package.json"), {
            name: npmPackageName,
            version: `0.0.0-${hash}`,
        });
        await fs_extra_1.default.mkdirp(temporaryNpmOutputFolder);
        await Promise.all(filesToCache.map(async (file) => {
            const destinationFolder = path_1.default.join(temporaryNpmOutputFolder, path_1.default.dirname(file));
            await fs_extra_1.default.mkdirp(destinationFolder);
            await fs_extra_1.default.copy(path_1.default.join(this.cwd, file), path_1.default.join(temporaryNpmOutputFolder, file));
        }));
        // Upload package
        try {
            const runner = execa_1.default("npm", [
                "publish",
                "--registry",
                registryUrl,
                "--loglevel",
                "error",
                ...(npmrcUserconfig ? ["--userconfig", npmrcUserconfig] : []),
            ], {
                cwd: temporaryNpmOutputFolder,
                stdout: "inherit",
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
exports.NpmCacheStorage = NpmCacheStorage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTG9jYWxBbmROcG1DYWNoZVN0b3JhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvTG9jYWxBbmROcG1DYWNoZVN0b3JhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsZ0RBQXdCO0FBQ3hCLGtEQUEwQjtBQUMxQix3REFBMEI7QUFDMUIsb0RBQTRCO0FBSzVCLGlEQUE4QztBQUU5QyxNQUFhLGVBQWdCLFNBQVEsMkJBQVk7SUFDL0MsWUFDVSxPQUErQixFQUMvQixtQkFBMkIsRUFDbkMsTUFBYyxFQUNkLEdBQVc7UUFFWCxLQUFLLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBTFgsWUFBTyxHQUFQLE9BQU8sQ0FBd0I7UUFDL0Isd0JBQW1CLEdBQW5CLG1CQUFtQixDQUFRO0lBS3JDLENBQUM7SUFFUyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQVk7UUFDakMsTUFBTSxFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUV0RSxNQUFNLHdCQUF3QixHQUFHLGNBQUksQ0FBQyxPQUFPLENBQzNDLElBQUksQ0FBQyxHQUFHLEVBQ1IsSUFBSSxDQUFDLG1CQUFtQixFQUN4QixLQUFLLEVBQ0wsSUFBSSxDQUNMLENBQUM7UUFFRixNQUFNLDhCQUE4QixHQUFHLGNBQUksQ0FBQyxJQUFJLENBQzlDLHdCQUF3QixFQUN4QixjQUFjLEVBQ2QsY0FBYyxDQUNmLENBQUM7UUFFRixJQUFJLENBQUMsa0JBQUUsQ0FBQyxVQUFVLENBQUMsOEJBQThCLENBQUMsRUFBRTtZQUNsRCxrQkFBRSxDQUFDLFVBQVUsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBRXhDLElBQUk7Z0JBQ0YsTUFBTSxNQUFNLEdBQUcsZUFBSyxDQUFDLEtBQUssRUFBRTtvQkFDMUIsU0FBUztvQkFDVCxVQUFVO29CQUNWLHdCQUF3QjtvQkFDeEIsR0FBRyxjQUFjLFVBQVUsSUFBSSxF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