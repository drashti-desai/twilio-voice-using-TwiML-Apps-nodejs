var callrecord = require('../model/callRecordmodel');
var ivrSystem = require('../model/ivrDigitmodel')
var VoiceResponse = require('twilio').twiml.VoiceResponse;
var call_prefix = 'https://c91de5a03c10.ngrok.io/api';

// exports.digit = (req,res) => {
//     ivrSystem.findOneAndUpdate(
//         {
//             department: req.body.department
//         },
//         {   
//             $push: {ivrCall: {digit: req.body.digit, mobilenumber: req.body.mobilenumber}}
//         }
//     )
//     .then(data => {
//         console.log(data)
//         res.send(data)
//     })
//     .catch(error => {
//         res.status(500).send({
//             message: error.message
//         })
//     })
// }

// exports.department = (req,res) => {
//     const ivr = new ivrSystem({

//     })
// }

exports.addDigit = (req,res) => {
    if(!req.body){
        res.status(400).send({
            message: "please enter department, digit and mobilenumber"
        })
    }
    const ivr = new ivrSystem({
        department: req.body.department,
        digit: req.body.digit,
        mobilenumber: req.body.mobilenumber
    })
    ivr.save()
    .then(data => {
        res.send(data);
    })
    .catch(error => {
        res.status(500).send({
            message: error.message
        })
    })
}

exports.getDigit = (req,res) => {
    ivrSystem.find({ department: 'management', digit: '1'}, {_id: 0, digit: 0, department: 0, mobilenumber: 1})
        .then(data => {
            console.log(data)
            res.send(data)
        })
        .catch(error => {
            res.status(500).send({
                message: error.message
            })
        })
}

exports.IVRsystem = (req, res) => {
    var twiml = new VoiceResponse();
    var phoneNumber = '+919909253322';
    var dial = twiml.dial({
        callerId : req.body.To
    });
    if (phoneNumber != null) {
        dial.number({
            method: 'POST',
            action: `${call_prefix}/defaultMsg`
        }, phoneNumber);
        res.send(twiml.toString());
    } else {
        dial.client("support_agent");
    }
} 

exports.defaultMsg = (req,res) => {
    const twiml = new VoiceResponse();
    var gather = twiml.gather({
        action: `${call_prefix}/menu`,
        numDigits: '1',
        method: 'POST'
    })
    gather.say(
        'Thanks for calling the IVR syatem. ' +
        'Please press 1 for management. ' + 
        'Please press 2 for support',
    )
    gather.pause({length: 2})
    twiml.redirect(`${call_prefix}/defaultMsg`)
    res.send(twiml.toString());
}

exports.menu = (req,res) => {
    const digits = req.body.Digits;
    console.log(digits)
    const optionActions = {
        '1': management,
        '2': support,
    }
    res.send((optionActions[digits]) ? optionActions[digits]() : invalidInput("menu"));
}

exports.onDigitCallM = (req,res) => {
    const twiml = new VoiceResponse();
    const digits = req.body.Digits;
    console.log("M digits"+digits)

    ivrSystem.find({ department: 'management', digit: digits})
            .then(data => {
                console.log(data[0].mobilenumber)

                var dial = twiml.dial({
                    callerId : '+19402023012',
                    method: 'POST',
                    timeout: '10',
                    action: `${call_prefix}/voicemail`,
                    record: 'record-from-ringing-dual',
                    recordingStatusCallback: `${call_prefix}/outgoingCallRecording`,
                });
                dial.number({
                    statusCallback: `${call_prefix}/incoimgCallResponse`,
                    statusCallbackMethod: 'POST'
                }, data[0].mobilenumber);
                console.log(twiml.toString())
                res.send(twiml.toString());
            })
            .catch(error => {
                if(digits == '*'){
                    console.log("in * back to main menu")
                    res.send(redirectToWelcome());
                }else{
                    console.log("else M")
                    res.send(invalidInput("onDigitCallM"));
                }
                res.status(500).send({
                    message: error.message
                })
            })
}

