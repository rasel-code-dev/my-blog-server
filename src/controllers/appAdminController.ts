import formidable from 'formidable';
import {DBDirpath, MDDirpath} from "../utilities/MDPath";
import {cp } from "fs/promises";
import replaceOriginalFilename from "../utilities/replaceOriginalFilename";
import {getDBFileList} from "./filesController";
import path from "path";
import response from "../response";



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
      let files =  await getDBFileList()
      if(files) {
        res.render("pages/admin-homepage", {
          message: "Welcome Mr. Rasel Mahmud",
          markdown: files.markdownFiles
        })
      }
    }
    
    try {
      if(fields.dirType === "markdown"){
       
        let {newPath, name} = await replaceOriginalFilename(files, "markdown")
      
        let dir = path.resolve("src/markdown")
        let uploadedPath = path.join(dir + "/" + name)
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
        
      }
      
    } catch (ex){
      
      console.log(ex)
      
      let files =  await getDBFileList()
      if(files) {
        res.render("pages/admin-homepage", {
          message: "Welcome Mr. Rasel Mahmud",
          markdown: files.markdownFiles
        })
      }
      // response(res, 500, {
      //   message: "File upload fail" + ex.message
      // })
    }
    
    
  })
  // res.render("pages/admin-homepage", {message: "You are not Admin", database: [], markdown: []})
}
