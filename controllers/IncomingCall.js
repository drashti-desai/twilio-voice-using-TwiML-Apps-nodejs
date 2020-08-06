var callRecord = require('../model/callRecordmodel');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const ClientCapability = require('twilio').jwt.ClientCapability;
var call_prefix = 'https://20ccee9f460f.ngrok.io/api'
var accountSid = 'ACf552fc032421766cefee39dd1e796e64';
var authToken = '2cd08ac4a94e1b4779690815ffe828b5';

exports.outgoingCallTalk = (req,res) => {
    const appSid = 'AP24f3f3e083c50b3ad8e84af3f045829b';
    const capability = new ClientCapability({
        accountSid: accountSid,
        authToken: authToken
    })
    capability.addScope(
        new ClientCapability.OutgoingClientScope({ applicationSid: appSid})
    )
    const token = capability.toJwt();
    res.set('Content-Type', 'application/jwt');
    res.json({
        status: '200',
        token: token
    })
}

exports.voicemail = (req,res) => {
    console.log(req.body)
    console.log("DialCallStatus:"+req.body.DialCallStatus)
    var twiml = new VoiceResponse();
    if(req.body.DialCallStatus == 'completed'){
        // twiml.say('your call is ended');
        twiml.hangup();
    }else{
        twiml.say('Please leave a message on the call.\nPress the star key when finished.');
        twiml.record({
            action: `${call_prefix}/voiceMailResponse`,
            method: 'POST',
            maxLength: '20',
            finishOnKey: '*'
        });
        console.log("voicemail response")
        res.send(twiml.toString());
    }
}

exports.voiceMailResponse = (req,res) => {
    console.log(req.body)
    console.log("voiceMailResponse")
    var callRecords = new callRecord({
        from: req.body.From,
        to: req.body.To,
        recordingUrl: "",
        voicemailUrl: req.body.RecordingUrl,
        duration: req.body.CallDuration,
        price: ""
    });
    console.log("incoimg voicemail callrecords"+callRecords)
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


exports.incommingCall = (req,res) => {
    var twiml = new VoiceResponse();
    console.log("req for incoming");

    twiml.say("hello I'm drashti from your office at twillo. Have fun!");
    twiml.say('Please leave a message on the call.\nPress the star key when finished.');
    twiml.record({
        action: 'https://b39598d5a6d5.ngrok.io/api/voicemail',
        method: 'POST',
        maxLength: '20',
        finishOnKey: '*'
    });
    res.send(twiml.toString());
}

exports.hangoutCall = (req,res) => {
    var client = require('twilio')(accountSid, authToken);
    console.log("hangup")
    console.log(req)
    client.recordings
      .list({callSid: req.body.CallSid})
      .then(recordings => recordings.forEach(r => {
        var callRecords = new callRecord({
            from: req.body.From,
            to: req.body.To,
            recordingUrl: r.uri,
            duration: r.duration,
            price: r.price
        });
        console.log("callrecords"+callRecords)
        callRecords.save(callRecords)
            .then(data => {
                res.send(data);
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while store data in db"
                })
            })
        }));
}

exports.handleCallRecord = (req,res) => {
    var client = require('twilio')(accountSid, authToken);
    client.calls.list({limit:1}).then(
        calls => calls.forEach(c => {
            console.log("checking");
            res.send(c);
            console.log(c);
        }))
}

















// var twiml = new VoiceResponse();
 // var phoneNumber = '+19402023012';
    // console.log(req)
    // var dial = twiml.dial({callerId : req.body.Called});
    // if (phoneNumber != null) {
    //     dial.number({
    //         method: 'GET',
    //         statusCallback: 'https://31f018caeb49.ngrok.io/api/outgoingCallResponse',
    //         statusCallbackMethod: 'POST',
    //         record: true,
    //     }, phoneNumber);
    // } else {
    //     dial.client("support_agent");
    // }
    



 












// capability.addScope(new ClientCapability.IncomingClientScope('(940) 202-3012'));

    // capability = ClientCapabilityToken(account_sid, auth_token)
    // capability.allow_client_incoming('(940) 202-3012')
    // capability.allow_client_outgoing({applicationSid: appSid})




