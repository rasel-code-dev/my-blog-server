import {Readable} from "stream";
import https from "https";

import axios from "axios"
import fs from "fs";
import errorConsole from "../logger/errorConsole";

const TOKEN = process.env.DROPBOX_TOKEN

export function getFileMeta(filePath: string){
 return new Promise(async (resolve, reject)=>{
   try{
  
     let r = await axios.post("https://api.dropboxapi.com/2/files/get_metadata", {
       path: "/" + filePath,
       "include_media_info": false,
       "include_deleted": false,
       "include_has_explicit_shared_members": false
     }, {
       headers: {
         'Authorization': `Bearer ${TOKEN}`,
       }
     })
     resolve(r.data)
  
   } catch (ex){
     reject(ex)
   }
   
 })
 
}

export function getFiles(dirPath){
 return new Promise<any[]>(async (resolve, reject)=>{
   try{
     let r : any = await axios.post("https://api.dropboxapi.com/2/files/list_folder", {
       path: dirPath,
       "recursive": false,
       "include_media_info": false,
       "include_deleted": false,
       "include_has_explicit_shared_members": false
     }, {
       headers: {
         'Authorization': `Bearer ${TOKEN}`,
       }
     })
     if(r.status === 200) {
       if(r.data){
         resolve(r.data.entries)
       } else {
         resolve(null)
       }
     } else {
       resolve(null)
     }
     
   } catch (ex){
     errorConsole(ex)
     reject(ex)
   }
   
 })
 
}



export function deleteFile(filePath){
 return new Promise(async (resolve, reject)=>{
   try{
     let r = await axios.post("https://api.dropboxapi.com/2/files/delete_v2", {
       path: "/" + filePath
     },{
       headers: {
         "Content-Type": "application/json",
         'Authorization': `Bearer ${TOKEN}`
       }
     })
     resolve(r.data.metadata)
   } catch (ex){
     errorConsole(ex)
     reject(ex)
   }
   
 })
 
}

export function uploadFile2(filePath: string, fileName: string){
 return new Promise(async (resolve, reject)=>{
   try{
     fs.readFile(filePath, 'utf8', function (err, data) {
       const reqq = https.request('https://content.dropboxapi.com/2/files/upload', {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${TOKEN}`,
           'Dropbox-API-Arg': JSON.stringify({
             'path': `/Apps/markdown-static/${fileName}`,
             'mode': 'overwrite',
             'autorename': true,
             'mute': false,
             'strict_conflict': false
           }),
           'Content-Type': 'application/octet-stream',
         }
       }, (response) => {
         console.log("statusCode: ", response.statusCode);
         console.log("headers: ", response.headers);
      
         response.on('data', function(d) {
           process.stdout.write(d);
           // res.send(d)
         });
       });
    
       reqq.write(data);
       reqq.end();
     });
  
   } catch (ex){
     reject(ex)
   }
   
 })
 
}

export function updateFile(fileContent: string, filePath: string){
 return new Promise(async (resolve, reject)=>{
   try{
     let mdFileContent = fileContent
  
       const Readable = require("stream").Readable;
       let stream = new Readable()
       stream.push(mdFileContent)
       stream.push(null)
       stream.on("data", (chunk)=>{
         const reqq = https.request('https://content.dropboxapi.com/2/files/upload', {
           method: 'POST',
           headers: {
             'Authorization': `Bearer ${TOKEN}`,
             'Dropbox-API-Arg': JSON.stringify({
               'path': '/' + filePath,
               'mode': 'overwrite', // force
               'autorename': true,
               'mute': false,
               'strict_conflict': false
             }),
             'Content-Type': 'application/octet-stream',
           }
         }, (response) => {
           if(response.statusCode === 200){
             response.on('data', function(d) {
               resolve(d.toString())
             });
             response.on("error", ()=>{
               reject(new Error("File upload fail"))
             })
           } else {
             reject(new Error("File upload fail"))
           }
         });
      
         reqq.write(chunk);
         reqq.end();
       })
   } catch (ex){
     reject(ex)
   }
   
 })
 
}

export function downloadFile(filePath: string){
 
 return new Promise(async (resolve, reject)=>{
   try{
     // get file content
     let r = await axios.get("https://content.dropboxapi.com/2/files/download", {
       headers:{
         "Authorization": `Bearer ${TOKEN}`,
         // "Authorization": "Bearer Al_mcvNg--wAAAAAAAAAAf6ashy8WmJ-pheH6SYQJxwSMT3Bu789WUQBGQe_46xE",

          "Dropbox-API-Arg": JSON.stringify({
            "path": "/" + filePath
          })
       }
     })
     resolve(r.data)
     
   } catch (ex){
     errorConsole(ex)
     reject(ex)
   }
   
 })
 
}
