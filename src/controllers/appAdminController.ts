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
import {DBDirpath, MDDirpath} from "../utilities/MDPath";
import {cp, readdir, readFile, rm, stat, writeFile} from "fs/promises";
import replaceOriginalFilename from "../utilities/replaceOriginalFilename";
import {getDBFileList} from "./filesController";



export const getHomePage  = async (req, res)=>{
  res.render("pages/index", {message: ""})
}

export const adminLogin  = async (req, res)=>{
  if(req.body.secret){
    if (req.body.secret.trim() === process.env.ADMIN_SECRET){
      let files =  await getDBFileList()
      if(files) {
        res.render("pages/admin-homepage", {
          message: "Welcome Mr. Rasel Mahmud",
          database: files.databaseFiles,
          markdown: files.markdownFiles
        })
      }
    } else {
      res.render("pages/index", {message: "You are not Admin"})
    }
    
    
  } else {
    res.render("pages/index", {message: "You are not Admin"})
  }
}

export const uploadDatabaseFile  = async (req, res)=>{
  const form = formidable({multiples: true})
  form.parse(req, async (err, fields, files)=> {
  

    if (err) {
      
      // return response(res, 500, {
      //   message: "File upload fail. " + err.message
      // })
    }
    
    try {
      if(fields.dirType === "markdown"){
        let {newPath, name} = await replaceOriginalFilename(files, "markdown")
        let uploadedPath = MDDirpath()+"/"+name
        await cp(newPath, uploadedPath,{force: true})
        let dataFiles =  await getDBFileList()
        if(dataFiles) {
          res.render("pages/admin-homepage", {
            message: "Welcome Mr. Rasel Mahmud",
            database: dataFiles.databaseFiles,
            markdown: dataFiles.markdownFiles
          })
        }
        // response(res, 201, {
        //   message: "Markdown File upload Success",
        //   uploadedPath: uploadedPath
        // })
        
      } else if(fields.dirType === "database"){
        let {newPath, name} = await replaceOriginalFilename(files, "database")
        let uploadedPath = DBDirpath()+"/"+name
        await cp(newPath, uploadedPath, {force: true})
        let dataFiles =  await getDBFileList()
        if(dataFiles) {
          res.render("pages/admin-homepage", {
            message: "Welcome Mr. Rasel Mahmud",
            database: dataFiles.databaseFiles,
            markdown: dataFiles.markdownFiles
          })
        }
      }
      
      
    } catch (ex){
      // response(res, 500, {
      //   message: "File upload fail" + ex.message
      // })
    }
    
    
  })
  // res.render("pages/admin-homepage", {message: "You are not Admin", database: [], markdown: []})
}
