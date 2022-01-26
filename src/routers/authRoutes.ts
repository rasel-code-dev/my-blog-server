

import * as controllers from "../controllers"
import getAuthID from "../middlewares/getAuthID";

export default (app)=>{
  app.post("/api/auth/login", controllers.default.authController.loginUser)
  
  app.get("/api/users/:id", controllers.default.authController.getUser)
  
  app.get("/api/auth/current-auth", controllers.default.authController.loginViaToken)
  app.post("/api/auth/users", controllers.default.authController.createNewUser)
  
  app.post("/api/add-cookie", controllers.default.authController.cookieAdd)

  
  app.post("/api/upload-profile-photo", getAuthID, controllers.default.authController.uploadProfilePhoto)
  app.post("/api/upload-profile-cover-photo", getAuthID, controllers.default.authController.uploadProfileCoverPhoto)
  
  app.post("/api/upload-markdown-image", getAuthID, controllers.default.authController.uploadMarkdownImage)
  
  app.post("/api/update-profile", getAuthID, controllers.default.authController.updateProfile)
  
  app.get("/api/get-auth-password", getAuthID, controllers.default.authController.getAuthPassword)
  
  app.post("/api/auth/send/mail", controllers.default.authController.sendPasswordResetMail)
  
  app.post("/api/auth/password-reset-session-check", controllers.default.authController.checkPasswordResetSessionTimeout)
  
  
  app.post("/api/auth/reset-password", controllers.default.authController.changePassword)


  
}