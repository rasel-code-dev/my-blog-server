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
exports.downloadFile = exports.updateFile = exports.uploadFile2 = exports.deleteFile = exports.getFiles = exports.getFileMeta = void 0;
const https_1 = __importDefault(require("https"));
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const errorConsole_1 = __importDefault(require("../logger/errorConsole"));
const TOKEN = process.env.DROPBOX_TOKEN;
function getFileMeta(filePath) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            let r = yield axios_1.default.post("https://api.dropboxapi.com/2/files/get_metadata", {
                path: "/" + filePath,
                "include_media_info": false,
                "include_deleted": false,
                "include_has_explicit_shared_members": false
            }, {
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                }
            });
            resolve(r.data);
        }
        catch (ex) {
            reject(ex);
        }
    }));
}
exports.getFileMeta = getFileMeta;
function getFiles(dirPath) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            let r = yield axios_1.default.post("https://api.dropboxapi.com/2/files/list_folder", {
                path: dirPath,
                "recursive": false,
                "include_media_info": false,
                "include_deleted": false,
                "include_has_explicit_shared_members": false
            }, {
                headers: {
                    'Authorization': `Bearer ${TOKEN}`,
                }
            });
            if (r.status === 200) {
                if (r.data) {
                    resolve(r.data.entries);
                }
                else {
                    resolve(null);
                }
            }
            else {
                resolve(null);
            }
        }
        catch (ex) {
            (0, errorConsole_1.default)(ex);
            reject(ex);
        }
    }));
}
exports.getFiles = getFiles;
function deleteFile(filePath) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            let r = yield axios_1.default.post("https://api.dropboxapi.com/2/files/delete_v2", {
                path: "/" + filePath
            }, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${TOKEN}`
                }
            });
            resolve(r.data.metadata);
        }
        catch (ex) {
            (0, errorConsole_1.default)(ex);
            reject(ex);
        }
    }));
}
exports.deleteFile = deleteFile;
function uploadFile2(filePath, fileName) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            fs_1.default.readFile(filePath, 'utf8', function (err, data) {
                const reqq = https_1.default.request('https://content.dropboxapi.com/2/files/upload', {
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
                    response.on('data', function (d) {
                        process.stdout.write(d);
                        // res.send(d)
                    });
                });
                reqq.write(data);
                reqq.end();
            });
        }
        catch (ex) {
            reject(ex);
        }
    }));
}
exports.uploadFile2 = uploadFile2;
function updateFile(fileContent, filePath) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            let mdFileContent = fileContent;
            const Readable = require("stream").Readable;
            let stream = new Readable();
            stream.push(mdFileContent);
            stream.push(null);
            stream.on("data", (chunk) => {
                const reqq = https_1.default.request('https://content.dropboxapi.com/2/files/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${TOKEN}`,
                        'Dropbox-API-Arg': JSON.stringify({
                            'path': '/' + filePath,
                            'mode': 'overwrite',
                            'autorename': true,
                            'mute': false,
                            'strict_conflict': false
                        }),
                        'Content-Type': 'application/octet-stream',
                    }
                }, (response) => {
                    if (response.statusCode === 200) {
                        response.on('data', function (d) {
                            resolve(d.toString());
                        });
                        response.on("error", () => {
                            reject(new Error("File upload fail"));
                        });
                    }
                    else {
                        reject(new Error("File upload fail"));
                    }
                });
                reqq.write(chunk);
                reqq.end();
            });
        }
        catch (ex) {
            reject(ex);
        }
    }));
}
exports.updateFile = updateFile;
function downloadFile(filePath) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            // get file content
            let r = yield axios_1.default.get("https://content.dropboxapi.com/2/files/download", {
                headers: {
                    "Authorization": `Bearer ${TOKEN}`,
                    // "Authorization": "Bearer Al_mcvNg--wAAAAAAAAAAf6ashy8WmJ-pheH6SYQJxwSMT3Bu789WUQBGQe_46xE",
                    "Dropbox-API-Arg": JSON.stringify({
                        "path": "/" + filePath
                    })
                }
            });
            resolve(r.data);
        }
        catch (ex) {
            (0, errorConsole_1.default)(ex);
            reject(ex);
        }
    }));
}
exports.downloadFile = downloadFile;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJkcm9wYm94L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUNBLGtEQUEwQjtBQUUxQixrREFBeUI7QUFDekIsNENBQW9CO0FBQ3BCLDBFQUFrRDtBQUVsRCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQTtBQUV2QyxTQUFnQixXQUFXLENBQUMsUUFBZ0I7SUFDM0MsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFPLE9BQU8sRUFBRSxNQUFNLEVBQUMsRUFBRTtRQUMxQyxJQUFHO1lBRUQsSUFBSSxDQUFDLEdBQUcsTUFBTSxlQUFLLENBQUMsSUFBSSxDQUFDLGlEQUFpRCxFQUFFO2dCQUMxRSxJQUFJLEVBQUUsR0FBRyxHQUFHLFFBQVE7Z0JBQ3BCLG9CQUFvQixFQUFFLEtBQUs7Z0JBQzNCLGlCQUFpQixFQUFFLEtBQUs7Z0JBQ3hCLHFDQUFxQyxFQUFFLEtBQUs7YUFDN0MsRUFBRTtnQkFDRCxPQUFPLEVBQUU7b0JBQ1AsZUFBZSxFQUFFLFVBQVUsS0FBSyxFQUFFO2lCQUNuQzthQUNGLENBQUMsQ0FBQTtZQUNGLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUE7U0FFaEI7UUFBQyxPQUFPLEVBQUUsRUFBQztZQUNWLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQTtTQUNYO0lBRUgsQ0FBQyxDQUFBLENBQUMsQ0FBQTtBQUVILENBQUM7QUF0QkQsa0NBc0JDO0FBRUQsU0FBZ0IsUUFBUSxDQUFDLE9BQU87SUFDL0IsT0FBTyxJQUFJLE9BQU8sQ0FBUSxDQUFPLE9BQU8sRUFBRSxNQUFNLEVBQUMsRUFBRTtRQUNqRCxJQUFHO1lBQ0QsSUFBSSxDQUFDLEdBQVMsTUFBTSxlQUFLLENBQUMsSUFBSSxDQUFDLGdEQUFnRCxFQUFFO2dCQUMvRSxJQUFJLEVBQUUsT0FBTztnQkFDYixXQUFXLEVBQUUsS0FBSztnQkFDbEIsb0JBQW9CLEVBQUUsS0FBSztnQkFDM0IsaUJBQWlCLEVBQUUsS0FBSztnQkFDeEIscUNBQXFDLEVBQUUsS0FBSzthQUM3QyxFQUFFO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxlQUFlLEVBQUUsVUFBVSxLQUFLLEVBQUU7aUJBQ25DO2FBQ0YsQ0FBQyxDQUFBO1lBQ0YsSUFBRyxDQUFDLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTtnQkFDbkIsSUFBRyxDQUFDLENBQUMsSUFBSSxFQUFDO29CQUNSLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO2lCQUN4QjtxQkFBTTtvQkFDTCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7aUJBQ2Q7YUFDRjtpQkFBTTtnQkFDTCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7YUFDZDtTQUVGO1FBQUMsT0FBTyxFQUFFLEVBQUM7WUFDVixJQUFBLHNCQUFZLEVBQUMsRUFBRSxDQUFDLENBQUE7WUFDaEIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1NBQ1g7SUFFSCxDQUFDLENBQUEsQ0FBQyxDQUFBO0FBRUgsQ0FBQztBQS9CRCw0QkErQkM7QUFJRCxTQUFnQixVQUFVLENBQUMsUUFBUTtJQUNsQyxPQUFPLElBQUksT0FBTyxDQUFDLENBQU8sT0FBTyxFQUFFLE1BQU0sRUFBQyxFQUFFO1FBQzFDLElBQUc7WUFDRCxJQUFJLENBQUMsR0FBRyxNQUFNLGVBQUssQ0FBQyxJQUFJLENBQUMsOENBQThDLEVBQUU7Z0JBQ3ZFLElBQUksRUFBRSxHQUFHLEdBQUcsUUFBUTthQUNyQixFQUFDO2dCQUNBLE9BQU8sRUFBRTtvQkFDUCxjQUFjLEVBQUUsa0JBQWtCO29CQUNsQyxlQUFlLEVBQUUsVUFBVSxLQUFLLEVBQUU7aUJBQ25DO2FBQ0YsQ0FBQyxDQUFBO1lBQ0YsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7U0FDekI7UUFBQyxPQUFPLEVBQUUsRUFBQztZQUNWLElBQUEsc0JBQVksRUFBQyxFQUFFLENBQUMsQ0FBQTtZQUNoQixNQUFNLENBQUMsRUFBRSxDQUFDLENBQUE7U0FDWDtJQUVILENBQUMsQ0FBQSxDQUFDLENBQUE7QUFFSCxDQUFDO0FBbkJELGdDQW1CQztBQUVELFNBQWdCLFdBQVcsQ0FBQyxRQUFnQixFQUFFLFFBQWdCO0lBQzdELE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBTyxPQUFPLEVBQUUsTUFBTSxFQUFDLEVBQUU7UUFDMUMsSUFBRztZQUNELFlBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxVQUFVLEdBQUcsRUFBRSxJQUFJO2dCQUMvQyxNQUFNLElBQUksR0FBRyxlQUFLLENBQUMsT0FBTyxDQUFDLCtDQUErQyxFQUFFO29CQUMxRSxNQUFNLEVBQUUsTUFBTTtvQkFDZCxPQUFPLEVBQUU7d0JBQ1AsZUFBZSxFQUFFLFVBQVUsS0FBSyxFQUFFO3dCQUNsQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDOzRCQUNoQyxNQUFNLEVBQUUseUJBQXlCLFFBQVEsRUFBRTs0QkFDM0MsTUFBTSxFQUFFLFdBQVc7NEJBQ25CLFlBQVksRUFBRSxJQUFJOzRCQUNsQixNQUFNLEVBQUUsS0FBSzs0QkFDYixpQkFBaUIsRUFBRSxLQUFLO3lCQUN6QixDQUFDO3dCQUNGLGNBQWMsRUFBRSwwQkFBMEI7cUJBQzNDO2lCQUNGLEVBQUUsQ0FBQyxRQUFRLEVBQUUsRUFBRTtvQkFDZCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ2pELE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFFM0MsUUFBUSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBUyxDQUFDO3dCQUM1QixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDeEIsY0FBYztvQkFDaEIsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDakIsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2IsQ0FBQyxDQUFDLENBQUM7U0FFSjtRQUFDLE9BQU8sRUFBRSxFQUFDO1lBQ1YsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1NBQ1g7SUFFSCxDQUFDLENBQUEsQ0FBQyxDQUFBO0FBRUgsQ0FBQztBQXJDRCxrQ0FxQ0M7QUFFRCxTQUFnQixVQUFVLENBQUMsV0FBbUIsRUFBRSxRQUFnQjtJQUMvRCxPQUFPLElBQUksT0FBTyxDQUFDLENBQU8sT0FBTyxFQUFFLE1BQU0sRUFBQyxFQUFFO1FBQzFDLElBQUc7WUFDRCxJQUFJLGFBQWEsR0FBRyxXQUFXLENBQUE7WUFFN0IsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsQ0FBQztZQUM1QyxJQUFJLE1BQU0sR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFBO1lBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUE7WUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtZQUNqQixNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBQyxFQUFFO2dCQUN6QixNQUFNLElBQUksR0FBRyxlQUFLLENBQUMsT0FBTyxDQUFDLCtDQUErQyxFQUFFO29CQUMxRSxNQUFNLEVBQUUsTUFBTTtvQkFDZCxPQUFPLEVBQUU7d0JBQ1AsZUFBZSxFQUFFLFVBQVUsS0FBSyxFQUFFO3dCQUNsQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDOzRCQUNoQyxNQUFNLEVBQUUsR0FBRyxHQUFHLFFBQVE7NEJBQ3RCLE1BQU0sRUFBRSxXQUFXOzRCQUNuQixZQUFZLEVBQUUsSUFBSTs0QkFDbEIsTUFBTSxFQUFFLEtBQUs7NEJBQ2IsaUJBQWlCLEVBQUUsS0FBSzt5QkFDekIsQ0FBQzt3QkFDRixjQUFjLEVBQUUsMEJBQTBCO3FCQUMzQztpQkFDRixFQUFFLENBQUMsUUFBUSxFQUFFLEVBQUU7b0JBQ2QsSUFBRyxRQUFRLENBQUMsVUFBVSxLQUFLLEdBQUcsRUFBQzt3QkFDN0IsUUFBUSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsVUFBUyxDQUFDOzRCQUM1QixPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7d0JBQ3ZCLENBQUMsQ0FBQyxDQUFDO3dCQUNILFFBQVEsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUUsRUFBRTs0QkFDdkIsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQTt3QkFDdkMsQ0FBQyxDQUFDLENBQUE7cUJBQ0g7eUJBQU07d0JBQ0wsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQTtxQkFDdEM7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2IsQ0FBQyxDQUFDLENBQUE7U0FDTDtRQUFDLE9BQU8sRUFBRSxFQUFDO1lBQ1YsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1NBQ1g7SUFFSCxDQUFDLENBQUEsQ0FBQyxDQUFBO0FBRUgsQ0FBQztBQTdDRCxnQ0E2Q0M7QUFFRCxTQUFnQixZQUFZLENBQUMsUUFBZ0I7SUFFNUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFPLE9BQU8sRUFBRSxNQUFNLEVBQUMsRUFBRTtRQUMxQyxJQUFHO1lBQ0QsbUJBQW1CO1lBQ25CLElBQUksQ0FBQyxHQUFHLE1BQU0sZUFBSyxDQUFDLEdBQUcsQ0FBQyxpREFBaUQsRUFBRTtnQkFDekUsT0FBTyxFQUFDO29CQUNOLGVBQWUsRUFBRSxVQUFVLEtBQUssRUFBRTtvQkFDbEMsOEZBQThGO29CQUU3RixpQkFBaUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO3dCQUNoQyxNQUFNLEVBQUUsR0FBRyxHQUFHLFFBQVE7cUJBQ3ZCLENBQUM7aUJBQ0o7YUFDRixDQUFDLENBQUE7WUFDRixPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBO1NBRWhCO1FBQUMsT0FBTyxFQUFFLEVBQUM7WUFDVixJQUFBLHNCQUFZLEVBQUMsRUFBRSxDQUFDLENBQUE7WUFDaEIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1NBQ1g7SUFFSCxDQUFDLENBQUEsQ0FBQyxDQUFBO0FBRUgsQ0FBQztBQXhCRCxvQ0F3QkMifQ==