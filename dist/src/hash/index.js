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
exports.hashCompare = exports.createHash = void 0;
const bcryptjs = require("bcryptjs");
const createHash = (password) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let salt = yield bcryptjs.genSalt(10);
            let hashedPass = yield bcryptjs.hash(password, salt);
            resolve({ err: null, hash: hashedPass });
        }
        catch (ex) {
            resolve({ err: ex.message, hash: "" });
        }
    }));
};
exports.createHash = createHash;
const hashCompare = (password, hashPassword) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let m = yield bcryptjs.compare(password, hashPassword);
            resolve(m);
        }
        catch (ex) {
            resolve(null);
        }
    }));
};
exports.hashCompare = hashCompare;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvaGFzaC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxNQUFNLFFBQVEsR0FBSSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7QUFFOUIsTUFBTSxVQUFVLEdBQUcsQ0FBQyxRQUFRLEVBQUMsRUFBRTtJQUNwQyxPQUFPLElBQUksT0FBTyxDQUFzQixDQUFPLE9BQU8sRUFBRSxNQUFNLEVBQUMsRUFBRTtRQUMvRCxJQUFJO1lBQ0YsSUFBSSxJQUFJLEdBQUcsTUFBTSxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3RDLElBQUksVUFBVSxHQUFHLE1BQU0sUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUE7WUFDcEQsT0FBTyxDQUFDLEVBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFDLENBQUMsQ0FBQTtTQUN2QztRQUFDLE9BQU8sRUFBRSxFQUFDO1lBQ1YsT0FBTyxDQUFDLEVBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUE7U0FDckM7SUFDSCxDQUFDLENBQUEsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFBO0FBVlksUUFBQSxVQUFVLGNBVXRCO0FBRU0sTUFBTSxXQUFXLEdBQUcsQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFDLEVBQUU7SUFDbkQsT0FBTyxJQUFJLE9BQU8sQ0FBc0IsQ0FBTyxPQUFPLEVBQUUsTUFBTSxFQUFDLEVBQUU7UUFDL0QsSUFBSTtZQUNGLElBQUksQ0FBQyxHQUFHLE1BQU0sUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUE7WUFDdEQsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBO1NBQ1g7UUFBQyxPQUFPLEVBQUUsRUFBRTtZQUNYLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUNkO0lBQ0gsQ0FBQyxDQUFBLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQTtBQVRZLFFBQUEsV0FBVyxlQVN2QiJ9