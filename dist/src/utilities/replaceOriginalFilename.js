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
const fs_1 = __importDefault(require("fs"));
function replaceOriginalFilename(files, fieldName) {
    return new Promise((resolve, reject) => {
        if (files && files[fieldName]) {
            let tempDir = files[fieldName].filepath.replace(files[fieldName].newFilename, '');
            let newPath = tempDir + files[fieldName].originalFilename;
            fs_1.default.rename(files[fieldName].filepath, newPath, (err) => __awaiter(this, void 0, void 0, function* () {
                if (!err) {
                    resolve({ newPath, name: files[fieldName].originalFilename });
                }
                else {
                    reject("file rename fail");
                }
            }));
        }
    });
}
// linux ===> /tmp/postcss-8-plugin-migration.md
// win ===> C/users/[usrename]/appdata/Rooming/tmp/postcss-8-plugin-migration.md
exports.default = replaceOriginalFilename;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbGFjZU9yaWdpbmFsRmlsZW5hbWUuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvdXRpbGl0aWVzL3JlcGxhY2VPcmlnaW5hbEZpbGVuYW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNENBQW9CO0FBR3BCLFNBQVMsdUJBQXVCLENBQUMsS0FBSyxFQUFFLFNBQWlCO0lBQ3ZELE9BQU8sSUFBSSxPQUFPLENBQWtDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBQyxFQUFFO1FBQ3JFLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUM3QixJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1lBQ2pGLElBQUksT0FBTyxHQUFHLE9BQU8sR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsZ0JBQWdCLENBQUE7WUFDekQsWUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFPLEdBQUcsRUFBRSxFQUFFO2dCQUMxRCxJQUFJLENBQUMsR0FBRyxFQUFFO29CQUNSLE9BQU8sQ0FBQyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLGdCQUFnQixFQUFDLENBQUMsQ0FBQTtpQkFDNUQ7cUJBQU07b0JBQ0wsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUE7aUJBQzNCO1lBQ0gsQ0FBQyxDQUFBLENBQUMsQ0FBQTtTQUNIO0lBQ0gsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDO0FBRUQsZ0RBQWdEO0FBQ2hELGdGQUFnRjtBQUVoRixrQkFBZSx1QkFBdUIsQ0FBQSJ9