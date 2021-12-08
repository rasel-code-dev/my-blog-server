"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zl = require("zip-lib");
function createZip(src, destFile) {
    return new Promise((resolve, reject) => {
        zl.archiveFolder(src, destFile).then(function () {
            console.log("done to create zip");
            resolve(true);
        }, function (err) {
            reject(err);
        });
    });
}
exports.default = createZip;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFrZVppcC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy91dGlsaXRpZXMvbWFrZVppcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUU5QixTQUFTLFNBQVMsQ0FBQyxHQUFHLEVBQUUsUUFBUTtJQUMvQixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBQyxFQUFFO1FBQ3RDLEVBQUUsQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFDbEMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2QsQ0FBQyxFQUFFLFVBQVUsR0FBRztZQUNmLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNaLENBQUMsQ0FBQyxDQUFDO0lBRUgsQ0FBQyxDQUFDLENBQUE7QUFDSCxDQUFDO0FBRUQsa0JBQWUsU0FBUyxDQUFBIn0=