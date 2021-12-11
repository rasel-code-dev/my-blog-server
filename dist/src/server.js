"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
// var session = require('express-session')
let isDev = process.env.NodeENV === "development";
let c = ['debug', 'log', 'warn', 'error'];
c.forEach((methodName) => {
    const originalLoggingMethod = console[methodName];
    console[methodName] = (firstArgument, ...otherArguments) => {
        const originalPrepareStackTrace = Error.prepareStackTrace;
        Error.prepareStackTrace = (_, stack) => stack;
        const callee = new Error().stack[1];
        Error.prepareStackTrace = originalPrepareStackTrace;
        // @ts-ignore
        const relativeFileName = path_1.default.relative(process.cwd(), callee.getFileName());
        // @ts-ignore
        const prefix = `${relativeFileName}:${callee.getLineNumber()}:`;
        if (typeof firstArgument === 'string') {
            originalLoggingMethod(prefix + ' ' + firstArgument, ...otherArguments);
        }
        else {
            originalLoggingMethod(prefix, firstArgument, ...otherArguments);
        }
    };
});
const index_1 = __importDefault(require("./routers/index"));
require("dotenv").config();
const app = (0, express_1.default)();
// app.set('trust proxy', 1)
// app.enable('trust proxy')
const whitelist = ["http://localhost:5500", "https://rasel-code-dev.github.io"];
const corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            // callback(null, true)
            // console.log(origin)
            callback(null, false);
            // callback(new Error('Not allowed by CORS'))
        }
    }
};
app.use((0, cors_1.default)(corsOptions));
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
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use("/markdown/cover/", express_1.default.static("src/markdown/cover/"));
app.use("/markdown/images/", express_1.default.static("src/markdown/images/"));
app.use("/static/", express_1.default.static("src/static/"));
// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path_1.default.resolve('src/views')); // custom views path
app.get("/pink", (req, res) => res.send("pong"));
const PORT = process.env.PORT || 3300;
(0, index_1.default)(app);
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL3NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHNEQUE4QjtBQUM5QixnREFBd0I7QUFDeEIsZ0RBQXVCO0FBQ3ZCLDhEQUFvQztBQUNwQywyQ0FBMkM7QUFDM0MsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEtBQUssYUFBYSxDQUFBO0FBRWpELElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDekMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFO0lBQ3JCLE1BQU0scUJBQXFCLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2xELE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxHQUFHLGNBQWMsRUFBRSxFQUFFO1FBQ3ZELE1BQU0seUJBQXlCLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDO1FBQzFELEtBQUssQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUM5QyxNQUFNLE1BQU0sR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxLQUFLLENBQUMsaUJBQWlCLEdBQUcseUJBQXlCLENBQUM7UUFDcEQsYUFBYTtRQUNiLE1BQU0sZ0JBQWdCLEdBQUcsY0FBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDNUUsYUFBYTtRQUNiLE1BQU0sTUFBTSxHQUFHLEdBQUcsZ0JBQWdCLElBQUksTUFBTSxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUM7UUFDaEUsSUFBSSxPQUFPLGFBQWEsS0FB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