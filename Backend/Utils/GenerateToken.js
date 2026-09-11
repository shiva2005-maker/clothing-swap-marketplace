const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
require("dotenv").config();

module.exports.generatetoken = async (user)=>{
    return await jwt.sign({email:user.email,role:user.role},process.env.JWT_KEY);
}

module.exports.comparepassword = async (password,hashedpassword)=>{
    return await bcrypt.compare(password,hashedpassword)
}
