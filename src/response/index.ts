


function response(res, status: number = 200, message?: string | object){
  let resp: any = {}
  if(typeof message === "string"){
    resp = { message: message }
  } else {
    resp = message
  }
  res.status(status).json(resp)
}


export default response