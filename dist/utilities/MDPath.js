"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBDirpath = exports.MDDirpath = exports.MDFilepath = void 0;
const path_1 = __importDefault(require("path"));
/**
 * url = markdown\working_with_recursive_function.md
 * */
function MDFilepath(url) {
    return path_1.default.resolve(`src/${url}`);
    // D:\Code\my-doc-blog\server\src\markdown\working_with_recursive_function.md
}
exports.MDFilepath = MDFilepath;
function MDDirpath() {
    return path_1.default.resolve(`src/markdown`);
    // D:\Code\my-doc-blog\server\src\markdown\working_with_recursive_function.md
}
exports.MDDirpath = MDDirpath;
function DBDirpath() {
    return path_1.default.resolve(`src/database`);
    // D:\Code\my-doc-blog\server\src\markdown\working_with_recursive_function.md
}
exports.DBDirpath = DBDirpath;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTURQYXRoLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsidXRpbGl0aWVzL01EUGF0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxnREFBd0I7QUFFeEI7O0tBRUs7QUFHTCxTQUFnQixVQUFVLENBQUMsR0FBRztJQUM1QixPQUFPLGNBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxDQUFBO0lBQ2pDLDZFQUE2RTtBQUMvRSxDQUFDO0FBSEQsZ0NBR0M7QUFFRCxTQUFnQixTQUFTO0lBQ3ZCLE9BQU8sY0FBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQTtJQUNuQyw2RUFBNkU7QUFDL0UsQ0FBQztBQUhELDhCQUdDO0FBRUQsU0FBZ0IsU0FBUztJQUN2QixPQUFPLGNBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUE7SUFDbkMsNkVBQTZFO0FBQy9FLENBQUM7QUFIRCw4QkFHQyJ9