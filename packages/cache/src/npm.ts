import execa from "execa";

export function npmInstall({
  prefix,
  packageName,
  version,
  npmrcUserconfig,
}: {
  prefix: string;
  packageName: string;
  version: string;
  npmrcUserconfig: string | undefined;
}) {
  return execa("npm", [
    "install",
    "--prefix",
    prefix,
    `${packageName}@${version}`,
    "--prefer-offline",
    "--ignore-scripts",
    "--no-shrinkwrap",
    "--no-package-lock",
    "--loglevel",
    "error",
    ...(npmrcUserconfig ? ["--userconfig", npmrcUserconfig] : []),
  ]);
}

export function npmPublish({
  npmrcUserconfig,
  cwd,
}: {
  npmrcUserconfig: string | undefined;
  cwd: string;
}) {
  return execa(
    "npm",
    [
      "publish",
      "--loglevel",
      "error",
      ...(npmrcUserconfig ? ["--userconfig", npmrcUserconfig] : []),
    ],
    {
      cwd,
      stdout: "inherit",
    }
  );
}
