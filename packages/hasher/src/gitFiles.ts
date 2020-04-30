import path from "path";
import globby from "globby";
import findUp from "find-up";

export async function getListOfGitFiles(
  packageRoot: string
): Promise<string[]> {
  const nearestGitFolder = await findUp(".git", {
    cwd: packageRoot,
    type: "directory"
  });

  if (nearestGitFolder === undefined) {
    throw new Error(
      `It does not seem that this package is in a git repo: ${packageRoot}`
    );
  }

  const repoRoot = path.dirname(nearestGitFolder);

  // If the package is a git repo by itself then the search pattern is all the files
  const relativePackagePath = path.relative(repoRoot, packageRoot) || "**/*";

  // TODO: before merging, replace all usage of fast-glob by globby
  /*
   * We use globby to find of the files tracked by git because
   * it implements excluding the git-ignored content on top of
   * fast-glob.
   * We need to search from the repo root to git globby take
   * all the gitignore files in consideration.
   */
  // Note: globby does not support objectMode
  const absoluteFiles = await globby(relativePackagePath, {
    cwd: repoRoot,
    gitignore: true,
    absolute: true
  });

  // The file paths are returned relative to the input parameter (packageRoot)
  const files = absoluteFiles.map(f => path.relative(packageRoot, f));

  // To get predictable output we sort the file names
  files.sort((a, b) => a.localeCompare(b));

  return files;
}
