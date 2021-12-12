import express  from "express"
import cors from "cors";
import path from "path"
import bodyParser from "body-parser"
// var session = require('express-session')
// let isDev = process.env.NodeENV === "development"

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


import routes  from "./routers/index"
import {uploadImage} from "./cloudinary";

require("dotenv").config()


const app = express()
app.set('trust proxy', 1)
app.enable('trust proxy')



const whitelist = ["http://localhost:5500", "http://localhost:5000", "https://rasel-code-dev.github.io"]
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


// app.use(session({
//     secret: "process.env.SECRET",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {  httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 * 48, sameSite: 'none' }
//   }))


// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', "http://localhost:5500");
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use("/markdown/cover/", express.static("src/markdown/cover/"))
app.use("/markdown/images/", express.static("src/markdown/images/"))
app.use("/static/", express.static("src/static/"))

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.resolve('src/views')) // custom views path

app.get("/pink", (req, res)=>res.send("pong"))

const PORT = process.env.PORT || 3300

routes(app)


app.listen(PORT, ()=> console.log(`server is running on port ${PORT}`) )

