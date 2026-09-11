const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
    console.log('server running')
}).catch((err)=>{
    console.log(err)
})

module.exports = mongoose.connection;