"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../jwt/index");
function getAuthID(req, res, next) {
    let token = req.headers["token"];
    if (!token) {
        req.user_id = null;
        return next();
    }
    (0, index_1.parseToken)(token).then(u => {
        req.user_id = u.id;
        req.user_email = u.email;
        next();
    }).catch(err => {
        req.user_id = null;
        next();
    });
}
exports.default = getAuthID;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0QXV0aElELmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic3JjL21pZGRsZXdhcmVzL2dldEF1dGhJRC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdDQUF5QztBQUV4QyxTQUFTLFNBQVMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUk7SUFDaEMsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUVoQyxJQUFHLENBQUMsS0FBSyxFQUFDO1FBQ1IsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUE7UUFDbEIsT0FBTyxJQUFJLEVBQUUsQ0FBQTtLQUNkO0lBRUQsSUFBQSxrQkFBVSxFQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUEsRUFBRTtRQUN4QixHQUFHLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUE7UUFDbEIsR0FBRyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFBO1FBQ3hCLElBQUksRUFBRSxDQUFBO0lBQ1IsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQSxFQUFFO1FBQ1osR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUE7UUFDbEIsSUFBSSxFQUFFLENBQUE7SUFDUixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFHRCxrQkFBZSxTQUFTLENBQUEifQ==