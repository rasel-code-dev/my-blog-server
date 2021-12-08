"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
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
require("dotenv").config();
const index_1 = __importDefault(require("./routers/index"));
const app = (0, express_1.default)();
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
// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', "http://localhost:5500");
//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });
app.use(express_1.default.json());
app.use("/markdown/cover/", express_1.default.static("src/markdown/cover/"));
app.use("/markdown/images/", express_1.default.static("src/markdown/images/"));
app.use("/static/", express_1.default.static("src/static/"));
(0, index_1.default)(app);
const PORT = process.env.PORT || 3300;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL3NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHNEQUE4QjtBQUM5QixnREFBd0I7QUFDeEIsZ0RBQXVCO0FBR3ZCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxLQUFLLGFBQWEsQ0FBQTtBQUVqRCxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0FBQ3pDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEVBQUUsRUFBRTtJQUNyQixNQUFNLHFCQUFxQixHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNsRCxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsR0FBRyxjQUFjLEVBQUUsRUFBRTtRQUN2RCxNQUFNLHlCQUF5QixHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQztRQUMxRCxLQUFLLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDOUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEMsS0FBSyxDQUFDLGlCQUFpQixHQUFHLHlCQUF5QixDQUFDO1FBQ3BELGFBQWE7UUFDYixNQUFNLGdCQUFnQixHQUFHLGNBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBQzVFLGFBQWE7UUFDYixNQUFNLE1BQU0sR0FBRyxHQUFHLGdCQUFnQixJQUFJLE1BQU0sQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDO1FBQ2hFLElBQUksT0FBTyxhQUFhLEtBQUssUUFBUSxFQUFFO1lBQ25DLHFCQUFxQixDQUFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsYUFBYSxFQUFFLEdBQUcsY0FBYyxDQUFDLENBQUM7U0FDMUU7YUFBTTtZQUNILHFCQUFxQixDQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUUsR0FBRyxjQUFjLENBQUMsQ0FBQztTQUNuRTtJQUNMLENBQUMsQ0FBQztBQUNOLENBQUMsQ0FBQyxDQUFDO0FBSUgsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFBO0FBRTFCLDREQUFxQztBQUlyQyxNQUFNLEdBQUcsR0FBRyxJQUFBLGlCQUFPLEdBQUUsQ0FBQTtBQUNyQixNQUFNLFNBQVMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLGtDQUFrQyxDQUFDLENBQUE7QUFDL0UsTUFBTSxXQUFXLEdBQUc7SUFDaEIsV0FBVyxFQUFFLElBQUk7SUFDakIsTUFBTSxFQUFFLFVBQVUsTUFBTSxFQUFFLFFBQVE7UUFDOUIsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQ2xDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUE7U0FDdkI7YUFBTTtZQUNILHVCQUF1QjtZQUN2QixzQkFBc0I7WUFDdEIsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQTtZQUNyQiw2Q0FBNkM7U0FDaEQ7SUFDTCxDQUFDO0NBQ0osQ0FBQTtBQUVELEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBQSxjQUFJLEVBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQTtBQUUxQixxQ0FBcUM7QUFDckMsMEVBQTBFO0FBQzFFLDREQUE0RDtBQUM1RCxvR0FBb0c7QUFDcEcsY0FBYztBQUNkLE1BQU07QUFFTixHQUFHLENBQUMsR0FBRyxDQUFDLGlCQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTtBQUN2QixHQUFHLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUFFLGlCQUFPLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQTtBQUNsRSxHQUFHLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLGlCQUFPLENBQUMsTUFBTSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQTtBQUNwRSxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFBO0FBR2xELElBQUEsZUFBTSxFQUFDLEdBQUcsQ0FBQyxDQUFBO0FBRVgsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFBO0FBRXJDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLElBQUksRUFBRSxDQUFDLENBQUUsQ0FBQSJ9