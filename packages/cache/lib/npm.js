"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.npmPublish = exports.npmInstall = void 0;
const execa_1 = __importDefault(require("execa"));
function npmInstall({ prefix, packageName, version, npmrcUserconfig, }) {
    return execa_1.default("npm", [
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
exports.npmInstall = npmInstall;
function npmPublish({ npmrcUserconfig, cwd, }) {
    return execa_1.default("npm", [
        "publish",
        "--loglevel",
        "error",
        ...(npmrcUserconfig ? ["--userconfig", npmrcUserconfig] : []),
    ], {
        cwd,
        stdout: "inherit",
    });
}
exports.npmPublish = npmPublish;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnBtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL25wbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxrREFBMEI7QUFFMUIsU0FBZ0IsVUFBVSxDQUFDLEVBQ3pCLE1BQU0sRUFDTixXQUFXLEVBQ1gsT0FBTyxFQUNQLGVBQWUsR0FNaEI7SUFDQyxPQUFPLGVBQUssQ0FBQyxLQUFLLEVBQUU7UUFDbEIsU0FBUztRQUNULFVBQVU7UUFDVixNQUFNO1FBQ04sR0FBRyxXQUFXLElBQUksT0FBTyxFQUFFO1FBQzNCLGtCQUFrQjtRQUNsQixrQkFBa0I7UUFDbEIsaUJBQWlCO1FBQ2pCLG1CQUFtQjtRQUNuQixZQUFZO1FBQ1osT0FBTztRQUNQLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7S0FDOUQsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQXhCRCxnQ0F3QkM7QUFFRCxTQUFnQixVQUFVLENBQUMsRUFDekIsZUFBZSxFQUNmLEdBQUcsR0FJSjtJQUNDLE9BQU8sZUFBSyxDQUNWLEtBQUssRUFDTDtRQUNFLFNBQVM7UUFDVCxZQUFZO1FBQ1osT0FBTztRQUNQLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7S0FDOUQsRUFDRDtRQUNFLEdBQUc7UUFDSCxNQUFNLEVBQUUsU0FBUztLQUNsQixDQUNGLENBQUM7QUFDSixDQUFDO0FBcEJELGdDQW9CQyJ9