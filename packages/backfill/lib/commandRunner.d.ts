import execa from "execa";
import { Logger } from "backfill-logger";
export declare type ExecaReturns = execa.ExecaChildProcess;
export declare type BuildCommand = () => Promise<ExecaReturns | void>;
export declare function getRawBuildCommand(): string;
export declare function createBuildCommand(buildCommand: string[], clearOutput: boolean, outputGlob: string[], logger: Logger): () => Promise<ExecaReturns | void>;
//# sourceMappingURL=commandRunner.d.ts.map