

import * as controllers from "../controllers"
import getAuthID from "../middlewares/getAuthID";
import {deletedFile} from "../controllers/filesController";


export default (app)=>{
  app.get("/api/files", getAuthID, controllers.default.filesController.getMarkDownFileList)
  app.get("/api/get-file-content", getAuthID, controllers.default.filesController.getFileContent)
  app.post("/api/save-file-content", getAuthID, controllers.default.filesController.saveFileContent)
  
  app.post("/api/file-upload", getAuthID, controllers.default.filesController.uploadFile)
  


  app.get("/api/backup", getAuthID, controllers.default.filesController.makeDataBackup)
  
  
  app.delete("/api/file-delete", getAuthID, controllers.default.filesController.deletedFile)
  
}