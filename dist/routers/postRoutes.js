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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdFJvdXRlcy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInJvdXRlcnMvcG9zdFJvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLHlFQUFnRDtBQUVoRCxpRUFBd0M7QUFHeEMsa0JBQWUsQ0FBQyxHQUFHLEVBQUMsRUFBRTtJQUVwQixHQUFHLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxxQkFBVyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUMxRCxHQUFHLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxxQkFBVyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUMxRCxHQUFHLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLHFCQUFXLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ2xFLEdBQUcsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsbUJBQVMsRUFBRSxxQkFBVyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUNuRixHQUFHLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLG1CQUFTLEVBQUUscUJBQVcsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDN0UsR0FBRyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxtQkFBUyxFQUFFLHFCQUFXLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0lBQ3JGLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUscUJBQVcsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDOUQsR0FBRyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsRUFBRSxxQkFBVyxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQTtJQUNoRixHQUFHLENBQUMsR0FBRyxDQUFDLDhCQUE4QixFQUFFLHFCQUFXLENBQUMsY0FBYyxDQUFDLHFCQUFxQixDQUFDLENBQUE7SUFFekYsR0FBRyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxtQkFBUyxFQUFFLHFCQUFXLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLENBQUE7SUFHcEYsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsbUJBQVMsRUFBRSxxQkFBVyxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxDQUFBO0lBR2hGLDBCQUEwQjtJQUMxQixHQUFHLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxtQkFBUyxFQUFFLHFCQUFXLENBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDbEYsQ0FBQyxDQUFBIn0=