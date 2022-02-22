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
exports.mongoConnect = exports.redisConnect = void 0;
const errorConsole_1 = __importDefault(require("../logger/errorConsole"));
const { createClient } = require('redis');
const mongodb_1 = require("mongodb");
function redisConnect() {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        let client;
        if (process.env.NODE_ENV === "development") {
            client = yield createClient();
        }
        else {
            client = yield createClient({
                url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT}:${process.env.REDIS_PORT}`
            });
        }
        yield client.on('error', (err) => console.log('---------Redis Client Error-----------', err));
        console.log("redis connected...");
        yield client.connect();
        resolve(client);
    }));
}
exports.redisConnect = redisConnect;
function mongoConnect(collectionName) {
    const uri = "mongodb+srv://rasel:EducationRY5@cluster0.4ywhd.mongodb.net/dev-story?retryWrites=true&w=majority";
    const client = new mongodb_1.MongoClient(uri, {
        // @ts-ignore
        useNewUrlParser: true, useUnifiedTopology: true,
        // serverApi: ServerApiVersion.v1
    });
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect the client to the server
            yield client.connect();
            let db = yield client.db("dev-story");
            // perform actions on the collection object
            console.log("Connected successfully to server");
            if (collectionName) {
                let c = yield db.collection(collectionName);
                resolve({ c: c, client, db: db });
            }
            else {
                resolve({ db: db, client });
            }
        }
        catch (ex) {
            (0, errorConsole_1.default)(ex);
            reject(ex);
        }
        finally {
            // await client.close();
        }
        // if(collectionName){
        //   let c = await db.collection(collectionName)
        //   resolve({c: c, client})
        // } else {
        //   resolve({db: db, client})
        // }
        // client.close();
    }));
}
exports.mongoConnect = mongoConnect;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJkYXRhYmFzZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwRUFBa0Q7QUFFbEQsTUFBTSxFQUFFLFlBQVksRUFBRSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMxQyxxQ0FBd0U7QUFFeEUsU0FBZ0IsWUFBWTtJQUMxQixPQUFPLElBQUksT0FBTyxDQUFFLENBQU8sT0FBTyxFQUFFLE1BQU0sRUFBQyxFQUFFO1FBRTNDLElBQUksTUFBTSxDQUFDO1FBRVgsSUFBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxhQUFhLEVBQUM7WUFDeEMsTUFBTSxHQUFHLE1BQU0sWUFBWSxFQUFFLENBQUM7U0FDL0I7YUFBTTtZQUNMLE1BQU0sR0FBRyxNQUFNLFlBQVksQ0FBRTtnQkFDM0IsR0FBRyxFQUFFLFlBQVksT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUU7YUFDdEcsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxNQUFNLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDOUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO1FBQ2pDLE1BQU0sTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3ZCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUVqQixDQUFDLENBQUEsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQW5CRCxvQ0FtQkM7QUFFRCxTQUFnQixZQUFZLENBQUMsY0FBdUI7SUFFbEQsTUFBTSxHQUFHLEdBQUcsbUdBQW1HLENBQUM7SUFFaEgsTUFBTSxNQUFNLEdBQUcsSUFBSSxxQkFBVyxDQUFDLEdBQUcsRUFBRTtRQUNsQyxhQUFhO1FBQ2IsZUFBZSxFQUFFLElBQUksRUFBRSxrQkFBa0IsRUFBRSxJQUFJO1FBQy9DLGlDQUFpQztLQUNsQyxDQUFDLENBQUM7SUFDSCxPQUFPLElBQUksT0FBTyxDQUFnRCxDQUFPLE9BQU8sRUFBRSxNQUFNLEVBQUMsRUFBRTtRQUV2RixJQUFJO1lBQ0YsbUNBQW1DO1lBQ25DLE1BQU0sTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRXZCLElBQUksRUFBRSxHQUFHLE1BQU0sTUFBTSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUNyQywyQ0FBMkM7WUFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1lBRWhELElBQUcsY0FBYyxFQUFDO2dCQUNkLElBQUksQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQTtnQkFDM0MsT0FBTyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUE7YUFDaEM7aUJBQU07Z0JBQ0wsT0FBTyxDQUFDLEVBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFBO2FBQzFCO1NBQ0o7UUFBQyxPQUFPLEVBQUUsRUFBQztZQUNWLElBQUEsc0JBQVksRUFBQyxFQUFFLENBQUMsQ0FBQTtZQUNoQixNQUFNLENBQUMsRUFBRSxDQUFDLENBQUE7U0FDWDtnQkFBUztZQUNSLHdCQUF3QjtTQUN6QjtRQUVILHNCQUFzQjtRQUN0QixnREFBZ0Q7UUFDaEQsNEJBQTRCO1FBQzVCLFdBQVc7UUFDWCw4QkFBOEI7UUFDOUIsSUFBSTtRQUVGLGtCQUFrQjtJQUN0QixDQUFDLENBQUEsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQXpDRCxvQ0F5Q0MifQ==