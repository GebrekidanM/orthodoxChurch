const mongoose = require('mongoose')

const AboutSchema = mongoose.Schema({
    content:{type:String,required:true}
})


module.exports = mongoose.model('About', AboutSchema);