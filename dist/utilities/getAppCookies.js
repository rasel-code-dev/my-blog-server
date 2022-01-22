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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0QXBwQ29va2llcy5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbInV0aWxpdGllcy9nZXRBcHBDb29raWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsTUFBTSxhQUFhLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRTtJQUM1QixzREFBc0Q7SUFDcEQsTUFBTSxhQUFhLEdBQVEsRUFBRSxDQUFDO0lBRTlCLElBQUcsR0FBRyxDQUFDLE9BQU8sSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRTtRQUN0QyxNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEQsaUVBQWlFO1FBRWpFLFVBQVUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDN0IsTUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxQyxJQUFJLFlBQVksSUFBSSxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDM0MsMkVBQTJFO2dCQUMzRSxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2xEO1FBQ0gsQ0FBQyxDQUFDLENBQUM7S0FDSjtJQUNELE9BQU8sYUFBYSxDQUFDO0FBQ3ZCLENBQUMsQ0FBQztBQUVGLGtCQUFlLGFBQWEsQ0FBQSJ9