// exports.getCallRecord = (req,res) => {
//     var client = require('twilio')(accountSid, authToken);
//     client.calls.list({limit:1}).then(
//         calls => calls.forEach(c => {
//             console.log("checking")
//             console.log(c)
            // var callRecords = new callRecord({
            //     from: c.from,
            //     to: c.to,
            //     recordingUrl: c.subresourceUris.recordings,
            //     voicemailUrl: c.uri,
            //     duration: c.duration,
            //     price: c.price
            // })
            // callRecords.save(callRecords)
            //     .then(data => {
            //         res.send(data);
            //     })
            //     .catch(err => {
            //         res.status(500).send({
            //         message:
            //         err.message || "Some error occurred while store data in db"
            //     });
            // });
//         })
//         .catch((error) => {
//             res.send(error)
//         })
//     )
// }







// exports.outgoingCall = (req,res)=> {
//     var client = require('twilio')(accountSid, authToken)
//     client.calls.create({
//         method: 'GET',
//         statusCallback: 'http://635835fe121f.ngrok.io/api/hangoutCall',
//         // statusCallbackEvent: 'initiated ringing answered completed',
//         statusCallbackMethod: 'POST',
//         // twiml: '<Response><Say>Ahoy, World!</Say></Response>',
//         url: 'http://demo.twilio.com/docs/voice.xml',
//         record: true,
//         to: req.body.to,
//         from: req.body.from
//     })
//     .then(call => {
//         res.send(call.sid);
//         console.log("callsid"+call.sid);
//     })
//     .catch((error) => {
//         res.send(error)
//     })
// }






// client.calls.list({sid: req.body.CallSid}).then(
    //     calls => calls.forEach(c => {
    //         console.log("status checking"+c)
    //         if(c.status != 'completed'){
    //             const VoiceResponse = require('twilio').twiml.VoiceResponse;
    //             const response = new VoiceResponse();
    //             response.say('Please leave a message at the beep.\nPress the star key when finished.');
    //             response.record({
    //                 action: 'http://f90db81d52c2.ngrok.io/api/handleCallRecord',
    //                 method: 'GET',
    //                 maxLength: 20,
    //                 finishOnKey: '*'
    //             });
    //             response.say('I did not receive a recording');
    //         }
    //     })
    // )






    // let twiml = new VoiceResponse();

    // if (req.DialCallStatus === "completed") {
    //     twiml.hangup();
    // }
    // else {
    //     // twiml.redirect('<URL-TO-VOICEMAIL-TWIML>');
    //     twiml.say('Please leave a message at the beep.\nPress the star key when finished.');
    //     twiml.record({
    //         action: 'http://f90db81d52c2.ngrok.io/api/voicemai',
    //         method: 'POST',
    //         maxLength: 20,
    //         finishOnKey: '*'
    //     });
    //     twiml.say('I did not receive a recording');
    //





// exports.posthangoutCall = (req,res) => {
//     console.log(req)
//     console.log("post req.body"+req.body)
//     res.send("hello")
// }

// const response = new VoiceResponse();
// response.say('Please leave a message at the beep.\nPress the star key when finished.');
// response.record({
//     action: 'http://foo.edu/handleRecording.php',
//     method: 'GET',
//     maxLength: 20,
//     finishOnKey: '*'
// });
// response.say('I did not receive a recording');
// res.send(response.toString())
// console.log(response.toString());





