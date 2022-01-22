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
exports.deleteComment = exports.createComment = void 0;
const response_1 = __importDefault(require("../response"));
const errorConsole_1 = __importDefault(require("../logger/errorConsole"));
const shortid = require("shortid");
const db_1 = __importDefault(require("../database/db"));
const createComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user_id !== req.body.user_id) {
        return (0, response_1.default)(res, 404, { message: "Unauthorized" });
    }
    try {
        let { post_id, text, user_id, username, avatar } = req.body;
        if (post_id && text && user_id && username && avatar) {
            // let comment = db.get('comments').find({ post_id: post_id, user_id: req.user_id }).value()
            let newComment = {
                id: shortid.generate(),
                post_id,
                text,
                user_id,
                username,
                avatar,
                created_at: new Date(),
                reply: null
            };
            let g = db_1.default.get('comments').push(newComment).write();
            if (g) {
                (0, response_1.default)(res, 201, { newComment });
            }
            else {
                return (0, response_1.default)(res, 404, { message: "Incomplete Comment Data" });
            }
        }
        else {
            return (0, response_1.default)(res, 404, { message: "Incomplete Comment Data" });
        }
    }
    catch (ex) {
        (0, errorConsole_1.default)(ex);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createComment = createComment;
const deleteComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { comment_id, post_id, user_id } = req.query;
    if (req.user_id !== user_id) {
        return (0, response_1.default)(res, 404, { message: "Unauthorized" });
    }
    try {
        if (comment_id && post_id && user_id) {
            let g = db_1.default.get('comments').remove({ id: comment_id }).write();
            if (g) {
                (0, response_1.default)(res, 201, { id: comment_id, message: "Comment Deleted" });
            }
            else {
                return (0, response_1.default)(res, 404, { message: "Comment Delete fail" });
            }
        }
        else {
            return (0, response_1.default)(res, 404, { message: "Comment Delete fail" });
        }
    }
    catch (ex) {
        (0, errorConsole_1.default)(ex);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteComment = deleteComment;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWVudENvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJjb250cm9sbGVycy9jb21tZW50Q29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyREFBbUM7QUFDbkMsMEVBQWtEO0FBQ2xELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUdsQyx3REFBZ0M7QUFHekIsTUFBTSxhQUFhLEdBQUcsQ0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQyxFQUFFO0lBRXBELElBQUcsR0FBRyxDQUFDLE9BQU8sS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBQztRQUNuQyxPQUFPLElBQUEsa0JBQVEsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLGNBQWMsRUFBQyxDQUFDLENBQUE7S0FDcEQ7SUFFRCxJQUFJO1FBRUgsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFBO1FBRTNELElBQUcsT0FBTyxJQUFJLElBQUksSUFBSSxPQUFPLElBQUksUUFBUSxJQUFJLE1BQU0sRUFBRTtZQUVwRCw0RkFBNEY7WUFDNUYsSUFBSSxVQUFVLEdBQUc7Z0JBQ2hCLEVBQUUsRUFBRSxPQUFPLENBQUMsUUFBUSxFQUFFO2dCQUN0QixPQUFPO2dCQUNQLElBQUk7Z0JBQ0osT0FBTztnQkFDUCxRQUFRO2dCQUNSLE1BQU07Z0JBQ04sVUFBVSxFQUFFLElBQUksSUFBSSxFQUFFO2dCQUN0QixLQUFLLEVBQUUsSUFBSTthQUNYLENBQUE7WUFFRCxJQUFJLENBQUMsR0FBRyxZQUFFLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtZQUNuRCxJQUFHLENBQUMsRUFBQztnQkFDSixJQUFBLGtCQUFRLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFDLFVBQVUsRUFBQyxDQUFDLENBQUE7YUFDaEM7aUJBQU07Z0JBQ04sT0FBTyxJQUFBLGtCQUFRLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSx5QkFBeUIsRUFBQyxDQUFDLENBQUE7YUFDL0Q7U0FFRDthQUFNO1lBQ04sT0FBTyxJQUFBLGtCQUFRLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSx5QkFBeUIsRUFBQyxDQUFDLENBQUE7U0FDL0Q7S0FHRDtJQUFDLE9BQU8sRUFBRSxFQUFDO1FBQ1gsSUFBQSxzQkFBWSxFQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ2hCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsT0FBTyxFQUFFLHVCQUF1QixFQUFDLENBQUMsQ0FBQTtLQUN4RDtBQUNGLENBQUMsQ0FBQSxDQUFBO0FBeENZLFFBQUEsYUFBYSxpQkF3Q3pCO0FBR00sTUFBTSxhQUFhLEdBQUcsQ0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQyxFQUFFO0lBRXBELElBQUksRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUE7SUFFaEQsSUFBRyxHQUFHLENBQUMsT0FBTyxLQUFLLE9BQU8sRUFBQztRQUMxQixPQUFPLElBQUEsa0JBQVEsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLGNBQWMsRUFBQyxDQUFDLENBQUE7S0FDcEQ7SUFFRCxJQUFJO1FBRUgsSUFBRyxVQUFVLElBQUksT0FBTyxJQUFJLE9BQU8sRUFBRTtZQUVwQyxJQUFJLENBQUMsR0FBRyxZQUFFLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFDLEVBQUUsRUFBRSxVQUFVLEVBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFBO1lBQzNELElBQUcsQ0FBQyxFQUFDO2dCQUNKLElBQUEsa0JBQVEsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUMsRUFBRSxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUMsQ0FBQyxDQUFBO2FBQ2hFO2lCQUFNO2dCQUNOLE9BQU8sSUFBQSxrQkFBUSxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUscUJBQXFCLEVBQUMsQ0FBQyxDQUFBO2FBQzNEO1NBRUQ7YUFBTTtZQUNOLE9BQU8sSUFBQSxrQkFBUSxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUscUJBQXFCLEVBQUMsQ0FBQyxDQUFBO1NBQzNEO0tBR0Q7SUFBQyxPQUFPLEVBQUUsRUFBQztRQUNYLElBQUEsc0JBQVksRUFBQyxFQUFFLENBQUMsQ0FBQTtRQUNoQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLE9BQU8sRUFBRSx1QkFBdUIsRUFBQyxDQUFDLENBQUE7S0FDeEQ7QUFDRixDQUFDLENBQUEsQ0FBQTtBQTVCWSxRQUFBLGFBQWEsaUJBNEJ6QiJ9