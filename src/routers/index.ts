
import postRoutes from "./postRoutes"
import authRoutes from "./authRoutes";
import filesRoutes from "./filesRoutes";
import appAdminRoutes from "./appAdminRoutes";

function routes (app){
  postRoutes(app)
  authRoutes(app)
  filesRoutes(app)
  appAdminRoutes(app)
}

export default routes
module.exports = routes