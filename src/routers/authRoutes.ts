

import controllers from "../controllers"

export default (app)=>{
  app.post("/api/auth/login", controllers.authController.loginUser)
  app.get("/api/users", controllers.authController.getUser)
  app.get("/api/auth/current-auth", controllers.authController.loginViaToken)
  app.post("/api/auth/users", controllers.authController.createNewUser)
  
}