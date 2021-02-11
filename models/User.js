const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type:String,
        required: [true, 'Username is required']
    },
    email: {
        type:String,
    },
    picture: {
        type:String
    }
})

module.exports=mongoose.model("User", UserSchema)