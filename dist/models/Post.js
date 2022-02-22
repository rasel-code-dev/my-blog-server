"use strict";
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
class Post extends Base_1.default {
    constructor({ title, slug, path, cover, tags, author_id, summary, created_at, updated_at }) {
        super("posts");
        this._id = "";
        this.title = title;
        this.slug = slug;
        this.tags = tags;
        this.cover = cover;
        this.path = path;
        this.author_id = author_id;
        this.summary = summary;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
    // @ts-ignore
    validationBeforeSave() {
        let _a = this, { tableName } = _a, otherValue = __rest(_a, ["tableName"]);
        return new Promise((resolve, reject) => {
            let user = joi_1.default.object({
                _id: joi_1.default.optional(),
                title: joi_1.default.string().required(),
                slug: joi_1.default.string().required(),
                path: joi_1.default.string().required(),
                author_id: joi_1.default.any().required(),
                summary: joi_1.default.string().required(),
                cover: joi_1.default.optional(),
                tags: joi_1.default.array().required(),
                updated_at: joi_1.default.date().required(),
                created_at: joi_1.default.date().required()
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
                resolve(null);
            }
        });
    }
}
Post.tableName = "posts";
exports.default = Post;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUG9zdC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbIm1vZGVscy9Qb3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJQSxrREFBeUI7QUFDekIsOENBQXNCO0FBSXRCLE1BQU0sSUFBSyxTQUFRLGNBQUk7SUFjckIsWUFBWSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFO1FBQ3hGLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUNkLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFBO1FBQ2IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7UUFDbEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7UUFDaEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7UUFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUE7UUFDbEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7UUFDaEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUE7UUFDMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7UUFDdEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7UUFDNUIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUE7SUFDOUIsQ0FBQztJQUVELGFBQWE7SUFDYixvQkFBb0I7UUFDbEIsSUFBSSxLQUErQixJQUFJLEVBQW5DLEVBQUUsU0FBUyxPQUF3QixFQUFuQixVQUFVLGNBQTFCLGFBQTRCLENBQU8sQ0FBQTtRQUN2QyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBQyxFQUFFO1lBQ3BDLElBQUksSUFBSSxHQUFHLGFBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ3BCLEdBQUcsRUFBRSxhQUFHLENBQUMsUUFBUSxFQUFFO2dCQUNuQixLQUFLLEVBQUUsYUFBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsRUFBRTtnQkFDOUIsSUFBSSxFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7Z0JBQzdCLElBQUksRUFBRSxhQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxFQUFFO2dCQUM3QixTQUFTLEVBQUUsYUFBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRTtnQkFDL0IsT0FBTyxFQUFFLGFBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUU7Z0JBQ2hDLEtBQUssRUFBRSxhQUFHLENBQUMsUUFBUSxFQUFFO2dCQUNyQixJQUFJLEVBQUUsYUFBRyxDQUFDLEtBQUssRUFBRSxDQUFDLFFBQVEsRUFBRTtnQkFDNUIsVUFBVSxFQUFFLGFBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUU7Z0JBQ2pDLFVBQVUsRUFBRSxhQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFO2FBQ2xDLENBQUMsQ0FBQTtZQUNGLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQ3pCLFVBQVUsRUFDVixFQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUMsQ0FDcEIsQ0FBQTtZQUNELElBQUcsT0FBTyxDQUFDLEtBQUssRUFBQztnQkFDZixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUE7Z0JBQ1YsS0FBSyxNQUFNLE1BQU0sSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRTtvQkFDMUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFBO2lCQUNuQztnQkFDRCxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUE7YUFDWDtpQkFBTTtnQkFDTCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7YUFDZDtRQUNILENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQzs7QUF4RE0sY0FBUyxHQUFHLE9BQU8sQ0FBQTtBQWdFNUIsa0JBQWUsSUFBSSxDQUFBIn0=