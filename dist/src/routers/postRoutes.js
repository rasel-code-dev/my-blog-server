"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getAuthID_1 = __importDefault(require("../middlewares/getAuthID"));
const controllers_1 = __importDefault(require("../controllers"));
exports.default = (app) => {
    app.get("/api/posts", controllers_1.default.postController.getPosts);
    app.get("/api/posts", controllers_1.default.postController.getPosts);
    app.get("/api/posts/:post_id", controllers_1.default.postController.getPost);
    app.post("/api/post/update-post", getAuthID_1.default, controllers_1.default.postController.updatePost);
    app.post("/api/post/add-post", getAuthID_1.default, controllers_1.default.postController.addPost);
    app.delete("/api/post/:post_id", getAuthID_1.default, controllers_1.default.postController.getDeletePost);
    app.get("/api/post/:slug", controllers_1.default.postController.getPost);
    app.get("/api/post-content/:post_id", controllers_1.default.postController.getPostContent);
    app.get("/api/raw-md-content/:post_id", controllers_1.default.postController.getRawMarkdownContent);
    app.post("/api/toggle-like", getAuthID_1.default, controllers_1.default.postController.handleToggleLike);
    app.post("/api/comment", getAuthID_1.default, controllers_1.default.commentController.createComment);
    // ?post_id=1&comment_id=1
    app.delete("/api/comment", getAuthID_1.default, controllers_1.default.commentController.deleteComment);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdFJvdXRlcy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy9yb3V0ZXJzL3Bvc3RSb3V0ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSx5RUFBZ0Q7QUFFaEQsaUVBQXdDO0FBR3hDLGtCQUFlLENBQUMsR0FBRyxFQUFDLEVBQUU7SUFFcEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUscUJBQVcsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDMUQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUscUJBQVcsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDMUQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxxQkFBVyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUNsRSxHQUFHLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLG1CQUFTLEVBQUUscUJBQVcsQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDbkYsR0FBRyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxtQkFBUyxFQUFFLHFCQUFXLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQzdFLEdBQUcsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsbUJBQVMsRUFBRSxxQkFBVyxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUNyRixHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLHFCQUFXLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQzlELEdBQUcsQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEVBQUUscUJBQVcsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUE7SUFDaEYsR0FBRyxDQUFDLEdBQUcsQ0FBQyw4QkFBOEIsRUFBRSxxQkFBVyxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0lBRXpGLEdBQUcsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsbUJBQVMsRUFBRSxxQkFBVyxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0lBR3BGLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLG1CQUFTLEVBQUUscUJBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUdoRiwwQkFBMEI7SUFDMUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsbUJBQVMsRUFBRSxxQkFBVyxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBR3BGLENBQUMsQ0FBQSJ9