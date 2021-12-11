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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvcmVzcG9uc2UvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxTQUFTLFFBQVEsQ0FBQyxHQUFHLEVBQUUsU0FBaUIsR0FBRyxFQUFFLE9BQXlCO0lBQ3BFLElBQUksSUFBSSxHQUFRLEVBQUUsQ0FBQTtJQUNsQixJQUFHLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBQztRQUM3QixJQUFJLEdBQUcsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUE7S0FDNUI7U0FBTTtRQUNMLElBQUksR0FBRyxPQUFPLENBQUE7S0FDZjtJQUNELEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQy9CLENBQUM7QUFHRCxrQkFBZSxRQUFRLENBQUEifQ==