
import getAuthID from "../middlewares/getAuthID"

import controllers from "../controllers"
import {createComment} from "../controllers/commentController";

export default (app)=>{

  app.get("/api/posts", controllers.postController.getPosts)
  app.get("/api/posts", controllers.postController.getPosts)
  app.get("/api/posts/:post_id", controllers.postController.getPost)
  app.post("/api/post/update-post", getAuthID, controllers.postController.updatePost)
  app.post("/api/post/add-post", getAuthID, controllers.postController.addPost)
  app.delete("/api/post/:post_id", getAuthID, controllers.postController.getDeletePost)
  app.get("/api/post/:slug", controllers.postController.getPost)
  app.get("/api/post-content/:post_id", controllers.postController.getPostContent)
  app.get("/api/raw-md-content/:post_id", controllers.postController.getRawMarkdownContent)
  
  app.post("/api/toggle-like", getAuthID, controllers.postController.handleToggleLike)
  
  
  app.post("/api/comment", getAuthID, controllers.commentController.createComment)
  
  
  // ?post_id=1&comment_id=1
  app.delete("/api/comment", getAuthID, controllers.commentController.deleteComment)
  }