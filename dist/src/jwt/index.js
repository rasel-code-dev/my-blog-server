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
exports.getToken = exports.parseToken = exports.createToken = void 0;
const jwt = require('jsonwebtoken');
const createToken = (id, email) => {
    return jwt.sign({
        id: id,
        email: email,
    }, process.env.SECRET, { expiresIn: '5h' });
};
exports.createToken = createToken;
const parseToken = (token) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (token) {
                let d = yield jwt.verify(token, process.env.SECRET);
                resolve(d);
            }
            else {
                reject(new Error("token not found"));
            }
        }
        catch (ex) {
            reject(ex);
        }
    }));
};
exports.parseToken = parseToken;
const getToken = (req) => {
    return req.headers["authorization"];
};
exports.getToken = getToken;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvand0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQTtBQUU1QixNQUFNLFdBQVcsR0FBRyxDQUFDLEVBQUUsRUFBRSxLQUFLLEVBQUMsRUFBRTtJQUN0QyxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUM7UUFDWixFQUFFLEVBQUUsRUFBRTtRQUNOLEtBQUssRUFBRSxLQUFLO0tBQ2IsRUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUMsQ0FDdEMsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQVBZLFFBQUEsV0FBVyxlQU92QjtBQUdNLE1BQU0sVUFBVSxHQUFHLENBQUMsS0FBSyxFQUFDLEVBQUU7SUFDaEMsT0FBTyxJQUFJLE9BQU8sQ0FBOEIsQ0FBTyxPQUFPLEVBQUUsTUFBTSxFQUFDLEVBQUU7UUFDdkUsSUFBSTtZQUNGLElBQUcsS0FBSyxFQUFFO2dCQUNSLElBQUksQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQTtnQkFDbkQsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBO2FBQ1g7aUJBQU07Z0JBQ04sTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQTthQUNwQztTQUNGO1FBQUMsT0FBTyxFQUFFLEVBQUM7WUFDVixNQUFNLENBQUMsRUFBRSxDQUFDLENBQUE7U0FDWDtJQUNILENBQUMsQ0FBQSxDQUFDLENBQUE7QUFDTCxDQUFDLENBQUE7QUFiWSxRQUFBLFVBQVUsY0FhdEI7QUFFTSxNQUFNLFFBQVEsR0FBRyxDQUFDLEdBQUcsRUFBQyxFQUFFO0lBQzdCLE9BQU8sR0FBRyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQTtBQUNyQyxDQUFDLENBQUE7QUFGWSxRQUFBLFFBQVEsWUFFcEIifQ==