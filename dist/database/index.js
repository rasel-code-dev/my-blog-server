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
        const client = yield createClient();
        //     const client = createClient( process.env.NODE_ENV !== "development" ? {
        //   url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT}:${process.env.REDIS_PORT}`
        // }: {});
        //
        yield client.on('error', (err) => console.log('---------Redis Client Error-----------', err));
        console.log("redis connected...");
        yield client.connect();
        resolve(client);
    }));
}
exports.redisConnect = redisConnect;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJkYXRhYmFzZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxNQUFNLEVBQUUsWUFBWSxFQUFFLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBRzFDLFNBQWdCLFlBQVk7SUFDMUIsT0FBTyxJQUFJLE9BQU8sQ0FBRSxDQUFPLE9BQU8sRUFBRSxNQUFNLEVBQUMsRUFBRTtRQUUzQyxNQUFNLE1BQU0sR0FBRyxNQUFNLFlBQVksRUFBRSxDQUFDO1FBRXBDLDhFQUE4RTtRQUM5RSwwR0FBMEc7UUFDMUcsVUFBVTtRQUNWLEVBQUU7UUFDRixNQUFNLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDOUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO1FBQ2pDLE1BQU0sTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3ZCLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUVqQixDQUFDLENBQUEsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQWZELG9DQWVDIn0=