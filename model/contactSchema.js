const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema({
    email:
    {
        type: String,
        required: true
    },
    phone:
    {
        type: Number,
        required: true
    },
    query:
    {
        type: String,
        required: true
    },
    member:
    {
        type: String,
        required: true
    },
    concern:
    {
        type: String,
        required: true
    },
})

const contactSchema1 = new mongoose.model("contact", contactSchema);
module.exports = contactSchema1;
