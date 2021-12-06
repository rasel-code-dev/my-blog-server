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
    // @ts-ignore
    res.status(status).json(resp);
}
exports.default = response;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvcmVzcG9uc2UvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxTQUFTLFFBQVEsQ0FBQyxHQUFhLEVBQUUsU0FBaUIsR0FBRyxFQUFFLE9BQXlCO0lBQzlFLElBQUksSUFBSSxHQUFRLEVBQUUsQ0FBQTtJQUNsQixJQUFHLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBQztRQUM3QixJQUFJLEdBQUcsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUE7S0FDNUI7U0FBTTtRQUNMLElBQUksR0FBRyxPQUFPLENBQUE7S0FDZjtJQUNELGFBQWE7SUFDYixHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUMvQixDQUFDO0FBR0Qsa0JBQWUsUUFBUSxDQUFBIn0=