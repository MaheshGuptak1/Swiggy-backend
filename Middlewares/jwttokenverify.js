const jwt = require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();
const jwtTokenVerify = (req, res, next) => {
    try {
        const token = req.headers.token;
        if (!token) {
            return res.status(403).json({ message: "No token provided" });
        }
        else{
            const secretkey = process.env.secretkey;  
        const decoded = jwt.verify(token, secretkey);  
        req.vendorId = decoded.vendorId;    // decoded object will have one attribute called vendorId and 
        // vendorId is came from the vendorController jwt.sign ({vendorId : vendor._id}, secretkey, {expieresIn : "1hr"})
        next(); 
        }
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: err.message , "in" : "verifytoken"});
    }
};
module.exports = jwtTokenVerify;
