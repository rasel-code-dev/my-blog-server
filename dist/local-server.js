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
const chalk_1 = __importDefault(require("chalk"));
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
    log.call(console, ...args, chalk_1.default.grey(`${line.substring(line.lastIndexOf("/") + 1)}`));
}
console.info = proxiedLog;
console.log = proxiedLog;
const app = require("../functions/server");
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
app.get("/sync", (r, w) => __awaiter(void 0, void 0, void 0, function* () {
    // let rr = await redisSync("localToCloud")
    const { google } = require('googleapis');
    const path = require('path');
    const fs = require('fs');
    const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
    const REFRESH_TOKEN = '1//04cysL0V8a7kKCgYIARAAGAQSNwF-L9Irmsc2WZwuULHsp0CnUpDbapdryyz07J1mhyqRXn_x8-EYVpJFSpzQ-5RSxYR76IdXx-o';
    const oauth2Client = new google.auth.OAuth2("702696747893-2t09l1ieh4nk65iq3b894cf0sierb3bl.apps.googleusercontent.com", "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", REDIRECT_URI);
    oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    const drive = google.drive({
        version: 'v3',
        auth: oauth2Client,
    });
    const filePath = path.join(__dirname, 'a.jpg');
    function uploadFile() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield drive.files.create({
                    requestBody: {
                        originalFilename: true,
                        parents: ["18KEvGRRf8Lp3W09CDHSGQOvjV_WLUoST"],
                        name: 'a.jpg',
                        mimeType: 'image/jpg',
                    },
                    media: {
                        mimeType: 'image/jpg',
                        body: fs.createReadStream(filePath),
                    },
                });
                let fileID = response.data.id;
                let data = yield generatePublicUrl(fileID);
                console.log(data.webContentLink);
            }
            catch (error) {
                console.log(error.message);
            }
        });
    }
    uploadFile();
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
                console.log(result.data);
            }
            catch (error) {
                console.log(error.message);
            }
        }));
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
    function deleteFile() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield drive.files.delete({
                    fileId: 'YOUR FILE ID',
                });
                console.log(response.data, response.status);
            }
            catch (error) {
                console.log(error.message);
            }
        });
    }
    w.send("sync");
}));
const PORT = process.env.PORT || 3300;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWwtc2VydmVyLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsibG9jYWwtc2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQ0Esa0RBQTBCO0FBSzFCLG9DQUFvQztBQUNwQyxnREFBZ0Q7QUFDaEQsRUFBRTtBQUNGLHlDQUF5QztBQUN6Qyx1Q0FBdUM7QUFDdkMsWUFBWTtBQUNaLDJCQUEyQjtBQUMzQixvQkFBb0I7QUFDcEIsMkNBQTJDO0FBQzNDLDhCQUE4QjtBQUM5QixvREFBb0Q7QUFDcEQseURBQXlEO0FBQ3pELDJCQUEyQjtBQUMzQiwrREFBK0Q7QUFDL0Qsa0VBQWtFO0FBQ2xFLHdDQUF3QztBQUN4Qyx1QkFBdUI7QUFDdkIsZ0JBQWdCO0FBQ2hCLCtCQUErQjtBQUMvQixjQUFjO0FBQ2QsWUFBWTtBQUNaLFVBQVU7QUFDVixRQUFRO0FBQ1IsRUFBRTtBQUNGLDJFQUEyRTtBQUMzRSxPQUFPO0FBQ1AsTUFBTTtBQUVOLDBDQUEwQztBQUMxQyx3QkFBd0I7QUFDeEIsNkJBQTZCO0FBQzdCLFlBQVk7QUFDWix3QkFBd0I7QUFDeEIsb0JBQW9CO0FBQ3BCLDJCQUEyQjtBQUMzQixpQ0FBaUM7QUFDakMsb0JBQW9CO0FBQ3BCLDBCQUEwQjtBQUMxQixvQ0FBb0M7QUFDcEMsc0NBQXNDO0FBQ3RDLDJDQUEyQztBQUMzQyxZQUFZO0FBQ1osVUFBVTtBQUNWLFFBQVE7QUFDUixNQUFNO0FBQ04sTUFBTTtBQUVOLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxPQUFPLENBQUM7QUFDeEIsU0FBUyxVQUFVLENBQUMsR0FBRyxJQUFJO0lBQ3pCLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzlCLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDO1NBQzVCLEtBQUssQ0FBQyxh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