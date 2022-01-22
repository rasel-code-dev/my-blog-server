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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwbGFjZU9yaWdpbmFsRmlsZW5hbWUuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJ1dGlsaXRpZXMvcmVwbGFjZU9yaWdpbmFsRmlsZW5hbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0Q0FBb0I7QUFHcEIsU0FBUyx1QkFBdUIsQ0FBQyxLQUFLLEVBQUUsU0FBaUI7SUFDdkQsT0FBTyxJQUFJLE9BQU8sQ0FBa0MsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFDLEVBQUU7UUFDckUsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzdCLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUE7WUFDakYsSUFBSSxPQUFPLEdBQUcsT0FBTyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQTtZQUN6RCxZQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQU8sR0FBRyxFQUFFLEVBQUU7Z0JBQzFELElBQUksQ0FBQyxHQUFHLEVBQUU7b0JBQ1IsT0FBTyxDQUFDLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsZ0JBQWdCLEVBQUMsQ0FBQyxDQUFBO2lCQUM1RDtxQkFBTTtvQkFDTCxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtpQkFDM0I7WUFDSCxDQUFDLENBQUEsQ0FBQyxDQUFBO1NBQ0g7SUFDSCxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFFRCxnREFBZ0Q7QUFDaEQsZ0ZBQWdGO0FBRWhGLGtCQUFlLHVCQUF1QixDQUFBIn0=