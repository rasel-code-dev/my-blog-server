import response from "../response";
import {createToken, parseToken} from "../jwt";
import errorConsole from "../logger/errorConsole";
const shortid = require("shortid")

import express, { Request, Response } from 'express';
import getAppCookies from "../utilities/getAppCookies";
import fs from "fs";
import formidable from 'formidable';
import {uploadImage} from "../cloudinary";

import replaceOriginalFilename from "../utilities/replaceOriginalFilename";
import {createHash, hashCompare} from "../hash";
import {getHashData} from "../utilities/redisUtils";
import {redisConnect} from "../database";
import sendMail from "../utilities/sendMail";


export const createNewUser = async (req, res, next)=>{
  let client;
  try {
    client = await redisConnect()
    let date = new Date()
    let {first_name, last_name, email, password } = req.body
    let users = await getHashData("users", client)
    let user = users.find(u=>u.email === email)
    if(user) return res.status(409).json({message: "User already registered"})

    const {err, hash} = await createHash(password)
    let newUser = {
      id: shortid.generate(),
      first_name,
      last_name,
      email,
      password: hash,
      avatar: "",
      username: first_name + " " + last_name,
      created_at: date,
      updated_at: date
    }
    let n = await client.HSET("users", newUser.id, JSON.stringify(newUser))
    if(n) {
      let token = await createToken(newUser.id, newUser.email)
  
      response(res, 201, {
        token: token,
        ...newUser
      })
    } else {
      response(res, 500, "Please Try Again")
    }
    
    
  } catch (ex){
    errorConsole(ex)
    response(res, 500, "Please Try Again")
    
  } finally {
    client?.quit()
  }
}

export const loginUser = async (req, res)=>{
  let client;
  try {
    let { email, password } = req.body
    if(!(email && password)) {
      return response(res, 409, "Missing credential")
    }
    let {token, user} = await loginUserHandler(email, password)
    response(res, 201, {token: token, ...user})
    
  } catch (ex){
    errorConsole(ex)
    response(res, 500, ex.message ? ex.message : "Internal Error")
  } finally {
    client?.quit()
  }
}

function loginUserHandler(email: string, password: string){
  return new Promise<{token: string, user: object}>(async (s, e)=>{
    let client;
    try {
      client = await redisConnect()
      let users = await getHashData("users", client)
      let user = users.find(u=>u.email === email )
      if(user){
        let match = await hashCompare(password, user.password)
        if(!match)  return e(new Error("Password not match"))
      
        let token = await createToken(user.id, user.email)
        let {password : sss, ...other} = user
        s({user: other, token})
      } else{
        e(new Error("login fail"))
      }
    
    } catch (ex){
      errorConsole(ex)
      e(ex)
    } finally {
      client?.quit()
    }
  })
}

export const loginViaToken = async (req, res)=>{
  let client;
  try {
    client = await redisConnect()
    let token = req.headers["token"]
    if(!token) return response(res, 404, "token not found")
    let { id, email } =  await parseToken(token)
    
    let users = await getHashData("users", client)
    let user = users.find(u=>u.email === email)
    if(user){
    let {password, ...other} = user
    response(res, 201, {...other})
  } else {
      response(res, 404, {message: "User not found"})
    }
  } catch (ex){
    errorConsole(ex)
    return response(res, 500, ex.message)
  } finally {
    client?.quit()
  }
}


export const getUser = async (req: Request, res: Response)=> {
  const {id} = req.params
  let client;
  try {
    client = await redisConnect()
    let userStr = await client.HGET("users", id)
    let user = JSON.parse(userStr)
    let {password, role, ...o} = user
    response(res, 200, {user: o})
    
  } catch (ex){
  
  } finally {
    client?.quit()
  }
}

