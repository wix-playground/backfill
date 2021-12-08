import path from "path";
import fs from "fs-extra";
import globby from "globby";

import { NpmCacheStorageOptions } from "backfill-config";
import { Logger } from "backfill-logger";

import packageJson from "package-json";
import { CacheStorage } from "./CacheStorage";
import { npmInstall, npmPublish } from "./npm";

export class NpmCacheStorage extends CacheStorage {
  constructor(
    private options: NpmCacheStorageOptions,
    private internalCacheFolder: string,
    logger: Logger,
    cwd: string
  ) {
    super(logger, cwd);
    this.publishedVersions = NpmCacheStorage.getPublishedVersions(
      options.npmPackageName
    );
  }

  private static getPublishedVersions(packageName: string) {
    return packageJson(packageName, {
      allVersions: true,
    }).then(({ versions }: { versions: {} }) => versions || {});
  }

  private readonly publishedVersions: Promise<Record<string, any>>;

  private getLocalCacheFolder(hash: string): string {
    return path.resolve(this.cwd, this.internalCacheFolder, "npm", hash);
  }

  private static async copy(src: string, dest: string) {
    await fs.mkdirp(path.dirname(dest));
    await fs.copy(src, dest);
  }

  private async isPublished(version: string) {
    try {
      const versions = await this.publishedVersions;
      return !!versions[version];
    } catch {
      return false;
    }
  }

  protected async _fetch(hash: string): Promise<boolean> {
    const { npmPackageName, npmrcUserconfig } = this.options;

    const rootCacheFolder = this.getLocalCacheFolder(hash);

    const packageFolder = path.join(
      rootCacheFolder,
      "node_modules",
      npmPackageName
    );

    if (!fs.existsSync(packageFolder)) {
      fs.mkdirpSync(rootCacheFolder);

      try {
        const runner = npmInstall({
          prefix: rootCacheFolder,
          packageName: npmPackageName,
          version: `0.0.0-${hash}`,
          npmrcUserconfig,
        });

        this.logger.pipeProcessOutput(runner.stdout, runner.stderr);

        await runner;
      } catch (error) {
        fs.removeSync(rootCacheFolder);

        if (error.stderr.toString().indexOf("ETARGET") > -1) {
          return false;
        } else {
          throw new Error(error);
        }
      }
    }

    const files = await globby(`**/*`, {
      cwd: packageFolder,
    });

    await Promise.all(
      files.map(async (file) => {
        if (!file.endsWith("package.json")) {
          await NpmCacheStorage.copy(
            path.join(packageFolder, file),
            path.join(this.cwd, file)
          );
        }
      })
    );
    return true;
  }

  protected async _put(hash: string, filesToCache: string[]) {
    const version = `0.0.0-${hash}`;
    const isPublished = await this.isPublished(version);
    if (!isPublished) {
      const { npmPackageName, npmrcUserconfig } = this.options;
      const temporaryNpmOutputFolder = path.resolve(
        this.getLocalCacheFolder(hash),
        "upload"
      );

      // Create package.json file
      fs.outputJSONSync(path.join(temporaryNpmOutputFolder, "package.json"), {
        name: npmPackageName,
        version,
      });
      await fs.mkdirp(temporaryNpmOutputFolder);
      await Promise.all(
        filesToCache.map(async (file) => {
          await NpmCacheStorage.copy(
            path.join(this.cwd, file),
            path.join(temporaryNpmOutputFolder, file)
          );
        })
      );

      try {
        const runner = npmPublish({
          npmrcUserconfig,
          cwd: temporaryNpmOutputFolder,
        });

        this.logger.pipeProcessOutput(runner.stdout, runner.stderr);

        await runner;
      } catch (error) {
        if (error.stderr.toString().indexOf("403") === -1) {
          throw new Error(error);
        }
      }
    }
  }
}
