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
class Hits extends Base_1.default {
    constructor({ _id = "", post_id, hits }) {
        super(Hits.tableName);
        this.post_id = post_id;
        this.hits = hits;
        this._id = "";
    }
    // @ts-ignore
    validationBeforeSave() {
        let _a = this, { tableName } = _a, otherValue = __rest(_a, ["tableName"]);
        return new Promise((resolve, reject) => {
            let user = joi_1.default.object({
                _id: joi_1.default.optional(),
                post_id: joi_1.default.any().required(),
                hits: joi_1.default.array().required()
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
Hits.tableName = "hits";
exports.default = Hits;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSGl0cy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbIm1vZGVscy9IaXRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxrREFBeUI7QUFDekIsOENBQXNCO0FBRXRCLE1BQU0sSUFBSyxTQUFRLGNBQUk7SUFRckIsWUFBWSxFQUFFLEdBQUcsR0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRTtRQUNuQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFBO0lBQ2YsQ0FBQztJQUVELGFBQWE7SUFDYixvQkFBb0I7UUFDbEIsSUFBSSxLQUErQixJQUFJLEVBQW5DLEVBQUUsU0FBUyxPQUF3QixFQUFuQixVQUFVLGNBQTFCLGFBQTRCLENBQU8sQ0FBQTtRQUN2QyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBQyxFQUFFO1lBQ3BDLElBQUksSUFBSSxHQUFHLGFBQUcsQ0FBQyxNQUFNLENBQUM7Z0JBQ3BCLEdBQUcsRUFBRSxhQUFHLENBQUMsUUFBUSxFQUFFO2dCQUNuQixPQUFPLEVBQUUsYUFBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRTtnQkFDN0IsSUFBSSxFQUFFLGFBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxRQUFRLEVBQUU7YUFDN0IsQ0FBQyxDQUFBO1lBQ0YsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FDekIsVUFBVSxFQUNWLEVBQUMsVUFBVSxFQUFFLEtBQUssRUFBQyxDQUNwQixDQUFBO1lBQ0QsSUFBRyxPQUFPLENBQUMsS0FBSyxFQUFDO2dCQUNmLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQTtnQkFDVixLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFO29CQUMxQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUE7aUJBQ25DO2dCQUNELE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTthQUNYO2lCQUFNO2dCQUNMLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTthQUNkO1FBQ0gsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDOztBQXBDTSxjQUFTLEdBQUcsTUFBTSxDQUFBO0FBNEMzQixrQkFBZSxJQUFJLENBQUEifQ==