import { Logger } from "backfill-logger";
import { Config } from "backfill-config";
export { createDefaultConfig } from "backfill-config";
import { BuildCommand } from "./commandRunner";
export declare function backfill(config: Config, buildCommand: BuildCommand, hashSalt: string, logger: Logger): Promise<void>;
export declare function main(): Promise<void>;
//# sourceMappingURL=index.d.ts.map