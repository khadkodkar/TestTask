const jsonwebtoken = require("jsonwebtoken");

const jwt = {
    issueJWT: async user => {
        let payload = {    
        id : user._id,    
        };
        const options = {
        expiresIn: '365d'
        };
        const jwtToken = await jsonwebtoken.sign(payload, 'KEy', options);
        return jwtToken;
    },
    verifyTokenFn: async (req, res, next) => {
      var token=req.headers.authorization                     
        await jsonwebtoken.verify(token, 'KEy', function(err, decoded) {                      
            if (err) {                    
                return res.json({
                    status:400,
                    success: false,
                    message: "Please login Again token expire",
                });
            }   else {                               
                req.user = {
                    id: decoded.id                
                }
                return next();
            }
        });
    }
};
module.exports = jwt;