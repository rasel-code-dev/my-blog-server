

import * as controllers from "../controllers"


export default (app)=>{
  app.get("/", controllers.default.appAdminController.getHomePage)
  app.post("/admin/login", controllers.default.appAdminController.adminLogin)
  app.post("/admin/upload/file", controllers.default.appAdminController.uploadDatabaseFile)
  // app.get("/api/auth/current-auth", controllers.authController.loginViaToken)

  
}