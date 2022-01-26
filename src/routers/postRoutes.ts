
import getAuthID from "../middlewares/getAuthID"
import * as controllers from "../controllers"


export default (app)=>{
  
  app.get("/api/test", controllers.default.postController.getP);
  app.get("/api/posts", controllers.default.postController.getPosts);
  
  app.get("/api/posts/:post_id", controllers.default.postController.getPost)
  app.post("/api/post/update-post", getAuthID, controllers.default.postController.updatePost)
  app.post("/api/post/add-post", getAuthID, controllers.default.postController.addPost)
  app.delete("/api/post/:post_id", getAuthID, controllers.default.postController.getDeletePost)
  app.get("/api/post/:slug", controllers.default.postController.getPost)
  app.get("/api/post-content/:post_id", controllers.default.postController.getPostContent)
  app.get("/api/raw-md-content/:post_id", controllers.default.postController.getRawMarkdownContent)

  app.post("/api/toggle-like", getAuthID, controllers.default.postController.handleToggleLike)


  app.post("/api/comment", getAuthID, controllers.default.commentController.createComment)


  // ?post_id=1&comment_id=1
  app.delete("/api/comment", getAuthID, controllers.default.commentController.deleteComment)
  
  
  }