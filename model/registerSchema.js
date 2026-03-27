const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const registerSchema = new mongoose.Schema({
    username:
    {
        type: String,
        required: true
    },
    email:
    {
        type: String,
        require: true
    },
    country:
    {
        type:String,
        require: true
    },
    phone:
    {
        type:Number,
        require: true
    },
    pass:
    {
        type:String,
        require: true
    },

})

registerSchema.pre("save", function(next){
    if(!this.isModified("pass")){
        return next();
    }
    this.pass = bcrypt.hashSync(this.pass, 10);
    next();
});

registerSchema.methods.comparePassword = function(plaintext, callback){
    return callback(null,bcrypt.compareSync(plaintext, this.pass));
};

const registerSchema1 = new mongoose.model("register", registerSchema);
module.exports = registerSchema1;