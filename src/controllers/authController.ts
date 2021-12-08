import response from "../response";
import {createToken, parseToken} from "../jwt";
import errorConsole from "../logger/errorConsole";
const shortid = require("shortid")
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const db = low(new FileSync('./src/database/db.json'))
const bcryptjs  = require("bcryptjs")
import express, { Request, Response } from 'express';
import visitorDB from "../database/visitorDB";
import getAppCookies from "../utilities/getAppCookies";
import createZip from "../utilities/makeZip";
import fs from "fs";

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
    if(!token) return response(res, null, "token not found")
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
   let backupFiles = ["database", "markdown"]
   let ii = 0
   backupFiles.forEach((bkk, i)=>{
     ii = ii + 1
     createZip(`./src/${bkk}`, `src/backup/${bkk}.zip`)
       .then(r=>{
         if(backupFiles.length === ii) {
           createZip(`src/backup`, `src/backup.zip`).then(rr=>{
             const stream = fs.createReadStream(__dirname + '/backup.zip')
             stream.pipe(res)
           })
         }
        
       })
    
   })
 }