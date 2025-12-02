const {validateToken} = require("../services/auth")

function checkForAuthenticationCookies(cookiesName){
    return (req,res,next)=>{
        const tokenCookieValue = req.cookies[cookiesName];
        if(!tokenCookieValue) {
         return next();
        }

     try {
           const userPayload = validateToken(tokenCookieValue);
             req.user = userPayload;
            
        } catch (error) { 
            console.log("JWT verify failed:", error.message);
        }
         return next();
   
    }
}

module.exports = { checkForAuthenticationCookies}