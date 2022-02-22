"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFilev = void 0;
const errorConsole_1 = __importDefault(require("../logger/errorConsole"));
// const TOKEN = process.env.DROPBOX_TOKEN
const { google } = require('googleapis');
const path = require('path');
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04cysL0V8a7kKCgYIARAAGAQSNwF-L9Irmsc2WZwuULHsp0CnUpDbapdryyz07J1mhyqRXn_x8-EYVpJFSpzQ-5RSxYR76IdXx-o';
const oauth2Client = new google.auth.OAuth2("702696747893-2t09l1ieh4nk65iq3b894cf0sierb3bl.apps.googleusercontent.com", "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", REDIRECT_URI);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
});
const filePath = path.join(__dirname, "..", 'a.jpg');
function uploadFilev(content) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield drive.files.create({
                requestBody: {
                    originalFilename: true,
                    parents: ["18KEvGRRf8Lp3W09CDHSGQOvjV_WLUoST"],
                    name: 'a.md',
                    mimeType: 'text/markdown',
                },
                media: {
                    mimeType: 'application/octet-stream',
                    body: content,
                    // body: fs.createReadStream(filePath),
                },
            });
            let fileID = response.data.id;
            let data = yield generatePublicUrl(fileID);
            resolve(data.webContentLink);
        }
        catch (error) {
            (0, errorConsole_1.default)(error);
            resolve("");
            // console.log(error.message);
        }
    }));
}
exports.uploadFilev = uploadFilev;
function generatePublicUrl(fileID) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield drive.permissions.create({
                fileId: fileID,
                requestBody: {
                    role: 'reader',
                    type: 'anyone',
                },
            });
            /*
            webViewLink: View the file in browser
            webContentLink: Direct download link
            */
            const result = yield drive.files.get({
                fileId: fileID,
                // fields: 'webViewLink, webContentLink',
                fields: 'webContentLink',
            });
            resolve(result.data);
        }
        catch (error) {
            reject(error);
        }
    }));
}
//
// export function getFileMeta(filePath: string){
//   return new Promise(async (resolve, reject)=>{
//     try{
//
//       let r = await axios.post("https://api.dropboxapi.com/2/files/get_metadata", {
//         path: "/" + filePath,
//         "include_media_info": false,
//         "include_deleted": false,
//         "include_has_explicit_shared_members": false
//       }, {
//         headers: {
//           'Authorization': `Bearer ${TOKEN}`,
//         }
//       })
//       resolve(r.data)
//
//     } catch (ex){
//       reject(ex)
//     }
//
//   })
//
// }
//
// export function getFiles(dirPath){
//   return new Promise<any[]>(async (resolve, reject)=>{
//     try{
//       let r : any = await axios.post("https://api.dropboxapi.com/2/files/list_folder", {
//         path: dirPath,
//         "recursive": false,
//         "include_media_info": false,
//         "include_deleted": false,
//         "include_has_explicit_shared_members": false
//       }, {
//         headers: {
//           'Authorization': `Bearer ${TOKEN}`,
//         }
//       })
//       if(r.status === 200) {
//         if(r.data){
//           resolve(r.data.entries)
//         } else {
//           resolve(null)
//         }
//       } else {
//         resolve(null)
//       }
//
//     } catch (ex){
//       errorConsole(ex)
//       reject(ex)
//     }
//
//   })
//
// }
//
// export function deleteFile(filePath){
//   return new Promise(async (resolve, reject)=>{
//     try{
//       let r = await axios.post("https://api.dropboxapi.com/2/files/delete_v2", {
//         path: "/" + filePath
//       },{
//         headers: {
//           "Content-Type": "application/json",
//           'Authorization': `Bearer ${TOKEN}`
//         }
//       })
//       resolve(r.data.metadata)
//     } catch (ex){
//       errorConsole(ex)
//       reject(ex)
//     }
//
//   })
//
// }
//
// export function uploadFile2(filePath: string, fileName: string){
//   return new Promise(async (resolve, reject)=>{
//     try{
//       fs.readFile(filePath, 'utf8', function (err, data) {
//         const reqq = https.request('https://content.dropboxapi.com/2/files/upload', {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${TOKEN}`,
//             'Dropbox-API-Arg': JSON.stringify({
//               'path': `/Apps/markdown-static/${fileName}`,
//               'mode': 'overwrite',
//               'autorename': true,
//               'mute': false,
//               'strict_conflict': false
//             }),
//             'Content-Type': 'application/octet-stream',
//           }
//         }, (response) => {
//           console.log("statusCode: ", response.statusCode);
//           console.log("headers: ", response.headers);
//
//           response.on('data', function(d) {
//             process.stdout.write(d);
//             // res.send(d)
//           });
//         });
//
//         reqq.write(data);
//         reqq.end();
//       });
//
//     } catch (ex){
//       reject(ex)
//     }
//
//   })
//
// }
//
// export function updateFile(fileContent: string, filePath: string){
//   return new Promise(async (resolve, reject)=>{
//     try{
//       let mdFileContent = fileContent
//
//       const Readable = require("stream").Readable;
//       let stream = new Readable()
//       stream.push(mdFileContent)
//       stream.push(null)
//       stream.on("data", (chunk)=>{
//         const reqq = https.request('https://content.dropboxapi.com/2/files/upload', {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${TOKEN}`,
//             'Dropbox-API-Arg': JSON.stringify({
//               'path': '/' + filePath,
//               'mode': 'overwrite', // force
//               'autorename': true,
//               'mute': false,
//               'strict_conflict': false
//             }),
//             'Content-Type': 'application/octet-stream',
//           }
//         }, (response) => {
//           if(response.statusCode === 200){
//             response.on('data', function(d) {
//               resolve(d.toString())
//             });
//             response.on("error", ()=>{
//               reject(new Error("File upload fail"))
//             })
//           } else {
//             reject(new Error("File upload fail"))
//           }
//         });
//
//         reqq.write(chunk);
//         reqq.end();
//       })
//     } catch (ex){
//       reject(ex)
//     }
//
//   })
//
// }
//
// export function downloadFile(filePath: string){
//
//   return new Promise(async (resolve, reject)=>{
//     try{
//       // get file content
//       let r = await axios.get("https://content.dropboxapi.com/2/files/download", {
//         headers:{
//           "Authorization": `Bearer ${TOKEN}`,
//           // "Authorization": "Bearer Al_mcvNg--wAAAAAAAAAAf6ashy8WmJ-pheH6SYQJxwSMT3Bu789WUQBGQe_46xE",
//
//           "Dropbox-API-Arg": JSON.stringify({
//             "path": "/" + filePath
//           })
//         }
//       })
//       resolve(r.data)
//
//     } catch (ex){
//       errorConsole(ex)
//       reject(ex)
//     }
//
//   })
//
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJkcml2ZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFLQSwwRUFBa0Q7QUFFbEQsMENBQTBDO0FBRzFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDekMsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRzdCLE1BQU0sWUFBWSxHQUFHLCtDQUErQyxDQUFDO0FBRXJFLE1BQU0sYUFBYSxHQUFHLHlHQUF5RyxDQUFDO0FBRWhJLE1BQU0sWUFBWSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQ3pDLDBFQUEwRSxFQUMxRSxxQ0FBcUMsRUFDckMsWUFBWSxDQUNiLENBQUM7QUFFRixZQUFZLENBQUMsY0FBYyxDQUFDLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUM7QUFFOUQsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUN6QixPQUFPLEVBQUUsSUFBSTtJQUNiLElBQUksRUFBRSxZQUFZO0NBQ25CLENBQUMsQ0FBQztBQUVILE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUVyRCxTQUFnQixXQUFXLENBQUMsT0FBZTtJQUN6QyxPQUFPLElBQUksT0FBTyxDQUFDLENBQU8sT0FBTyxFQUFFLE1BQU0sRUFBQyxFQUFFO1FBQzFDLElBQUk7WUFDRixNQUFNLFFBQVEsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO2dCQUN4QyxXQUFXLEVBQUU7b0JBQ1gsZ0JBQWdCLEVBQUUsSUFBSTtvQkFDdEIsT0FBTyxFQUFFLENBQUMsbUNBQW1DLENBQUM7b0JBQzlDLElBQUksRUFBRSxNQUFNO29CQUNaLFFBQVEs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