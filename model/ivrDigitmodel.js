var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var digitSchema = new Schema({
    digit: {
        type: String,
    },
    mobilenumber: {
        type: String
    }
})

var ivrSchema = new Schema({
    department: {
        type: String
    },
    // ivrCall: [digitSchema],
    digit: {
        type: String,
    },
    mobilenumber: {
        type: String
    }
})

module.exports = mongoose.model('ivrSchema', ivrSchema)