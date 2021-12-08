

import controllers from "../controllers"
import getAuthID from "../middlewares/getAuthID";

export default (app)=>{
  app.post("/api/auth/login", controllers.authController.loginUser)
  app.get("/api/users", controllers.authController.getUser)
  app.get("/api/auth/current-auth", controllers.authController.loginViaToken)
  app.post("/api/auth/users", controllers.authController.createNewUser)
  
  app.post("/api/add-cookie", controllers.authController.cookieAdd)
  
  app.get("/api/backup", getAuthID, controllers.authController.makeDataBackup)
  
}