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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWVudENvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvY29udHJvbGxlcnMvY29tbWVudENvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkRBQW1DO0FBQ25DLDBFQUFrRDtBQUNsRCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUE7QUFHbEMsd0RBQWdDO0FBR3pCLE1BQU0sYUFBYSxHQUFHLENBQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUMsRUFBRTtJQUVwRCxJQUFHLEdBQUcsQ0FBQyxPQUFPLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUM7UUFDbkMsT0FBTyxJQUFBLGtCQUFRLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUMsQ0FBQyxDQUFBO0tBQ3BEO0lBRUQsSUFBSTtRQUVILElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQTtRQUUzRCxJQUFHLE9BQU8sSUFBSSxJQUFJLElBQUksT0FBTyxJQUFJLFFBQVEsSUFBSSxNQUFNLEVBQUU7WUFFcEQsNEZBQTRGO1lBQzVGLElBQUksVUFBVSxHQUFHO2dCQUNoQixFQUFFLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRTtnQkFDdEIsT0FBTztnQkFDUCxJQUFJO2dCQUNKLE9BQU87Z0JBQ1AsUUFBUTtnQkFDUixNQUFNO2dCQUNOLFVBQVUsRUFBRSxJQUFJLElBQUksRUFBRTtnQkFDdEIsS0FBSyxFQUFFLElBQUk7YUFDWCxDQUFBO1lBRUQsSUFBSSxDQUFDLEdBQUcsWUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUE7WUFDbkQsSUFBRyxDQUFDLEVBQUM7Z0JBQ0osSUFBQSxrQkFBUSxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBQyxVQUFVLEVBQUMsQ0FBQyxDQUFBO2FBQ2hDO2lCQUFNO2dCQUNOLE9BQU8sSUFBQSxrQkFBUSxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUseUJBQXlCLEVBQUMsQ0FBQyxDQUFBO2FBQy9EO1NBRUQ7YUFBTTtZQUNOLE9BQU8sSUFBQSxrQkFBUSxFQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUseUJBQXlCLEVBQUMsQ0FBQyxDQUFBO1NBQy9EO0tBR0Q7SUFBQyxPQUFPLEVBQUUsRUFBQztRQUNYLElBQUEsc0JBQVksRUFBQyxFQUFFLENBQUMsQ0FBQTtRQUNoQixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLE9BQU8sRUFBRSx1QkFBdUIsRUFBQyxDQUFDLENBQUE7S0FDeEQ7QUFDRixDQUFDLENBQUEsQ0FBQTtBQXhDWSxRQUFBLGFBQWEsaUJBd0N6QjtBQUdNLE1BQU0sYUFBYSxHQUFHLENBQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUMsRUFBRTtJQUVwRCxJQUFJLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFBO0lBRWhELElBQUcsR0FBRyxDQUFDLE9BQU8sS0FBSyxPQUFPLEVBQUM7UUFDMUIsT0FBTyxJQUFBLGtCQUFRLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUMsQ0FBQyxDQUFBO0tBQ3BEO0lBRUQsSUFBSTtRQUVILElBQUcsVUFBVSxJQUFJLE9BQU8sSUFBSSxPQUFPLEVBQUU7WUFFcEMsSUFBSSxDQUFDLEdBQUcsWUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBQyxFQUFFLEVBQUUsVUFBVSxFQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtZQUMzRCxJQUFHLENBQUMsRUFBQztnQkFDSixJQUFBLGtCQUFRLEVBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFDLEVBQUUsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFDLENBQUMsQ0FBQTthQUNoRTtpQkFBTTtnQkFDTixPQUFPLElBQUEsa0JBQVEsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLHFCQUFxQixFQUFDLENBQUMsQ0FBQTthQUMzRDtTQUVEO2FBQU07WUFDTixPQUFPLElBQUEsa0JBQVEsRUFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLHFCQUFxQixFQUFDLENBQUMsQ0FBQTtTQUMzRDtLQUdEO0lBQUMsT0FBTyxFQUFFLEVBQUM7UUFDWCxJQUFBLHNCQUFZLEVBQUMsRUFBRSxDQUFDLENBQUE7UUFDaEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUMsQ0FBQyxDQUFBO0tBQ3hEO0FBQ0YsQ0FBQyxDQUFBLENBQUE7QUE1QlksUUFBQSxhQUFhLGlCQTRCekIifQ==