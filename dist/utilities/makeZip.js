"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const AdmZip = require("adm-zip");
function createZip() {
    let dirs = ["database", "markdown"];
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        // creating archives
        const zip = new AdmZip();
        // add file directly
        // const content = "inner content of the file";
        // zip.addFile("test.txt", Buffer.from(content, "utf8"), "entry comment goes here");
        // // add local file
        // zip.addLocalFile("/home/me/some_picture.png");
        let count;
        dirs.forEach((d) => {
            (function () {
                return __awaiter(this, void 0, void 0, function* () {
                    let s = yield (0, promises_1.stat)(path_1.default.resolve(`src/${d}`));
                    if (s && s.isDirectory()) {
                        let files = yield (0, promises_1.readdir)(path_1.default.resolve(`src/${d}`));
                        files.forEach(f => {
                            (function () {
                                return __awaiter(this, void 0, void 0, function* () {
                                    let fileStats = yield (0, promises_1.stat)(`./src/${d}/${f}`);
                                    if (fileStats.isFile()) {
                                        zip.addLocalFile(`./src/${d}/${f}`);
                                    }
                                });
                            }());
                        });
                    }
                });
            }());
            setTimeout(() => {
                zip.writeZip(`./src/backup/files.zip`);
                const willSendthis = zip.toBuffer();
                resolve(willSendthis);
            }, 5000);
            // fs.readdir(`./src/${d}`, (err, file)=>{
            //
            // })
        });
        // get everything as a buffer
        // const willSendthis = zip.toBuffer();
        // or write everything to disk
        // console.log(willSendthis)
    }));
}
exports.default = createZip;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFrZVppcC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInV0aWxpdGllcy9tYWtlWmlwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsMENBQXlDO0FBRXpDLGdEQUF3QjtBQUV4QixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFFbEMsU0FBUyxTQUFTO0lBRWpCLElBQUksSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFBO0lBRW5DLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBTyxPQUFPLEVBQUUsTUFBTSxFQUFDLEVBQUU7UUFFM0Msb0JBQW9CO1FBQ3BCLE1BQU0sR0FBRyxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7UUFFekIsb0JBQW9CO1FBQ3BCLCtDQUErQztRQUMvQyxvRkFBb0Y7UUFDcEYsb0JBQW9CO1FBRXBCLGlEQUFpRDtRQUVqRCxJQUFJLEtBQUssQ0FBQztRQUNWLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBRSxDQUFDLEVBQUMsRUFBRTtZQUNsQixDQUFDOztvQkFDQSxJQUFJLENBQUMsR0FBRyxNQUFNLElBQUEsZUFBSSxFQUFDLGNBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7b0JBQzVDLElBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRTt3QkFDeEIsSUFBSSxLQUFLLEdBQUcsTUFBTSxJQUFBLGtCQUFPLEVBQUMsY0FBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTt3QkFDbkQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTs0QkFDakIsQ0FBQzs7b0NBQ0EsSUFBSSxTQUFTLEdBQUcsTUFBTSxJQUFBLGVBQUksRUFBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO29DQUM3QyxJQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsRUFBRTt3Q0FDdEIsR0FBRyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO3FDQUNwQztnQ0FDRixDQUFDOzZCQUFBLEVBQUUsQ0FBQyxDQUFBO3dCQUNMLENBQUMsQ0FBQyxDQUFBO3FCQUNGO2dCQUNGLENBQUM7YUFBQSxFQUFFLENBQUMsQ0FBQTtZQUVKLFVBQVUsQ0FBQyxHQUFFLEVBQUU7Z0JBQ2QsR0FBRyxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO2dCQUN2QyxNQUFNLFlBQVksR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3BDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtZQUN0QixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUE7WUFHUiwwQ0FBMEM7WUFDMUMsRUFBRTtZQUNGLEtBQUs7UUFFTixDQUFDLENBQUMsQ0FBQTtRQUVGLDZCQUE2QjtRQUc3Qix1Q0FBdUM7UUFFdkMsOEJBQThCO1FBQzlCLDRCQUE0QjtJQUM3QixDQUFDLENBQUEsQ0FBQyxDQUFBO0FBQ0gsQ0FBQztBQUVELGtCQUFlLFNBQVMsQ0FBQSJ9