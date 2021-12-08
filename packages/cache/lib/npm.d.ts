import execa from "execa";
export declare function npmInstall({ prefix, packageName, version, npmrcUserconfig, }: {
    prefix: string;
    packageName: string;
    version: string;
    npmrcUserconfig: string | undefined;
}): execa.ExecaChildProcess<string>;
export declare function npmPublish({ npmrcUserconfig, cwd, }: {
    npmrcUserconfig: string | undefined;
    cwd: string;
}): execa.ExecaChildProcess<string>;
//# sourceMappingURL=npm.d.ts.map