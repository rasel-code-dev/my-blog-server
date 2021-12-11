"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
var session = require('express-session');
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
app.set('trust proxy', 1);
app.enable('trust proxy');
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
app.use(session({
    secret: "process.env.SECRET",
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 * 48, sameSite: 'none' }
}));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL3NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHNEQUE4QjtBQUM5QixnREFBd0I7QUFDeEIsZ0RBQXVCO0FBQ3ZCLDhEQUFvQztBQUNwQyxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQTtBQUN4QyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sS0FBSyxhQUFhLENBQUE7QUFFakQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUN6QyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7SUFDckIsTUFBTSxxQkFBcUIsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbEQsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEdBQUcsY0FBYyxFQUFFLEVBQUU7UUFDdkQsTUFBTSx5QkFBeUIsR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUM7UUFDMUQsS0FBSyxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQzlDLE1BQU0sTUFBTSxHQUFHLElBQUksS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLEtBQUssQ0FBQyxpQkFBaUIsR0FBRyx5QkFBeUIsQ0FBQztRQUNwRCxhQUFhO1FBQ2IsTUFBTSxnQkFBZ0IsR0FBRyxjQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztRQUM1RSxhQUFhO1FBQ2IsTUFBTSxNQUFNLEdBQUcsR0FBRyxnQkFBZ0IsSUFBSSxNQUFNLENBQUMsYUFBYSxFQUFF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