
import postRoutes from "./postRoutes"
import authRoutes from "./authRoutes";

function routes (app){
  postRoutes(app)
  authRoutes(app)
}

export default routes