// const http = require('http');
// const express = require('express');
// const ClientCapibility = require('twilio').jwt.ClientCapability;

    // , function(error, call){
    //     if(error){
    //         console.log(error);
    //         // var callRecords = new callRecord({
    //         //     from: req.body.to,
    //         //     to: req.body.to,
    //         //     recordingUrl: 
    //         // })
    //     }else{
    //         console.log("calling")
    //         res.send(call.sid);
    //         console.log(call.sid);
    //         client.calls.list({limit: 30}).then(
    //             calls => calls.forEach(c => {
    //                 res.send(c.sid + c.from + c.to +"duration"+ c.duration+"cost" + c.price+"recording"+c.recordings),
    //                 console.log(c.sid)
    //                 var callRecords = new callRecord({
    //                     from: c.from,
    //                     to: c.to,
    //                 })
    //                 callRecords.save(callRecords)
    //                     .then(data => {
    //                         res.send(data);
    //                     })
    //                     .catch(err => {
    //                         res.status(500).send({
    //                         message:
    //                         err.message || "Some error occurred while store data in db"
    //                     });
    //                 });
    //             })
    //         )
            
    //         console.log("call successfully generated");
    //         res.send("call successfully generated");

    //     }
    // }
// })
    
// exports.incommingCall = (req,res) => {

// }

// module.exports = router;

// Twilio.Device.incoming((conn) => {
//     console.log("Incoming connection from " + conn.parameters.From);
//     conn.accept();

//     const archRejectPhoneNumber = '+919909253322';

//     if(conn.parameters.From === archRejectPhoneNumber){
//         conn.reject();
//     }else{
//         conn.accept();
//     }
// })


// sendDigits: '123456',
    // record: true,
    // statusCallback: 'https://www.myapp.com/events',
    // statusCallbackEvent: ['initiated', 'answered'],
    // statusCallbackMethod: 'POST',



// const router = express();

// router.get('/token', (req,res) => {
//     const capability = new ClientCapibility({
//         accountSid: accountSid,
//         authToken: authToken
//     })
//     capability.addScope(new ClientCapibility.IncomingClientScope('drashti'));
//     const token = capability.toJwt();

//     res.set('Content-type', 'application/jwt');
//     res.send(token);
// });


// router.post('/makeCall', (req,res) => {
//     var client = require('twilio')(accountSid, authToken)
//     // var client = require('twilio')('ACfee0864f497059a905b6e44997151919', 'a9a423c4be772ab55438cc861fa58d64')
//     client.calls.create({
//         url: 'http://demo.twilio.com/docs/voice.xml',
//         to: '+919909253322',
//         from: '+19402023012'
//     }), function(error, call){
//         if(error){
//             console.log(call);
//             client.calls.list({limit: 30}).then(
//                 calls => calls.forEach(c => {
//                     res.send(c.sid + c.from + c.to + c.duration + c.cost),
//                     console.log(c.sid)
//                 })
//             )
//             console.log("call successfully generated");
//             res.send("call successfully generated");
//         }else{
//             res.send(call.sid);
//         }
//     }
// })

// client.calls.list({limit: 1}).then(
        //     calls => calls.forEach(c => {
        //         var callRecords = new callRecord({
        //             from: c.from,
        //             to: c.to,
        //             recordingUrl: c.subresourceUris.recordings,
        //             voicemailUrl: c.uri,
        //             duration: c.duration,
        //             price: c.price
        //         })
        //         console.log("save data")
        //         callRecords.save(callRecords)
        //             .then(data => {
        //                 res.send(data);
        //                 console.log(data);
        //             })
        //             .catch(err => {
        //                 console.log(err)
        //                 res.status(500).send({
        //                 message: err.message || "Some error occurred while store data in db"
        //             });
        //         });
        //     })
        // )
        // .catch((error) => {
        //     res.send(error)
        // })
        // const client = require('twilio')(accountSid, authToken)
    // client.calls.list({limit:1}).then(
    //     calls => calls.forEach(c => {
    //         var callRecords = new callRecord({
    //             from: c.from,
    //             to: c.to,
    //             recordingUrl: c.subresourceUris.recordings,
    //             voicemailUrl: c.uri,
    //             duration: c.duration,
    //             price: c.price
    //         })
    //         callRecords.save(callRecords)
    //             .then(data => {
    //                 res.send(data);
    //             })
    //             .catch(err => {
    //                 res.status(500).send({
    //                 message:
    //                 err.message || "Some error occurred while store data in db"
    //             });
    //         });
    //     })
    //     .catch((error) => {
    //         res.send(error)
    //     })
    // )