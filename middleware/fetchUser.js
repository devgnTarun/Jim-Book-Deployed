// it is middleware 
const jwt = require("jsonwebtoken");
const JWT_SECRET = "HUHUHUH";

const fetchUser = (req, res , next ) => {
        // GET THE USER FROM THE JWT TOKEN 
        const token = req.header('auth-token') 
        if(!token) {
            res.status(401).send({ error : ' ACHA BATT NHI HAI YEH'})
        }

        try {
            const data = jwt.verify(token , JWT_SECRET);
            req.user = data.user
            next()
        } catch (error) {
            res.status(401).send({ error :" ACHA BATT NHI HAI YEH"})
        }
       
} 

module.exports = fetchUser;