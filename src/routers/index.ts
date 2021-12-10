
import postRoutes from "./postRoutes"
import authRoutes from "./authRoutes";
import filesRoutes from "./filesRoutes";

function routes (app){
  postRoutes(app)
  authRoutes(app)
  filesRoutes(app)
}

export default routes