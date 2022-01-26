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
const database_1 = require("../database");
const createComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user_id !== req.body.user_id) {
        return (0, response_1.default)(res, 404, { message: "Unauthorized" });
    }
    let client;
    try {
        let { post_id, text, user_id, username, avatar } = req.body;
        client = yield (0, database_1.redisConnect)();
        if (post_id && text && user_id && username) {
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
            let isCommentAdded = yield client.HSET('comments', newComment.id, JSON.stringify(newComment));
            if (isCommentAdded) {
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
        (0, response_1.default)(res, 500, "Internal server error");
    }
    finally {
        client === null || client === void 0 ? void 0 : client.quit();
    }
});
exports.createComment = createComment;
const deleteComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let { comment_id, post_id, user_id } = req.query;
    if (req.user_id !== user_id) {
        return (0, response_1.default)(res, 404, { message: "Unauthorized" });
    }
    let client;
    try {
        client = yield (0, database_1.redisConnect)();
        if (comment_id && post_id && user_id) {
            let g = client.HDEL("comments", comment_id);
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
        (0, response_1.default)(res, 500, "Internal server error");
    }
    finally {
        client === null || client === void 0 ? void 0 : client.quit();
    }
});
exports.deleteComment = deleteComment;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWVudENvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJjb250cm9sbGVycy9jb21tZW50Q29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyREFBbUM7QUFDbkMsMEVBQWtEO0FBQ2xELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQTtBQUdsQywwQ0FBeUM7QUFHbEMsTUFBTSxhQUFhLEdBQUcsQ0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQyxFQUFFO0lBRXBELElBQUcsR0FBRyxDQUFDLE9BQU8sS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBQztRQUNuQyxPQUFPLElBQUEsa0JBQVEsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLGNBQWMsRUFBQyxDQUFDLENBQUE7S0FDcEQ7SUFDRCxJQUFJLE1BQU0sQ0FBQztJQUNYLElBQUk7UUFFSCxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUE7UUFDM0QsTUFBTSxHQUFHLE1BQU0sSUFBQSx1QkFBWSxHQUFFLENBQUE7UUFFN0IsSUFBRyxPQUFPLElBQUksSUFBSSxJQUFJLE9BQU8sSUFBSSxRQUFRLEVBQUU7WUFFMUMsNEZBQTRGO1lBQzVGLElBQUksVUFBVSxHQUFHO2dCQUNoQixFQUFFLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRTtnQkFDdEIsT0FBTztnQkFDUCxJQUFJO2dCQUNKLE9BQU87Z0JBQ1AsUUFBUTtnQkFDUixNQUFNO2dCQUNOLFVBQVUsRUFBRSxJQUFJLElBQUksRUFBRTtnQkFDdEIsS0FBSyxFQUFFLElBQUk7YUFDWCxDQUFBO1lBR0QsSUFBSSxjQUFjLEdBQUcsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFB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