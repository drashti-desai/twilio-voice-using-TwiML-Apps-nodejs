var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var callSchema = new Schema({
    from: {
        type: String,
        required: true
    },
    to : {
        type: String,
        required: true
    },
    recordingUrl: {
        type: String
    },
    voicemailUrl: {
        type: String
    },
    duration: {
        type: String
    },
    price: {
        type: String
    }
})

module.exports = mongoose.model('callrecords', callSchema)