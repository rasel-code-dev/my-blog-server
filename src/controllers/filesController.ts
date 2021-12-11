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



export const makeDataBackup  = async (req, res)=>{
  createZip().then(r=>{
    const stream = fs.createReadStream( path.resolve('src/backup/files.zip'))
    stream.pipe(res)
  })
}


export const getFileContent = async (req, res)=>{
  let filePath = req.query.path
  try {
    if (filePath) {
      let a = await stat(filePath)
      if(a) {
        // const content = await readFile(filePath)
        let stream = fs.createReadStream(path.resolve(filePath))
        stream.pipe(res)
        stream.on("error", ()=>{
          response(res, 404, {
            message: "stream error on " + filePath
          })
        })
        
      } else {
        response(res, 404, {
          message: "file not found with path " + filePath
        })
      }
    } else {
      response(res, 404, {
        message: "file not found with path " + filePath
      })
    }
  } catch (ex){
    response(res, 404, {
      message: ex.message
    })
  }
  
  // for (const file of mdFiles) {
  //   let a = await stat(MDDirpath() + "/" +  file)
  //   mdFilesD.push({
  //     dir: a.isDirectory(),
  //     modifyTime: a.mtime,
  //     name: file,
  //     path: MDDirpath() + "/" +  file,
  //     size: a.size
  //   })
  // }
  //
  
  
}

export const saveFileContent = async (req, res)=>{
  try {
  
    let info = await stat(req.body.path)
    if (info) {
      await writeFile(req.body.path, JSON.stringify(req.body.data, undefined, 2))
      response(res, 201, {message: "this file are updated"})
    }
  } catch (ex){
    response(res, 500, ex.message)
  }
}

export const getDBFileList = async () =>{
  return new Promise<{markdownFiles?: any[], databaseFiles?: any[] }>(async (resolve, reject)=>{
    let mdFiles = await readdir(MDDirpath())
    let dbFiles = await readdir(DBDirpath())
  
    let mdFilesD = []
  
    for (const file of mdFiles) {
      let a = await stat(MDDirpath() + "/" +  file)
      mdFilesD.push({
        dir: a.isDirectory(),
        modifyTime: a.mtime,
        name: file,
        path: MDDirpath() + "/" +  file,
        size: a.size
      })
    }
  
    let dbFilesD = []
    for (const file of dbFiles) {
      let a = await stat(DBDirpath() + "/" +  file)
      dbFilesD.push({
        dir: a.isDirectory(),
        modifyTime: a.mtime,
        name: file,
        path: DBDirpath() + "/" +  file,
        size: a.size
      })
    }
    
    resolve({
      markdownFiles: mdFilesD ? mdFilesD : [],
      databaseFiles: dbFilesD ? dbFilesD: []
    })
    
  })
}

export const getMarkDownFileList = async (req, res)=>{
  let files =  await getDBFileList()
  if(files){
    response(res, 201, files)
  }
}


export const  uploadFile = async (req, res)=>{
  const form = formidable({multiples: true})
  form.parse(req, async (err, fields, files)=> {
  
    if (err) {
      return response(res, 500, {
        message: "File upload fail. " + err.message
      })
    }
  
    try {
      if(fields.dirType === "markdown"){
        let {newPath, name} = await replaceOriginalFilename(files, "markdown")
        let uploadedPath = MDDirpath()+"/"+name
        await cp(newPath, uploadedPath,{force: true})
  
        response(res, 201, {
          message: "Markdown File upload Success",
          uploadedPath: uploadedPath
        })
  
      } else if(fields.dirType === "database"){
        let {newPath, name} = await replaceOriginalFilename(files, "database")
        let uploadedPath = DBDirpath()+"/"+name
        await cp(newPath, uploadedPath, {force: true})
  
        response(res, 201, {
          message: "Database File upload Success",
          uploadedPath: uploadedPath
        })
      }
      
      
    } catch (ex){
      response(res, 500, {
        message: "File upload fail" + ex.message
      })
    }
    
  })
}



export const deletedFile = async (req, res)=>{

  let filePath = req.query.path
    
    try {
      await rm(path.resolve(filePath))
      response(res, 201, {
        message: "file deleted",
        deletedPath: filePath
      })
    } catch (ex){
      response(res, 500, {
        message: "File upload fail" + ex.message
      })
    }
    
}
