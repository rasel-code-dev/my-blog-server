"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function response(res, status = 200, data) {
    let resp = {};
    if (typeof data === "string") {
        resp = { message: data };
    }
    else {
        resp = data;
    }
    res.status(status).json(resp);
}
exports.default = response;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJyZXNwb25zZS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLFNBQVMsUUFBUSxDQUFDLEdBQUcsRUFBRSxTQUFpQixHQUFHLEVBQUUsSUFBc0I7SUFDakUsSUFBSSxJQUFJLEdBQVEsRUFBRSxDQUFBO0lBQ2xCLElBQUcsT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFDO1FBQzFCLElBQUksR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQTtLQUN6QjtTQUFNO1FBQ0wsSUFBSSxHQUFHLElBQUksQ0FBQTtLQUNaO0lBQ0QsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7QUFDL0IsQ0FBQztBQUdELGtCQUFlLFFBQVEsQ0FBQSJ9