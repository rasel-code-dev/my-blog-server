import response from "../response";
import fs, {createReadStream, WriteStream} from "fs";
import formidable from 'formidable';
import path from "path";
import {DBDirpath, MDDirpath} from "../utilities/MDPath";
import {cp, readdir, readFile, rm, stat, writeFile} from "fs/promises";
import replaceOriginalFilename from "../utilities/replaceOriginalFilename";
import errorConsole from "../logger/errorConsole";
import {deleteFile, getFiles} from "../dropbox";

export const makeDataBackup  = async (req, res)=>{
  function createBackup() {
    return new Promise(async (s, e)=> {
  
      var archiver = require('archiver');
  
      const archive = archiver('zip', {
        zlib: {level: 9} // Sets the compression level.
      });
      
// good practice to catch warnings (ie stat failures and other non-blocking errors)
      archive.on('warning', function (err) {
        if (err.code === 'ENOENT') {
          // log warning
        } else {
          errorConsole(err)
          // response(res, 500, err.message)
          res.end()
          // throw error
          throw err;
        }
      });

// good practice to catch this error explicitly
      archive.on('error', function (err) {
        errorConsole(err)
        res.end()
        // response(res, 500, err.message)
        // throw err;
      });
  
      // pipe archive data to the file
      archive.pipe(res);
  
      // append a file from stream
      try{
        let files = await readdir(path.resolve("src/markdown"))
        let dir = path.resolve("src/markdown")
        files.forEach((fileName, i) => {
          (async function () {
            try{
              let fileStats = await stat(path.join(dir, fileName))
              if (fileStats.isFile()) {
                let stream = createReadStream(path.join(dir, fileName))
                archive.append(stream, {name: fileName});
              }
              if ((i + 1) >= files.length) {
                archive.finalize();
              }
            } catch (ex){
              errorConsole(ex)
             // response(res, 500, ex.message)
              res.end()
              e(new Error(ex.message))
            }
          }())
        })
      } catch (ex){
        errorConsole(ex)
        res.end()
        // response(res, 500, ex.message)
        e(new Error(ex.message))
      }
      
      
    })
  }
  await createBackup()
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
  return new Promise<any[]>(async (resolve, reject)=>{
    try{
      let mdPath = "/Apps/markdown-static"
      let files = await getFiles(mdPath)
      if(files){
        let updatedFiles: any[] = files.map(file=>{
          return {
            dir: file['.tag'] !== "file",
            name: file.name,
            path: file.path_lower.slice(1),
            size: file.size,
            modifyTime: file.client_modified
          }
        })
        resolve(updatedFiles)
      }
      
    } catch(ex){
      resolve([])
    }
    
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
        let uploadedPath = path.resolve("src/markdown/" +  name)
        await cp(newPath, uploadedPath,{force: true})
  
        response(res, 201, {
          message: "Markdown File upload Success",
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

  let filePath = req.body.path
    
    try {
      let file = await deleteFile(filePath)
      if(file){
        return response(res, 201, "file deleted")
      } else {
        return response(res, 500, "file are not deleted")
      }
    } catch (ex){
      errorConsole(ex)
      response(res, 500, {
        message: "File upload fail" + ex.message
      })
    }
    
}
