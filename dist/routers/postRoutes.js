"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getAuthID_1 = __importDefault(require("../middlewares/getAuthID"));
const controllers = __importStar(require("../controllers"));
exports.default = (app) => {
    app.get("/api/test", controllers.default.postController.getP);
    app.get("/api/posts", controllers.default.postController.getPosts);
    app.get("/api/posts/:post_id", controllers.default.postController.getPost);
    app.post("/api/post/update-post", getAuthID_1.default, controllers.default.postController.updatePost);
    app.post("/api/post/add-post", getAuthID_1.default, controllers.default.postController.addPost);
    app.delete("/api/post/:post_id", getAuthID_1.default, controllers.default.postController.getDeletePost);
    app.get("/api/post/:slug", controllers.default.postController.getPost);
    app.get("/api/post-content/:post_id", controllers.default.postController.getPostContent);
    app.get("/api/raw-md-content/:post_id", controllers.default.postController.getRawMarkdownContent);
    app.post("/api/toggle-like", getAuthID_1.default, controllers.default.postController.handleToggleLike);
    app.post("/api/comment", getAuthID_1.default, controllers.default.commentController.createComment);
    // ?post_id=1&comment_id=1
    app.delete("/api/comment", getAuthID_1.default, controllers.default.commentController.deleteComment);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdFJvdXRlcy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInJvdXRlcnMvcG9zdFJvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSx5RUFBZ0Q7QUFDaEQsNERBQTZDO0FBRzdDLGtCQUFlLENBQUMsR0FBRyxFQUFDLEVBQUU7SUFFcEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFbkUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUMxRSxHQUFHLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLG1CQUFTLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDM0YsR0FBRyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxtQkFBUyxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ3JGLEdBQUcsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsbUJBQVMsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUM3RixHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ3RFLEdBQUcsQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUE7SUFDeEYsR0FBRyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0lBRWpHLEdBQUcsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsbUJBQVMsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0lBRzVGLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLG1CQUFTLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUd4RiwwQkFBMEI7SUFDMUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsbUJBQVMsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBRzFGLENBQUMsQ0FBQSJ9