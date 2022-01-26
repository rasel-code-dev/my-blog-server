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
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnect = void 0;
const { createClient } = require('redis');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJkYXRhYmFzZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxNQUFNLEVBQUUsWUFBWSxFQUFFLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRzFDLFNBQWdCLFlBQVk7SUFDMUIsT0FBTyxJQUFJLE9BQU8sQ0FBRSxDQUFPLE9BQU8sRUFBRSxNQUFNLEVBQUMsRUFBRTtRQUUzQyxJQUFJLE1BQU0sQ0FBQztRQUVYLElBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssYUFBYSxFQUFDO1lBQ3hDLE1BQU0sR0FBRyxNQUFNLFlBQVksRUFBRSxDQUFDO1NBQy9CO2FBQU07WUFDTCxNQUFNLEdBQUcsTUFBTSxZQUFZLENBQUU7Z0JBQzNCLEdBQUcsRUFBRSxZQUFZLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFO2FBQ3RHLENBQUMsQ0FBQztTQUNKO1FBRUQsTUFBTSxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzlGLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtRQUNqQyxNQUFNLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN2QixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7SUFFakIsQ0FBQyxDQUFBLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFuQkQsb0NBbUJDIn0=