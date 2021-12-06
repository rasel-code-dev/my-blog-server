import response from "../response";
import {createToken, parseToken} from "../jwt";
import errorConsole from "../logger/errorConsole";
const shortid = require("shortid")
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const db = low(new FileSync('./src/database/db.json'))
const bcryptjs  = require("bcryptjs")
import express, { Request, Response } from 'express';

export const createNewUser = async (req, res, next)=>{
  try {
    let date = new Date()
    let {first_name, last_name, email, password } = req.body
    let user = db.get('users').find({ email: email }).value()
    if(user) return res.send("user already registered")
    
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
    if(ex.type === "VALIDATION_ERROR"){
      response(res, 422, ex.errors)
    } else if(ex.type === "ER_DUP_ENTRY"){
      response(res, 409, "user already exists")
    } else {
      next(ex)
    }
  }
}

export const loginUser = async (req, res)=>{
  try {
    const { email, password } = req.body
    let user = db.get('users').find({ email: email }).value()
    console.log(user)
    if(user){
      let match = await bcryptjs.compare(password, user.password)
      if(!match)  return res.json({message: "Password not match"})
      
      let token = await createToken(user.id, user.email)
      let {password : s, ...other} = user
      res.json({token: token, ...other})
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
