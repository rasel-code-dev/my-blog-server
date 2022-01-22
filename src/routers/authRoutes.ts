

import controllers from "../controllers"
import getAuthID from "../middlewares/getAuthID";

export default (app)=>{
  app.post("/api/auth/login", controllers.authController.loginUser)
  
  app.get("/api/users/:id", controllers.authController.getUser)
  
  app.get("/api/auth/current-auth", controllers.authController.loginViaToken)
  app.post("/api/auth/users", controllers.authController.createNewUser)
  
  app.post("/api/add-cookie", controllers.authController.cookieAdd)

  
  app.post("/api/upload-profile-photo", getAuthID, controllers.authController.uploadProfilePhoto)
  app.post("/api/upload-profile-cover-photo", getAuthID, controllers.authController.uploadProfileCoverPhoto)
  
  app.post("/api/upload-markdown-image", getAuthID, controllers.authController.uploadMarkdownImage)
  
  app.post("/api/update-profile", getAuthID, controllers.authController.updateProfile)
  
  app.get("/api/get-auth-password", getAuthID, controllers.authController.getAuthPassword)


  
}