async function setDayVisitor(client, ID){
  let now = new Date()
  
  return new Promise<number>(async (s, r)=>{
    try{
      let day_visitor = await client.GET("day_visitor")
  
      if(day_visitor) {
        let mv = {...JSON.parse(day_visitor)}
        // first check change date or not...
        let isChangeDay = now.getDate() > Number(mv.day)
    
        if(!isChangeDay) {
          ///
          if (mv.ids.indexOf(ID) === -1) {
            mv.ids.push(ID)
          }
        } else {
          /// reset new date
          mv = {
            day: now.getDate(),
            ids: [ ID ],
          }
        }
        let insert = await client.SET("day_visitor", JSON.stringify(mv))
        if(insert){
          s(mv.ids.length)
        }
      } else {
    
        await client.SET("day_visitor", JSON.stringify({
          day: now.getDate(),
          ids: [ ID ],
        }))
        s(1)
      }
    } catch (ex){
      r(0)
    }
  })
  
}

 export const cookieAdd = async (req: Request, res: Response)=> {
  
   let randomID = Math.ceil(Date.now() / 1000)
   let client;
   
   try {
     
     client = await redisConnect()
     
     
     
     let app_visitor_count = await client.sCard("app_visitor")
     let day_visitor_count = 0
     
     if (getAppCookies(req).browser_uuid) {
       // response(res, 200, {message: "cookie already exists"})
  
       day_visitor_count = await setDayVisitor(client, getAppCookies(req).browser_uuid)
       
       response(res, 201, {
         message: "cookie send",
         day_visitor: day_visitor_count,
         total_visitor: app_visitor_count,
       })
  
     } else {
       
       // increase total visitor....
       let isSet = await client.sAdd("app_visitor", randomID.toString())
       if (isSet){
         res.cookie('browser_uuid', randomID, {
           maxAge: ((1000 * 3600) * 24) * 30, // 30days
           httpOnly: true,
           // domain: 'rsl-blog-server-1.herokuapp.com',
           // domain: 'http://localhost:5500',
    
           sameSite: 'none',
           // Forces to use https in production
           secure: true
         });
  
         day_visitor_count = await setDayVisitor(client, randomID.toString())
  
         response(res, 201, {
           message: "cookie send",
           day_visitor: day_visitor_count,
           total_visitor: app_visitor_count + 1,
         })
       }
     }
  
  
  
  
     
  
  
  
   } catch (ex){
     console.log(ex)
     
   } finally {
      client?.quit()
   }
   
   
 }
 
 export const updateProfile = async (req, res)=>{
   let client;
  
   try {
  
     client = await redisConnect()
     let userStr = await client.HGET("users", req.user_id)
     let user = JSON.parse(userStr)
     if (user) {
       const {username, first_name, last_name, email, oldPassword, newPassword} = req.body

       let setUser: {
         password?: string, username?: string, first_name?: string, last_name?: string, email?: string
       } = {}


       if (oldPassword && newPassword) {
         let match = await hashCompare(oldPassword, user.password)
         if (!match) {
           return response(res, 409, {message: "current password doesn't match"})
         }

         let {err, hash} = await createHash(newPassword)
         setUser.password = hash
         if (err) {
           return response(res, 500, {message: err})
         }
       }

       if (username) {
         setUser.username = username
       }
       if (first_name) {
         setUser.first_name = first_name
       }
       if (last_name) {
         setUser.last_name = last_name
       }
       if (email) {
         setUser.email = email
       }

       let updatedUser = client.HSET("users", req.user_id, JSON.stringify({
         ...user,
         ...setUser
       }))
       
       if (updatedUser) {
         return response(res, 201, {
           user: {
             ...updatedUser,
             password: newPassword
           },
           message: "Operation completed"
         })
       }
     }
   } catch (ex){
   
   } finally {
     await client?.quit()
   }
 }
 
 export const uploadProfilePhoto = (req, res, next)=>{
  
   const form = formidable({multiples: true})
   form.parse(req, async (err, fields, files)=> {
    
     if (err) {
       console.log(err)
       return
     }
  
     let {newPath, name} = await replaceOriginalFilename(files, "avatar")
     let client;
     try{
       client = await redisConnect()
       let cloudImage = await uploadImage(newPath)
       if (cloudImage.secure_url) {
         let userStr = await  client.HGET("users", req.user_id)
         let user = JSON.parse(userStr)
         await client.HSET("users", user.id, JSON.stringify({...user, avatar: cloudImage.secure_url}))
         if (user) {
           fs.rm(newPath, () => {})
           response(res, 201,{message: "profile photo has been changed", avatar: cloudImage.secure_url})
         }
      
       } else {
         fs.rm(newPath, () => {})
         response(res, 500, "avatar photo upload fail")
       }
    
     } catch (ex){
       response(res, 500, "avatar photo upload fail")
    
     } finally {
       await client?.quit()
     }
   })
   
}


 export const uploadProfileCoverPhoto = (req, res, next)=>{
   const form = formidable({multiples: true})
   
   form.parse(req, async (err, fields, files)=> {
  
     if (err) {
       console.log(err)
       return
     }
  
     if(files && files.cover) {
  
       let tempDir = files.cover.filepath.replace(files.cover.newFilename, '')
       let newPath = tempDir + files.cover.originalFilename
       fs.rename(files.cover.filepath, newPath, async (err) => {
    
         if (!err) {
           let client;
         
           try {
             let cloudImage = await uploadImage(newPath)
             client = await redisConnect()
             
             if (cloudImage.secure_url) {
               let userStr = await  client.HGET("users", req.user_id)
               
               let user = JSON.parse(userStr)
               await client.HSET("users", user.id, JSON.stringify({...user, cover: cloudImage.secure_url}))

               if (user) {
                 fs.rm(newPath, () => {})
                 response(res, 201, {message: "cover photo has been changed", cover: cloudImage.secure_url})
               }

             } else {
               fs.rm(newPath, () => {})
               response(res,500, "cover photo upload fail")
  
             }
           
           } catch (err) {
             errorConsole(err)
             response(res,500, "cover  photo upload fail")
           } finally {
             await client?.quit()
           }
             
         }
       })
     }
   })
}

 export const uploadMarkdownImage = (req, res, next)=>{
   const form = formidable({multiples: false})
   
   form.parse(req, async (err, fields, files)=> {
  
     if (err) {
       console.log(err)
       return
     }
  
     if(files && files.photo) {
  
       let tempDir = files.photo.filepath.replace(files.photo.newFilename, '')
       let newPath = tempDir + files.photo.originalFilename
       fs.rename(files.photo.filepath, newPath, async (err) => {
         if (!err) {
           uploadImage(newPath).then(image => {
             if (image.secure_url) {
                fs.rm(newPath, () => {  })
                response(res, 201, {message: "markdown image upload complete", path: image.secure_url})
             } else {
               fs.rm(newPath, () => {  })
               response(res, 500,"markdown image upload fail")
             }
           })
             .catch(ex=>{
               response(res, 500,"markdown image upload fail")
             })
         }
       })
     }
   })
}

 export const getAuthPassword = async (req, res)=>{
  
  if(req.body.user_id !== req.query.user_id){
    return  response(res, 409, { message: "You are unauthorized" })
  }
  let client;
  try{
    client = await redisConnect()
    let userStr = client.HGET("users", req.body.user_id)
    let user = JSON.parse(userStr)
    
    // response(res, 201, other)
    response(res, 200, user.password)
    
  } catch (ex){
    errorConsole(ex)
    return response(res, 500, ex.message)
  } finally {
    client?.quit()
  }
}


