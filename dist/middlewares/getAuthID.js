"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../jwt/index");
function getAuthID(req, res, next) {
    let token = req.headers["token"];
    if (!token) {
        res.status(409).json({ message: "You are unauthorized" });
        return;
    }
    (0, index_1.parseToken)(token).then(u => {
        req.user_id = u.id;
        req.user_email = u.email;
        next();
    }).catch(err => {
        console.log(err.message);
        res.status(409).json({ message: "You are unauthorized" });
        return;
    });
}
exports.default = getAuthID;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0QXV0aElELmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsibWlkZGxld2FyZXMvZ2V0QXV0aElELnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQXlDO0FBRXhDLFNBQVMsU0FBUyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSTtJQUNoQyxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBRWhDLElBQUcsQ0FBQyxLQUFLLEVBQUM7UUFDUixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFDLE9BQU8sRUFBRSxzQkFBc0IsRUFBQyxDQUFDLENBQUE7UUFDdkQsT0FBTTtLQUNQO0lBRUQsSUFBQSxrQkFBVSxFQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUEsRUFBRTtRQUN4QixHQUFHLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUE7UUFDbEIsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFBO1FBQ3hCLElBQUksRUFBRSxDQUFBO0lBQ1IsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQSxFQUFFO1FBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDeEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUMsQ0FBQyxDQUFBO1FBQ3ZELE9BQU07SUFDUixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFHRCxrQkFBZSxTQUFTLENBQUEifQ==