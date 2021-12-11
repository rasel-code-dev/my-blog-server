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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFrZVppcC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy91dGlsaXRpZXMvbWFrZVppcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBLDBDQUF5QztBQUV6QyxnREFBd0I7QUFFeEIsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRWxDLFNBQVMsU0FBUztJQUVqQixJQUFJLElBQUksR0FBRyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQTtJQUVuQyxPQUFPLElBQUksT0FBTyxDQUFDLENBQU8sT0FBTyxFQUFFLE1BQU0sRUFBQyxFQUFFO1FBRTNDLG9CQUFvQjtRQUNwQixNQUFNLEdBQUcsR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO1FBRXpCLG9CQUFvQjtRQUNwQiwrQ0FBK0M7UUFDL0Msb0ZBQW9GO1FBQ3BGLG9CQUFvQjtRQUVwQixpREFBaUQ7UUFFakQsSUFBSSxLQUFLLENBQUM7UUFDVixJQUFJLENBQUMsT0FBTyxDQUFDLENBQUUsQ0FBQyxFQUFDLEVBQUU7WUFDbEIsQ0FBQzs7b0JBQ0EsSUFBSSxDQUFDLEdBQUcsTUFBTSxJQUFBLGVBQUksRUFBQyxjQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO29CQUM1QyxJQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUU7d0JBQ3hCLElBQUksS0FBSyxHQUFHLE1BQU0sSUFBQSxrQkFBTyxFQUFDLGNBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7d0JBQ25ELEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7NEJBQ2pCLENBQUM7O29DQUNBLElBQUksU0FBUyxHQUFHLE1BQU0sSUFBQSxlQUFJLEVBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtvQ0FDN0MsSUFBRyxTQUFTLENBQUMsTUFBTSxFQUFFLEVBQUU7d0NBQ3RCLEdBQUcsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztxQ0FDcEM7Z0NBQ0YsQ0FBQzs2QkFBQSxFQUFFLENBQUMsQ0FBQTt3QkFDTCxDQUFDLENBQUMsQ0FBQTtxQkFDRjtnQkFDRixDQUFDO2FBQUEsRUFBRSxDQUFDLENBQUE7WUFFSixVQUFVLENBQUMsR0FBRSxFQUFFO2dCQUNkLEdBQUcsQ0FBQyxRQUFRLENBQUMsd0JBQXdCLENBQUMsQ0FBQztnQkFDdkMsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNwQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUE7WUFDdEIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO1lBR1IsMENBQTBDO1lBQzFDLEVBQUU7WUFDRixLQUFLO1FBRU4sQ0FBQyxDQUFDLENBQUE7UUFFRiw2QkFBNkI7UUFHN0IsdUNBQXVDO1FBRXZDLDhCQUE4QjtRQUM5Qiw0QkFBNEI7SUFDN0IsQ0FBQyxDQUFBLENBQUMsQ0FBQTtBQUNILENBQUM7QUFFRCxrQkFBZSxTQUFTLENBQUEifQ==