import express  from "express"
import cors from "cors";
import path from "path"
import createZip from "./utilities/makeZip"

let isDev = process.env.NodeENV === "development"

let c = ['debug', 'log', 'warn', 'error']
c.forEach((methodName) => {
    const originalLoggingMethod = console[methodName];
    console[methodName] = (firstArgument, ...otherArguments) => {
        const originalPrepareStackTrace = Error.prepareStackTrace;
        Error.prepareStackTrace = (_, stack) => stack;
        const callee = new Error().stack[1];
        Error.prepareStackTrace = originalPrepareStackTrace;
        // @ts-ignore
        const relativeFileName = path.relative(process.cwd(), callee.getFileName());
        // @ts-ignore
        const prefix = `${relativeFileName}:${callee.getLineNumber()}:`;
        if (typeof firstArgument === 'string') {
            originalLoggingMethod(prefix + ' ' + firstArgument, ...otherArguments);
        } else {
            originalLoggingMethod(prefix, firstArgument, ...otherArguments);
        }
    };
});



require("dotenv").config()

import routes  from "./routers/index"
import * as fs from "fs";
import getAuthID from "./middlewares/getAuthID";

const app = express()
const whitelist = ["http://localhost:5500", "https://rasel-code-dev.github.io"]
const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            // callback(null, true)
            // console.log(origin)
            callback(null, false)
            // callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors(corsOptions))

// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', "http://localhost:5500");
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });

app.use(express.json())
app.use("/markdown/cover/", express.static("src/markdown/cover/"))
app.use("/markdown/images/", express.static("src/markdown/images/"))
app.use("/static/", express.static("src/static/"))

app.get("/api/backup", getAuthID, async (req, res)=>{
    let backupFiles = ["database", "markdown"]
    let ii = 0
    backupFiles.forEach((bkk, i)=>{
        ii = ii + 1
        createZip(`./src/${bkk}`, `src/backup/${bkk}.zip`)
          .then(r=>{
              if(backupFiles.length === ii) {
                  createZip(`src/backup`, `src/backup.zip`).then(rr=>{
                      const stream = fs.createReadStream(__dirname + '/backup.zip')
                      stream.pipe(res)
                  })
              }
              
          })
          
    })
    
})


routes(app)

const PORT = process.env.PORT || 3300

app.listen(PORT, ()=> console.log(`server is running on port ${PORT}`) )

