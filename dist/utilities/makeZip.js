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
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        // creating archives
        const zip = new AdmZip();
        try {
            let dir = path_1.default.join(__dirname, "../../", "dist/markdown");
            let s = yield (0, promises_1.stat)(dir);
            if (s && s.isDirectory()) {
                let files = yield (0, promises_1.readdir)(dir);
                files.forEach((f, index) => {
                    (function () {
                        return __awaiter(this, void 0, void 0, function* () {
                            try {
                                let fileStats = yield (0, promises_1.stat)(path_1.default.join(dir, f));
                                if (fileStats.isFile()) {
                                    zip.addLocalFile(path_1.default.join(dir, f));
                                    if (index + 1 >= files.length) {
                                        // all file added
                                        // let path = "files.zip"
                                        // zip.writeZip(path);
                                        // send zip as buffer data
                                        resolve(zip.toBufferPromise());
                                    }
                                }
                            }
                            catch (ex) {
                                reject("Archive create fail");
                            }
                        });
                    }());
                });
            }
        }
        catch (ex) {
            reject("Archive create fail");
        }
    }));
}
exports.default = createZip;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFrZVppcC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInV0aWxpdGllcy9tYWtlWmlwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsMENBQXlDO0FBRXpDLGdEQUF3QjtBQUV4QixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFFbEMsU0FBUyxTQUFTO0lBRWpCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBTyxPQUFPLEVBQUUsTUFBTSxFQUFDLEVBQUU7UUFFM0Msb0JBQW9CO1FBQ3BCLE1BQU0sR0FBRyxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7UUFFekIsSUFBRztZQUNGLElBQUksR0FBRyxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxlQUFlLENBQUMsQ0FBQTtZQUN6RCxJQUFJLENBQUMsR0FBRyxNQUFNLElBQUEsZUFBSSxFQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ3ZCLElBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRTtnQkFDeEIsSUFBSSxLQUFLLEdBQUcsTUFBTSxJQUFBLGtCQUFPLEVBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQzlCLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUU7b0JBRTFCLENBQUM7OzRCQUVBLElBQUc7Z0NBQ0YsSUFBSSxTQUFTLEdBQUcsTUFBTSxJQUFBLGVBQUksRUFBQyxjQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO2dDQUM3QyxJQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtvQ0FDdEIsR0FBRyxDQUFDLFlBQVksQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO29DQUVwQyxJQUFHLEtBQUssR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBQzt3Q0FDNUIsaUJBQWlCO3dDQUNqQix5QkFBeUI7d0NBQ3pCLHNCQUFzQjt3Q0FFdEIsMEJBQTBCO3dDQUMxQixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUE7cUNBRTlCO2lDQUNEOzZCQUNEOzRCQUFDLE9BQU8sRUFBRSxFQUFDO2dDQUNYLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBOzZCQUM3Qjt3QkFFRixDQUFDO3FCQUFBLEVBQUUsQ0FBQyxDQUFBO2dCQUNMLENBQUMsQ0FBQyxDQUFBO2FBQ0Y7U0FDRDtRQUFDLE9BQU8sRUFBRSxFQUFDO1lBQ1gsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUE7U0FDN0I7SUFDRixDQUFDLENBQUEsQ0FBQyxDQUFBO0FBQ0gsQ0FBQztBQUVELGtCQUFlLFNBQVMsQ0FBQSJ9