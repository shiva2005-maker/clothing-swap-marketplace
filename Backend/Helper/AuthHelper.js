const bcrypt = require("bcrypt")

module.exports.hashpassword = async (password)=>{
    let saltRounds = 10;
    let hashedpassword = await bcrypt.hash(password,saltRounds);
    return hashedpassword;
}

module.exports.comparepassword = async (password,hashedpassword)=>{
    return await bcrypt.compare(password,hashedpassword)
}