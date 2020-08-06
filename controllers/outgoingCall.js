var callRecord = require('../model/callRecordmodel');
var VoiceResponse = require('twilio').twiml.VoiceResponse;
var call_prefix = 'https://20ccee9f460f.ngrok.io/api'
var accountSid = 'ACf552fc032421766cefee39dd1e796e64';
var authToken = '2cd08ac4a94e1b4779690815ffe828b5';

exports.outgoing = (req,res) => {
    if(req.body.From == 'client:Anonymous'){
        console.log("outgoing")
        var phoneNumber = '+919909253322';
        var twiml = new VoiceResponse();
        var dial = twiml.dial({
            callerId : '+19402023012',
            record: 'record-from-ringing-dual',
            recordingStatusCallback: `${call_prefix}/outgoingCallRecording`,
        });
        if (phoneNumber != null) {
            dial.number({
                method: 'GET',
                statusCallback: `${call_prefix}/outgoingCallResponse`,
                statusCallbackMethod: 'POST'
            }, phoneNumber);
        } else {
            dial.client("support_agent");
        }
        res.send(twiml.toString());
    }else{
        console.log("incoming")
        var twiml = new VoiceResponse();
        var phoneNumber = '+919909253322';
        var dial = twiml.dial({
            callerId : req.body.To,
            method: 'POST',
            timeout: '10',
            action: `${call_prefix}/voicemail`,
            record: 'record-from-ringing-dual',
            recordingStatusCallback: `${call_prefix}/outgoingCallRecording`,
        });
        if (phoneNumber != null) 
        {
            dial.number({
                method: 'GET',
                statusCallback: `${call_prefix}/incoimgCallResponse`,
                statusCallbackMethod: 'POST'
            }, phoneNumber);
        } else {
            dial.client("support_agent");
        }
        res.send(twiml.toString());
    }   
}

exports.outgoingCallResponse = (req,res) => {
    var callRecords = new callRecord({
          from: req.body.From,
          to: req.body.To,
          recordingUrl: req.body.CallDuration == 0 ? "" : req.body.RecordingUrl,
          voicemailUrl: "",
          duration: req.body.CallDuration,
          price: ""
      });
      console.log(req.body)
      console.log("ougoing callrecords"+callRecords)
      callRecords.save(callRecords)
          .then(data => {
              res.send(data);
          })
          .catch(err => {
              res.status(500).send({
                  message: err.message || "Some error occurred while store data in db"
              })
          })
}

exports.outgoingCallRecording = (req,res) => {
    var client = require('twilio')(accountSid, authToken)
    console.log("outgoing call recording")

    client.recordings
        .list({callSid: req.body.CallSid})
        .then(recordings => recordings.forEach(r => {
            console.log(r.sid)
      }));
}

exports.incoimgCallResponse = (req,res) => {
    console.log("status "+req.body.CallStatus)
    
    if (req.body.CallStatus !== 'completed') {
       res.send('redirect to voicemail')
    } else {
        console.log(req.body)
        var callRecords = new callRecord({
            from: req.body.To,
            to: req.body.From,
            recordingUrl: req.body.RecordingUrl,
            voicemailUrl: "",
            duration: req.body.CallDuration,
            price: ""
        });
        console.log("incoimg callrecords"+callRecords)
        callRecords.save(callRecords)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while store data in db"
                })
            })
    }
}

