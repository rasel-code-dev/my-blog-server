import express  from "express"
import cors from "cors";
import path from "path"


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


const app = express()

app.use(cors())
app.use(express.json())
app.use("/markdown/cover/", express.static("src/markdown/cover/"))
app.use("/markdown/images/", express.static("src/markdown/images/"))
app.use("/static/", express.static("src/static/"))

routes(app)

const PORT = process.env.PORT || 3300

app.listen(PORT, ()=> console.log(`server is running on port ${PORT}`) )

