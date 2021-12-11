

import controllers from "../controllers"


export default (app)=>{
  app.get("/", controllers.appAdminController.getHomePage)
  app.post("/admin/login", controllers.appAdminController.adminLogin)
  app.post("/admin/upload/file", controllers.appAdminController.uploadDatabaseFile)
  // app.get("/api/auth/current-auth", controllers.authController.loginViaToken)

  
}