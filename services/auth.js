const JWT = require("jsonwebtoken");
const secert = "dhania99$";


function createTokenForUser(user){
    const payload = {
        _id : user._id,
        email :user.email,
        profileImage:user.profileImage,
        role : user.role,
    };

    const token = JWT.sign(payload,secert);
    return token;
};

function validateToken(token){
const payload = JWT.verify(token ,secert);
return payload;

};

module.exports = { 
    createTokenForUser,validateToken
}