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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
const joi_1 = __importDefault(require("joi"));
class User extends Base_1.default {
    constructor({ _id = "", first_name, last_name, email, password, created_at, updated_at, avatar }) {
        super("users");
        this._id = "",
            this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.avatar = avatar;
    }
    // @ts-ignore
    validationBeforeSave() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let _a = this, { tableName, _id } = _a, otherValue = __rest(_a, ["tableName", "_id"]);
            let user = joi_1.default.object({
                first_name: joi_1.default.string().required(),
                last_name: joi_1.default.optional(),
                email: joi_1.default.string().email().required(),
                created_at: joi_1.default.date().required(),
                avatar: joi_1.default.optional(),
                updated_at: joi_1.default.date().required(),
                password: joi_1.default.string().required()
            });
            let isError = user.validate(otherValue, { abortEarly: false });
            if (isError.error) {
                let r = {};
                for (const detail of isError.error.details) {
                    r[detail.path[0]] = detail.message;
                }
                resolve(r);
            }
            else {
                resolve(false);
            }
        }));
    }
}
User.tableName = "users";
exports.default = User;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlci5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbIm1vZGVscy9Vc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxrREFBeUI7QUFDekIsOENBQXNCO0FBTXRCLE1BQU0sSUFBSyxTQUFRLGNBQUk7SUFhckIsWUFBWSxFQUFFLEdBQUcsR0FBRyxFQUFFLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFO1FBQzlGLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNkLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRTtZQUNiLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO1FBQzVCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFBO1FBQzFCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO1FBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO1FBQ3hCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO1FBQzVCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFBO1FBQzVCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO0lBQ3RCLENBQUM7SUFHRCxhQUFhO0lBQ2Isb0JBQW9CO1FBQ2xCLE9BQU8sSUFBSSxPQUFPLENBQU0sQ0FBTyxPQUFPLEVBQUUsTUFBTSxFQUFDLEVBQUU7WUFDL0MsSUFBSSxLQUFvQyxJQUFJLEVBQXhDLEVBQUUsU0FBUyxFQUFFLEdBQUcsT0FBd0IsRUFBbkIsVUFBVSxjQUEvQixvQkFBaUMsQ0FBTyxDQUFBO1lBQzVDLElBQUksSUFBSSxHQUFHLGFBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ3BCLFVBQVUsRUFBRSxhQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO2dCQUNuQyxTQUFTLEVBQUUsYUFBRyxDQUFDLFFBQVEsRUFBRTtnQkFDekIsS0FBSyxFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxRQUFRLEVBQUU7Z0JBQ3RDLFVBQVUsRUFBRSxhQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO2dCQUNqQyxNQUFNLEVBQUUsYUFBRyxDQUFDLFFBQVEsRUFBRTtnQkFDdEIsVUFBVSxFQUFFLGFBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUU7Z0JBQ2pDLFFBQVEsRUFBRSxhQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO2FBQ2xDLENBQUMsQ0FBQTtZQUVGLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFDLEVBQUMsVUFBVSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUE7WUFFM0QsSUFBRyxPQUFPLENBQUMsS0FBSyxFQUFDO2dCQUNmLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQTtnQkFDVixLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFO29CQUMxQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUE7aUJBQ25DO2dCQUNELE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTthQUNYO2lCQUFNO2dCQUNMLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTthQUNmO1FBQ0gsQ0FBQyxDQUFBLENBQUMsQ0FBQTtJQUNKLENBQUM7O0FBbERNLGNBQVMsR0FBRyxPQUFPLENBQUE7QUEyRDVCLGtCQUFlLElBQUksQ0FBQSJ9