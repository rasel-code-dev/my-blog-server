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
    app.get("/api/posts/hits", controllers.default.postController.getTopHitsPosts);
    app.get("/api/posts/:post_id", controllers.default.postController.getPost);
    app.post("/api/post/update-post", getAuthID_1.default, controllers.default.postController.updatePost);
    app.post("/api/post/add-post", getAuthID_1.default, controllers.default.postController.addPost);
    app.post("/api/posts/delete", getAuthID_1.default, controllers.default.postController.deletePost);
    app.get("/api/post/:slug", controllers.default.postController.getPost);
    app.post("/api/post-content", controllers.default.postController.getPostContent);
    // body => { path: string }
    app.post("/api/raw-md-content", controllers.default.postController.getRawMarkdownContent);
    app.post("/api/toggle-like", getAuthID_1.default, controllers.default.postController.handleToggleLike);
    app.post("/api/comment", getAuthID_1.default, controllers.default.commentController.createComment);
    // ?post_id=1&comment_id=1
    app.delete("/api/comment", getAuthID_1.default, controllers.default.commentController.deleteComment);
    app.post("/api/file-content", controllers.default.postController.getFileContent);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zdFJvdXRlcy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInJvdXRlcnMvcG9zdFJvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSx5RUFBZ0Q7QUFDaEQsNERBQTZDO0FBSTdDLGtCQUFlLENBQUMsR0FBRyxFQUFDLEVBQUU7SUFFcEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7SUFFbkUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUUvRSxHQUFHLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQzFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsbUJBQVMsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUMzRixHQUFHLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLG1CQUFTLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDckYsR0FBRyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxtQkFBUyxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQ3ZGLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUE7SUFHdEUsR0FBRyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQTtJQUVoRiwyQkFBMkI7SUFDM0IsR0FBRyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFBO0lBRXpGLEdBQUcsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsbUJBQVMsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0lBRzVGLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLG1CQUFTLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsQ0FBQTtJQUd4RiwwQkFBMEI7SUFDMUIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsbUJBQVMsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxDQUFBO0lBRTFGLEdBQUcsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsV0FBVyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUE7QUFFaEYsQ0FBQyxDQUFBIn0=