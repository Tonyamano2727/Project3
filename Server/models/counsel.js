const mongoose = require('mongoose');


var CounselSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
      
    },
    mobile:{
        type:String,
        required:true,
    },
    service: {
        type:String,
        required:true,
    }
});


module.exports = mongoose.model('Counsel', CounselSchema);