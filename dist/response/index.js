"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function response(res, status = 200, message) {
    let resp = {};
    if (typeof message === "string") {
        resp = { message: message };
    }
    else {
        resp = message;
    }
    res.status(status).json(resp);
}
exports.default = response;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJyZXNwb25zZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLFNBQVMsUUFBUSxDQUFDLEdBQUcsRUFBRSxTQUFpQixHQUFHLEVBQUUsT0FBeUI7SUFDcEUsSUFBSSxJQUFJLEdBQVEsRUFBRSxDQUFBO0lBQ2xCLElBQUcsT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFDO1FBQzdCLElBQUksR0FBRyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQTtLQUM1QjtTQUFNO1FBQ0wsSUFBSSxHQUFHLE9BQU8sQ0FBQTtLQUNmO0lBQ0QsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDL0IsQ0FBQztBQUdELGtCQUFlLFFBQVEsQ0FBQSJ9