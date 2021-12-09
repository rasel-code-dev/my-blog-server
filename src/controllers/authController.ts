import response from "../response";
import {createToken, parseToken} from "../jwt";
import errorConsole from "../logger/errorConsole";
const shortid = require("shortid")
const bcryptjs  = require("bcryptjs")
import express, { Request, Response } from 'express';
import visitorDB from "../database/visitorDB";
import getAppCookies from "../utilities/getAppCookies";
import createZip from "../utilities/makeZip";
import fs from "fs";
import formidable from 'formidable';
import {uploadImage} from "../cloudinary";

import db from "../database/db";
import path from "path";


export const createNewUser = async (req, res, next)=>{
  try {
    let date = new Date()
    let {first_name, last_name, email, password } = req.body
    let user = db.get('users').find({ email: email }).value()
    if(user) return res.status(409).json({message: "User already registered"})
    
    let salt = await bcryptjs.genSalt(10);
    let hashedPass = await bcryptjs.hash(password, salt)
    let newUser = {
      id: shortid.generate(),
      first_name,
      last_name,
      email,
      password: hashedPass,
      avatar: "",
      username: first_name + " " + last_name,
      created_at: date,
      updated_at: date
    }
    db.get('users').push(newUser).write()
    

    let token = await createToken(newUser.id, newUser.email)
    res.status(201).json({
      token: token,
      ...newUser
    })
    
  } catch (ex){
    errorConsole(ex)
    res.status(500).json({message: "Internal server error"})
  }
}

export const loginUser = async (req, res)=>{
  try {
    const { email, password } = req.body
    let user = db.get('users').find({ email: email }).value()
   
    if(user){
      let match = await bcryptjs.compare(password, user.password)
      if(!match)  return  res.status(404).json({message: "Password not match"})
      
      let token = await createToken(user.id, user.email)
      let {password : s, ...other} = user
      res.json({token: token, ...other})
    } else{
      res.status(404).json({message: "This email not yet register."})
    }
    
  } catch (ex){
    errorConsole(ex)
  }
}


export const loginViaToken = async (req, res)=>{
  try {
    let token = req.headers["token"]
    if(!token) return response(res, 404, "token not found")
    let { id, email } =  await parseToken(token)
    let user = db.get('users').find({ email: email }).value()
    let {password, ...other} = user
    response(res, 201, other)
  } catch (ex){
    errorConsole(ex)
    return response(res, 500, ex.message)
  }
}


export const getUser = (req: Request, res: Response)=>{
  const { username }  = req.query
  
  let user = db.get('users').find({ username: username }).value()
  let {password, role, ...o} = user
  response(res, 200, {user: o})
 }


 export const cookieAdd = (req: Request, res: Response)=> {
  
   let randomID = Math.ceil(Date.now() / 1000)
   let total_visitor = visitorDB.get("app_visitor").find({ total_visitor: ''}).value()
   
   
   if(getAppCookies(req).browser_uuid) {
     // response(res, 200, {message: "cookie already exists"})
  
   } else{
     res.cookie('browser_uuid', randomID, {
         maxAge: ((1000 * 3600) * 24) * 30, // 30days
         // You can't access these tokens in the client's javascript
         httpOnly: false,
         // Forces to use https in production
         secure: process.env.NODE_ENV !== 'development'
       });
     
     // increase total visitor....
     
     if(total_visitor){
       total_visitor.ids.push(randomID)
     } else {
       total_visitor = {total_visitor: "", ids : [randomID]}
     }
     visitorDB.get("app_visitor").assign({ total_visitor: total_visitor}).write()
   }
   
   let day_visitor = visitorDB.get("app_visitor").find({ day_visitor: ''}).value()
   if(day_visitor){
     day_visitor.ids.push(randomID)
   } else {
     day_visitor = {day_visitor: "", ids: [randomID]}
   }
   
   visitorDB.get("app_visitor").assign({ day_visitor: day_visitor}).write()
   
  
   response(res, 201, {
     message: "cookie send",
     day_visitor: day_visitor,
     total_visitor: total_visitor,
   })
 }
 
 
 export const makeDataBackup  = async (req, res)=>{
   createZip().then(r=>{
     const stream = fs.createReadStream( path.resolve('src/backup/files.zip'))
      stream.pipe(res)
   })
 }
 
 export const uploadProfilePhoto = (req, res, next)=>{
  
   const form = formidable({multiples: true})
   form.parse(req, async (err, fields, files)=> {
    
     if (err) {
       console.log(err)
       return
     }
     
      if(files && files.avatar) {
        
        let tempDir = files.avatar.filepath.replace(files.avatar.newFilename, '')
        let newPath = tempDir + files.avatar.originalFilename
        fs.rename(files.avatar.filepath, newPath, async (err) => {
      
          if (!err) {
            uploadImage(newPath).then(image => {
              if (image.secure_url) {
                let r = db.get("users").find({id: req.user_id}).assign({avatar: image.secure_url}).write()
                if (r) {
                  fs.rm(newPath, () => {
                  })
                  res.json({message: "profile photo has been changed", avatar: image.secure_url})
                }
            
              } else {
                fs.rm(newPath, () => {
                })
                res.json({message: "avatar photo upload fail", avatar: ""})
              }
            })
          }
        })
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
           uploadImage(newPath).then(image => {
             if (image.secure_url) {
               let r = db.get("users").find({id: req.user_id}).assign({cover: image.secure_url}).write()
               if (r) {
                 fs.rm(newPath, () => {
                 })
                 res.json({message: "cover photo has been changed", cover: image.secure_url})
               }
          
             } else {
               fs.rm(newPath, () => {
               })
               res.json({message: "cover photo upload fail", avatar: ""})
             }
           })
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
                res.json({message: "markdown image upload complete", path: image.secure_url})
             } else {
               fs.rm(newPath, () => {  })
               res.json({message: "markdown image upload fail", path: ""})
             }
           })
             .catch(ex=>{
               res.status(500).json({message: "markdown image upload fail", path: ""})
             })
         }
       })
     }
   })
}
