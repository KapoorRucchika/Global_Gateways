const mongoose = require("mongoose");
const packageSchema = new mongoose.Schema({
    package:
    {
        type: String,
        required: true
    },
    country:
    {
        type: String,
        require: true
    },
    price:
    {
        type:Number,
        require: true
    },
    duration:
    {
        type:Number,
        require: true
    },
    phone:
    {
        type:Number,
        require: true
    },
    image:
    {
        type:String,
        require:true
    }

})

const packageSchema1 = new mongoose.model("package", packageSchema);
module.exports = packageSchema1;