const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
   const secretkey = 'your_secret_key'; 
   const { token } = req.cookies;

   if (token) {
        try {
            const decoded = jwt.verify(token, secretkey); 
            console.log ({ decoded })
            if (decoded){
                res.locals.decoded = decoded
                next();
            } else {
                res.redirect("/auth/login")
            }
        } catch (error) {
            console.log ({ decoded })
            res.redirect("/auth/login")
        }
    } else {
        console.log({ decoded })
        res.redirect("/auth/login")
    } 


}

module.exports = {requireAuth}