"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
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
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/markdown/cover/", express_1.default.static("markdown/cover/"));
app.use("/markdown/images/", express_1.default.static("markdown/images/"));
app.use("/static/", express_1.default.static("static/"));
(0, index_1.default)(app);
const PORT = process.env.PORT || 3300;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL3NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHNEQUE4QjtBQUM5QixnREFBd0I7QUFDeEIsZ0RBQXVCO0FBR3ZCLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUE7QUFDekMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFO0lBQ3JCLE1BQU0scUJBQXFCLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2xELE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxHQUFHLGNBQWMsRUFBRSxFQUFFO1FBQ3ZELE1BQU0seUJBQXlCLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDO1FBQzFELEtBQUssQ0FBQyxpQkFBaUIsR0FBRyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQztRQUM5QyxNQUFNLE1BQU0sR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQyxLQUFLLENBQUMsaUJBQWlCLEdBQUcseUJBQXlCLENBQUM7UUFDcEQsYUFBYTtRQUNiLE1BQU0sZ0JBQWdCLEdBQUcsY0FBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDNUUsYUFBYTtRQUNiLE1BQU0sTUFBTSxHQUFHLEdBQUcsZ0JBQWdCLElBQUksTUFBTSxDQUFDLGFBQWEsRUFBRSxHQUFHLENBQUM7UUFDaEUsSUFBSSxPQUFPLGFBQWEsS0FBSyxRQUFRLEVBQUU7WUFDbkMscUJBQXFCLENBQUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxhQUFhLEVBQUUsR0FBRyxjQUFjLENBQUMsQ0FBQztTQUMxRTthQUFNO1lBQ0gscUJBQXFCLENBQUMsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLGNBQWMsQ0FBQyxDQUFDO1NBQ25FO0lBQ0wsQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDLENBQUM7QUFJSCxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUE7QUFFMUIsNERBQXFDO0FBR3JDLE1BQU0sR0FBRyxHQUFHLElBQUEsaUJBQU8sR0FBRSxDQUFBO0FBRXJCLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBQSxjQUFJLEdBQUUsQ0FBQyxDQUFBO0FBQ2YsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7QUFDdkIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUE7QUFDOUQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxpQkFBTyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUE7QUFDaEUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsaUJBQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtBQUU5QyxJQUFBLGVBQU0sRUFBQyxHQUFHLENBQUMsQ0FBQTtBQUVYLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQTtBQUVyQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLDZCQUE2QixJQUFJLEVBQUUsQ0FBQyxDQUFFLENBQUEifQ==