exports.onDigitCallS = (req,res) => {
    const twiml = new VoiceResponse();
    const digits = req.body.Digits;
    console.log("digits"+digits)

    ivrSystem.find({ department: 'support', digit: digits})
                    .then(data => {
                        console.log(data[0].mobilenumber)
                        var dial = twiml.dial({
                            callerId : '+19402023012',
                            method: 'POST',
                            timeout: '10',
                            action: `${call_prefix}/voicemail`,
                            record: 'record-from-ringing-dual',
                            recordingStatusCallback: `${call_prefix}/outgoingCallRecording`,
                        });
                        dial.number({
                            statusCallback: `${call_prefix}/incoimgCallResponse`,
                            statusCallbackMethod: 'POST'
                        }, data[0].mobilenumber);
                        res.send(twiml.toString());
                    })
                    .catch(error => {
                        if(digits == '*'){
                            console.log("in * back to main menu")
                            redirectToWelcome();
                        }else{
                            console.log("else S")
                            res.send(invalidInput("onDigitCallS"));
                        }
                        res.status(500).send({
                            message: error.message
                        })
                    })
    
}

function redirectToWelcome(){
    const twiml = new VoiceResponse();
    console.log("redirect to main menu")
    const gather = twiml.gather({
        action: `${call_prefix}/menu`,
        numDigits: '1',
        method: 'POST'
    })
    gather.say(
        'Returning to the main menu',
        {voice: 'alice', language: 'en-GB'}    
    )
    gather.pause({length: 1})
    twiml.redirect(`${call_prefix}/defaultMsg`)
    return twiml.toString();
}

function invalidInput(res){
    console.log("res"+res)
    const twiml = new VoiceResponse();
   
    const gather = twiml.gather({
        action: `${call_prefix}/${res}`,
        numDigits: '1',
        method: 'POST'
    })
    gather.say(
        'Invalid input. Please enter valid digit',
        {voice: 'alice', language: 'en-GB'}
    )
    gather.pause({length: 5})
    twiml.redirect(`${call_prefix}/${res}`)
    return twiml.toString();
}

function management(){
    const twiml = new VoiceResponse();

    const gather = twiml.gather({
        action: `${call_prefix}/onDigitCallM`,
        numDigits: '1',
        method: 'POST'
    })
    gather.say(
        'To call the management team press 1,' +
        'To call the service team press 2,' +
        'and go back to the main menu, press the star key ',
        {voice: 'alice', language: 'en-GB', loop: 2}
    )
    gather.pause({length: 2})
    return twiml.toString();
}

function support(){
    const twiml = new VoiceResponse();

    const gather = twiml.gather({
        action: `${call_prefix}/onDigitCallS`,
        numDigits: '1',
        method: 'POST'
    })
    gather.say(
        'To call the support team press 1,' +
        'To call the sales team press 2,' +
        'To call the lead team press 3,' +
        'and go back to the main menu, press the star key ',
        {voice: 'alice', language: 'en-GB', loop: 2}
    )
    return twiml.toString();
}

























// if(optionActions[digits]){
//     if (optionActions[digits] != null) {
//         var dial = twiml.dial({
//             callerId : '+19402023012',
//             method: 'POST',
//             timeout: '10',
//             action: `${call_prefix}/voicemail`,
//             record: 'record-from-ringing-dual',
//             recordingStatusCallback: `${call_prefix}/outgoingCallRecording`,
//         });
//         dial.number({
//             statusCallback: `${call_prefix}/incoimgCallResponse`,
//             statusCallbackMethod: 'POST'
//         }, optionActions[digits]);
//         console.log(twiml.toString())
//         res.send(twiml.toString());
//     }          
// }else{
//         if(digits == '*'){
//             console.log("in * back to main menu")
//             redirectToWelcome();
//         }else{
//             console.log("else M")
//             invalidInput();
//         }
// }




// console.log("in support")
    // twiml.say('Thanks for calling in support department', {
    //     voice: 'alice',
    //     language: 'en-GB'
    // })
    // twiml.hangup();
    // return twiml.toString();


    // console.log("digi"+optionActions)
    // if(digits == ('1'||'2')){
    //     console.log('digits call')
    //     optionActions[digits];
    // }else{
    //     redirectToWelcome();
    // }
    
    // return (optionActions[digits])
    // ? optionActions[digits]()
    // : redirectWelcome();
    // res.send(redirectToWelcome());
    // res.send("hello");

    