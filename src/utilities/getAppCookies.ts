
const getAppCookies = (req) => {
  // We extract the raw cookies from the request headers
  const rawCookies = req.headers.cookie.split('; ');
  // rawCookies = ['myapp=secretcookie, 'analytics_cookie=beacon;']
  
  const parsedCookies : any = {};
  rawCookies.forEach(rawCookie=>{
    const parsedCookie = rawCookie.split('=');
    if(parsedCookie && parsedCookie.length > 1) {
      // parsedCookie = ['myapp', 'secretcookie'], ['analytics_cookie', 'beacon']
      parsedCookies[parsedCookie[0]] = parsedCookie[1];
    }
  });
  return parsedCookies;
};

export default getAppCookies