"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getAppCookies = (req) => {
    // We extract the raw cookies from the request headers
    const parsedCookies = {};
    if (req.headers && req.headers.cookie) {
        const rawCookies = req.headers.cookie.split('; ');
        // rawCookies = ['myapp=secretcookie, 'analytics_cookie=beacon;']
        rawCookies.forEach(rawCookie => {
            const parsedCookie = rawCookie.split('=');
            if (parsedCookie && parsedCookie.length > 1) {
                // parsedCookie = ['myapp', 'secretcookie'], ['analytics_cookie', 'beacon']
                parsedCookies[parsedCookie[0]] = parsedCookie[1];
            }
        });
    }
    return parsedCookies;
};
exports.default = getAppCookies;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0QXBwQ29va2llcy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInNyYy91dGlsaXRpZXMvZ2V0QXBwQ29va2llcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLE1BQU0sYUFBYSxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUU7SUFDNUIsc0RBQXNEO0lBQ3BELE1BQU0sYUFBYSxHQUFRLEVBQUUsQ0FBQztJQUU5QixJQUFHLEdBQUcsQ0FBQyxPQUFPLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7UUFDdEMsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xELGlFQUFpRTtRQUVqRSxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzdCLE1BQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDMUMsSUFBSSxZQUFZLElBQUksWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQzNDLDJFQUEyRTtnQkFDM0UsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNsRDtRQUNILENBQUMsQ0FBQyxDQUFDO0tBQ0o7SUFDRCxPQUFPLGFBQWEsQ0FBQztBQUN2QixDQUFDLENBQUM7QUFFRixrQkFBZSxhQUFhLENBQUEifQ==