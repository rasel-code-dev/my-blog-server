"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function SQL_Date() {
    let now = new Date();
    let d = now.toISOString();
    let date = d.slice(0, 10);
    let time = now.toTimeString().slice(0, 8);
    return date + " " + time;
}
exports.default = SQL_Date;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU1FMX0RhdGUuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJzcmMvdXRpbGl0aWVzL1NRTF9EYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsU0FBUyxRQUFRO0lBQ2YsSUFBSSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQTtJQUNwQixJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUE7SUFDekIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFDekIsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDekMsT0FBTyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQTtBQUMxQixDQUFDO0FBRUQsa0JBQWUsUUFBUSxDQUFBIn0=