export const sendPasswordResetMail = async (req, res)=>{
  let client;
  try{
    client = await redisConnect()
    // send a link and a secret code with expire date...
    let users = await getHashData("users", client)
    
    const { to } = req.body
    let findIndex = users.findIndex(u=>u.email === to)
    if(findIndex === -1){
      response(res, 404, "This email not registered yet")
      return
    }
    let token = createToken(users[findIndex].id, users[findIndex].email, '30min')
    let info: any = await sendMail({
      to: to,
      from: process.env.ADMIN_EMAIL,
      subject: "Change Password",
      html: `
        <div>
          <h1>Change Password Blogger application</h1>
            <a href="${process.env.FRONTEND}/auth/login/new-password/${token}">click to set new password</a>
          </div>
      `
    })

    if(info.messageId){
      response(res, 201, {message: "Email has been send"})
    } else {
      response(res, 500, "internal error")
    }
    
  } catch (ex){
    errorConsole(ex)
    if(ex.message === "jwt expired"){
      response(res, 409, "session timeout")
    } else {
      response(res, 500, "Network error")
    }
  } finally {
    await client?.quit()
  }
}


export const checkPasswordResetSessionTimeout = async (req, res)=> {
  let { token } = req.body
  
  try {
    let s = await parseToken(token)
    response(res, 200, "")
  } catch (ex){
    errorConsole(ex)
    if(ex.message === "jwt expired"){
      response(res, 500, "password reset session expired")
    }
  }
}



export const changePassword = async (req, res)=>{
  let client;
  try{
    const { token, password }  = req.body
    client = await redisConnect()
    // send a link and a secret code with expire date....
    // 1st check token validity.
    // 2. if token valid then reset password
    
    let { email, id } =  await parseToken(token)
    
    let userStr = await client.HGET("users", id)
    if(userStr){
      let user = JSON.parse(userStr)
      let {hash, err} = await createHash(password)
      if(!hash){
        errorConsole(err)
        response(res, 500, "Password reset fail. Try again")
      }
      user.password = hash
      let isPassChanged = await client.HSET("users", user.id, JSON.stringify(user))
      if(isPassChanged || isPassChanged === 0) {
        let {password, ...other} = user
        response(res, 201, {token: token, ...other})
      } else {
        response(res, 500, "Password reset fail. Try again")
      }

    } else {
      response(res, 500, "Account not found")
    }
    
    
  } catch (ex){
    errorConsole(ex)
    response(res, 500, ex.message ? ex.message : "Internal Error")
    
  } finally {
    client?.quit()
  }
}

