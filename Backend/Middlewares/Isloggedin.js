const jwt = require("jsonwebtoken");
const UserModel = require("../Models/UserModel");
require("dotenv").config();


const Isloggedin =  async (req,res,next)=>{
    let token = req.cookies?.token;
    if (!token) {
            return res.status(401).send({ message: "Unauthorized: no token provided" });
    }
    try{
            
        let decode = await jwt.verify(token,process.env.JWT_KEY);
        let user = await UserModel.findOne({email:decode.email}).select("-password");
        if (!user) {
                return res.status(401).send({ message: "Unauthorized: User not found" });
        }
        req.user = user;
        next();
    }catch(err){
        return res.status(401).send({message: "Unauthorized: Invalid token"});
    }
}

module.exports = Isloggedin;