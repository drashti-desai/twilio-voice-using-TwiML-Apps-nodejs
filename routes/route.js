var Router = require('express').Router();
var callrecord = require('../controllers/IncomingCall');
var cr = require('../controllers/outgoingCall')
var ivr = require('../controllers/IVRsystem')

Router.get('/', cr.outgoing ,(req,res) => {
    res.sendFile(__dirname+'/index.html')
    res.json({
        status: 'working',
        message: 'Call record project is start!'
    })
})


Router.route('/incomingCall')
    .post(callrecord.incommingCall)

Router.route('/hangoutCall')
    .post(callrecord.hangoutCall)
Router.route('/incomingCall')
    .post(callrecord.incommingCall)

Router.route('/voicemail')
    .post(callrecord.voicemail)

Router.route('/handleCallRecord')
    .get(callrecord.handleCallRecord)



Router.route('/outgoing')
    .post(cr.outgoing)

Router.route('/outgoingCallResponse')
    .post(cr.outgoingCallResponse)

Router.route('/incoimgCallResponse')
    .post(cr.incoimgCallResponse)

Router.route('/outgoingCallRecording')
    .post(cr.outgoingCallRecording)

Router.route('/capability-token')
    .get(callrecord.outgoingCallTalk)

Router.route('/voicemail')
    .post(callrecord.voicemail)

Router.route('/voiceMailResponse')
    .post(callrecord.voiceMailResponse)
    
Router.route('/IVRSystem')
    .post(ivr.IVRsystem)

Router.route('/defaultMsg')
    .post(ivr.defaultMsg)

Router.route('/menu')
    .post(ivr.menu)

Router.route('/onDigitCallM')
    .post(ivr.onDigitCallM)

Router.route('/onDigitCallS')
    .post(ivr.onDigitCallS)

Router.route('/addDigit')
    .post(ivr.addDigit)

Router.route('/getDigit')
    .get(ivr.getDigit)

module.exports = Router;
