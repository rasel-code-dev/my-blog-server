


function response(res: Response, status: number = 200, message?: string | object){
  let resp: any = {}
  if(typeof message === "string"){
    resp = { message: message }
  } else {
    resp = message
  }
  // @ts-ignore
  res.status(status).json(resp)
}


export default response