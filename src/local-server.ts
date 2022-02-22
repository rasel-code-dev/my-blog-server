import {redisSync} from "./database/cloudSync";
import chalk from 'chalk';
// Import the functions you need from the SDKs you need

import {func} from "joi";
import path from "path";
// ['log'].forEach((methodName) => {
//   const originalMethod = console[methodName];
//
//   console[methodName] = (...args) => {
//     let initiator = 'unknown place';
//     try {
//       throw new Error();
//     } catch (e) {
//       if (typeof e.stack === 'string') {
//         let isFirst = true;
//         for (const line of e.stack.split('\n')) {
//           const matches = line.match(/^\s+at\s+(.*)/);
//           if (matches) {
//             if (!isFirst) { // first line - current function
//               // second line - caller (what we are looking for)
//               initiator = matches[1];
//               break;
//             }
//             isFirst = false;
//           }
//         }
//       }
//     }
//
//     originalMethod.apply(console, [...args, ` ${initiator.slice(21)}`]);
//   };
// });

// ['log', 'warn', 'error'].forEach(a => {
//   let b = console[a];
//   console[a] = (...c) => {
//     try {
//       throw new Error
//     } catch (d) {
//       b.apply(console, [
//         d.stack.split('\n')[2]
//           .trim()
//           .substring(3)
//           .replace(__dirname, '')
//           .replace(/\s\(./, ' at ')
//           .replace(/\)/, ''), '\n', ...c
//         ]
//       )
//     }
//   }
// });

const { log } = console;
function proxiedLog(...args) {
  const line = (((new Error('log'))
    .stack.split('\n')[2] || '…')
    .match(/\(([^)]+)\)/) || [, 'not found'])[1];
  log.call(console, ...args, chalk.grey(`${line.substring(line.lastIndexOf("/") + 1)}`));
}
console.info = proxiedLog;
console.log = proxiedLog;

const app = require("../functions/server")
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis')

app.get("/sync", async (r, w) => {
  // let rr = await redisSync("localToCloud")
  
  const { google } = require('googleapis');
  const path = require('path');
  const fs = require('fs');

  const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
  
  const REFRESH_TOKEN = '1//04cysL0V8a7kKCgYIARAAGAQSNwF-L9Irmsc2WZwuULHsp0CnUpDbapdryyz07J1mhyqRXn_x8-EYVpJFSpzQ-5RSxYR76IdXx-o';
  
  const oauth2Client = new google.auth.OAuth2(
    "702696747893-2t09l1ieh4nk65iq3b894cf0sierb3bl.apps.googleusercontent.com",
    "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",
    REDIRECT_URI
  );
  
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  
  const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
  });
  
  const filePath = path.join(__dirname, 'a.jpg');
  
  async function uploadFile() {
    try {
      const response = await drive.files.create({
        requestBody: {
          originalFilename: true,
          parents: ["18KEvGRRf8Lp3W09CDHSGQOvjV_WLUoST"],
          name: 'a.jpg', //This can be name of your choice
          mimeType: 'image/jpg',
        },
        media: {
          mimeType: 'image/jpg',
          body: fs.createReadStream(filePath),
        },
      });
      
      let fileID = response.data.id
      let data: any = await generatePublicUrl(fileID)
      console.log(data.webContentLink)
      
    } catch (error) {
      console.log(error.message);
    }
  }

  
uploadFile();
  
  function generatePublicUrl(fileID: string) {
    return new Promise(async (resolve, reject)=>{
      try {
        await drive.permissions.create({
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
        const result = await drive.files.get({
          fileId: fileID,
          // fields: 'webViewLink, webContentLink',
          fields: 'webContentLink',
        });
        console.log(result.data);
      } catch (error) {
        console.log(error.message);
      }
    })
  }
  
// generatePublicUrl()
  
  
  // const credentials = require("./my-project-mmm-342113-4c4842c0f9b2.json")
  // const {google} = require('googleapis');
  // const oauth2Client = new google.auth.OAuth2(
  //   "100945523688325854855",
  //   "4c4842c0f9b271abce0afa2ab53d66fafd22b327",
  //   // YOUR_REDIRECT_URL
  // );
  // const scopes = [
  //   'https://www.googleapis.com/auth/drive'
  // ];
  // const auth = new google.auth.JWT(
  //   credentials.client_email,
  //   credentials.private_key_id,
  //   credentials.private_key,
  //   scopes
  // );
  // const drive = google.drive({ version: "v3", auth });
  // // const res = await drive.files.create({
  // //   requestBody: {
  // //     name: 'Test',
  // //     mimeType: 'text/plain'
  // //   },
  // //   media: {
  // //     mimeType: 'text/plain',
  // //     body: 'Hello World'
  // //   }
  // // });
  // var fileMetadata = {
  //   'name': 'ImageTest.jpeg'
  // };
  // var media = {
  //   mimeType: 'application/json',
  //   //PATH OF THE FILE FROM YOUR COMPUTER
  //   body: fs.createReadStream(path.resolve("src/my-project-mmm-342113-4c4842c0f9b2.json"))
  // };
  //
  // drive.files.create({
  //   resource: fileMetadata,
  //   media: media,
  //   fields: '*'
  // }, function (err, file) {
  //   if (err) {
  //     // Handle error
  //     console.error(err);
  //   } else {
  //     console.log('File Id: ', file);
  //   }
  // })
    
  // async function createAndUpload() {
  //   const driveService  = google.drive({ version: 'v3', auth })
  //   let metaDate = {
  //     name: 'a.jpg',
  //     parents: ["1sTWaJ_j7PkjzaBWtNc3IzovK5hQf21FbOw9yLeeLPNQ"]
  //   }
  // }
  
  async function deleteFile() {
    try {
      const response = await drive.files.delete({
        fileId: 'YOUR FILE ID',
      });
      console.log(response.data, response.status);
    } catch (error) {
      console.log(error.message);
    }
  }
  
  
  w.send("sync")
})


const PORT = process.env.PORT || 3300
app.listen(PORT, () => console.log(`server is running on port ${PORT}`))
