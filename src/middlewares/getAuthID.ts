import { parseToken} from "../jwt/index";

 function getAuthID(req, res, next){
  let token = req.headers["token"]
  
  if(!token){
    req.user_id = null
    return next()
  }
  
  parseToken(token).then(u=>{
    req.user_id = u.id
    req.user_email = u.email
    next()
  }).catch(err=>{
    req.user_id = null
    next()
  })
}


export default getAuthID