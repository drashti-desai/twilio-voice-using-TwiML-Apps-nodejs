var express = require('express');
var env = require('env');
var process = require('process')
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var apiRoutes = require('./routes/route');

var app = express();
var port = process.env.PORT || 4000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const connectionURL = 'mongodb://localhost:27017/CHdemo';
mongoose.Promise = global.Promise;
mongoose.connect(connectionURL, { useUnifiedTopology: true , useNewUrlParser: true }, (error, res) => {
    if(error){
        console.log("unable to connect local database")
    }
    console.log("DB connected successfully !!")
});     

app.use(express.static(__dirname + '/public'));
app.use('/api', apiRoutes)

app.listen(port, () => {
    console.log('Incoming call of twilio phone number ' + port);
});















// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;

// MongoClient.connect(connectionURL, { useUnifiedTopology: true }, {useNewUrlParser: true}, (error,client) => {
//     if(error){
//         console.log("unable to connect local database")
//     }
//     console.log("DB connected successfullyy !!")
// })