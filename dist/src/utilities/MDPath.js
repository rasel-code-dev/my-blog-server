"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDDirpath = exports.MDFilepath = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTURQYXRoLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL3V0aWxpdGllcy9NRFBhdGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsZ0RBQXdCO0FBRXhCOztLQUVLO0FBR0wsU0FBZ0IsVUFBVSxDQUFDLEdBQUc7SUFDNUIsT0FBTyxjQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsQ0FBQTtJQUNqQyw2RUFBNkU7QUFDL0UsQ0FBQztBQUhELGdDQUdDO0FBRUQsU0FBZ0IsU0FBUztJQUN2QixPQUFPLGNBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUE7SUFDbkMsNkVBQTZFO0FBQy9FLENBQUM7QUFIRCw4QkFHQyJ9