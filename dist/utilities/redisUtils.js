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
exports.redisHasToArr = exports.getHashData = exports.sync = void 0;
function sync(data, collectionName, key, client) {
    data.forEach((d) => __awaiter(this, void 0, void 0, function* () {
        let p = yield client.HSET(collectionName, d[key], JSON.stringify(d));
        console.log(p);
    }));
}
exports.sync = sync;
function getHashData(collectionName, client) {
    return new Promise((r, e) => __awaiter(this, void 0, void 0, function* () {
        try {
            let dataStr = yield client.HGETALL(collectionName);
            if (dataStr) {
                r(redisHasToArr(dataStr));
            }
            else {
                e([]);
            }
        }
        catch (ex) {
            e([]);
        }
    }));
}
exports.getHashData = getHashData;
function redisHasToArr(hashData) {
    let arr = [];
    if (hashData) {
        for (const hashDataKey in hashData) {
            let post = hashData[hashDataKey];
            arr.push(JSON.parse(post));
        }
    }
    return arr;
}
exports.redisHasToArr = redisHasToArr;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVkaXNVdGlscy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInV0aWxpdGllcy9yZWRpc1V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLFNBQWdCLElBQUksQ0FBQyxJQUFVLEVBQUUsY0FBc0IsRUFBRSxHQUFXLEVBQUUsTUFBVztJQUMvRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQU0sQ0FBQyxFQUFBLEVBQUU7UUFDcEIsSUFBSSxDQUFDLEdBQUcsTUFBTSxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3BFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDaEIsQ0FBQyxDQUFBLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFMRCxvQkFLQztBQUVELFNBQWdCLFdBQVcsQ0FBQyxjQUFzQixFQUFFLE1BQVc7SUFDN0QsT0FBTyxJQUFJLE9BQU8sQ0FBUSxDQUFPLENBQUMsRUFBRSxDQUFDLEVBQUMsRUFBRTtRQUN0QyxJQUFJO1lBQ0YsSUFBSSxPQUFPLEdBQUcsTUFBTSxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFBO1lBQ2xELElBQUcsT0FBTyxFQUFFO2dCQUNWLENBQUMsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTthQUMxQjtpQkFBTTtnQkFDTCxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUE7YUFDTjtTQUNGO1FBQUMsT0FBTyxFQUFFLEVBQUM7WUFDVixDQUFDLENBQUMsRUFBRSxDQUFDLENBQUE7U0FDTjtJQUNILENBQUMsQ0FBQSxDQUFDLENBQUE7QUFDSixDQUFDO0FBYkQsa0NBYUM7QUFFRCxTQUFnQixhQUFhLENBQUMsUUFBUTtJQUNwQyxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUE7SUFDWixJQUFHLFFBQVEsRUFBQztRQUNWLEtBQUssTUFBTSxXQUFXLElBQUksUUFBUSxFQUFFO1lBQ2xDLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUNoQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtTQUMzQjtLQUNGO0lBQ0QsT0FBTyxHQUFHLENBQUE7QUFDWixDQUFDO0FBVEQsc0NBU0MifQ==