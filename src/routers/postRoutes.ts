
import getAuthID from "../middlewares/getAuthID"
import * as controllers from "../controllers"
import {deletePost, getTopHitsPosts} from "../controllers/postController";


export default (app)=>{
  
  app.get("/api/test", controllers.default.postController.getP);
  app.get("/api/posts", controllers.default.postController.getPosts);
  
  app.get("/api/posts/hits", controllers.default.postController.getTopHitsPosts);
  
  app.get("/api/posts/:post_id", controllers.default.postController.getPost)
  app.post("/api/post/update-post", getAuthID, controllers.default.postController.updatePost)
  app.post("/api/post/add-post", getAuthID, controllers.default.postController.addPost)
  app.post("/api/posts/delete", getAuthID, controllers.default.postController.deletePost)
  app.get("/api/post/:slug", controllers.default.postController.getPost)
  
  
  app.post("/api/post-content", controllers.default.postController.getPostContent)
  
  // body => { path: string }
  app.post("/api/raw-md-content", controllers.default.postController.getRawMarkdownContent)

  app.post("/api/toggle-like", getAuthID, controllers.default.postController.handleToggleLike)


  app.post("/api/comment", getAuthID, controllers.default.commentController.createComment)


  // ?post_id=1&comment_id=1
  app.delete("/api/comment", getAuthID, controllers.default.commentController.deleteComment)
  
  app.post("/api/file-content", controllers.default.postController.getFileContent)
  
  }