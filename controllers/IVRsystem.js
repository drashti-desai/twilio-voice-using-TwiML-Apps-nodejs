var callrecord = require('../model/callRecordmodel')
var VoiceResponse = require('twilio').twiml.VoiceResponse;
var call_prefix = 'https://20ccee9f460f.ngrok.io/api'

exports.IVRsystem = (req, res) => {
    var twiml = new VoiceResponse();
    console.log(req.body)
    var phoneNumber = req.body.To == '+19402023012' ? '+919909253322' : '+919909019894';
    var dial = twiml.dial({
        callerId : req.body.To == '+19402023012' ? req.body.To : req.body.From,
        // method: 'POST',
        // timeout: '10',
        // action: `${call_prefix}/voicemail`,
        // record: 'record-from-ringing-dual',
        // recordingStatusCallback: `${call_prefix}/outgoingCallRecording`,
    });
    if (phoneNumber != null) {
        dial.number({
            method: 'POST',
            action: `${call_prefix}/defaultMsg`,
            // statusCallback: `${call_prefix}/incoimgCallResponse`,
            // statusCallbackMethod: 'POST'
        }, phoneNumber);
        res.send(twiml.toString());
    } else {
        dial.client("support_agent");
    }
} 

exports.defaultMsg = (req,res) => {
    const twiml = new VoiceResponse();
    var gather = twiml.gather({
        action: `${call_prefix}/onDigitCall`,
        numDigits: '1',
        method: 'POST'
    })
    gather.say(
        'Thanks for calling the IVR syatem. ' +
        'Please press 1 for management. ' + 
        'Please press 2 for support',
        {loop: 3}
    )
    res.send(twiml.toString());
}

function redirectToWelcome(){
    const twiml = new VoiceResponse();
    console.log("redirect to wel")
    twiml.say('Redirect to the main menu', {
        voice: 'alice',
        language: 'en-GB'
    })
    twiml.redirect(`${call_prefix}/defaultMsg`)
    return twiml.toString();
}

exports.onDigitCall = (req,res) => {
    const twiml = new VoiceResponse();
    const digits = req.body.Digits;
    console.log("digits"+digits)
    const optionActions = {
        '1': '+919909019894',
        '2': '+919909019893'
    }
    const fromState = req.body.FromState;
    if(optionActions[digits]){
        // console.log("in twilio call")
        // var dial = twiml.dial({
        //     callerId : optionActions[digits]
        // });
        // var dial = twiml.dial();
        // if (optionActions[digits] != null) {
        //     console.log("call"+optionActions[digits])
        //     dial.number({
        //         method: 'GET',
        //         statusCallback: `${call_prefix}/incoimgCallResponse`,
        //         statusCallbackMethod: 'POST'
        //     }, '+19402023012');
        //     res.send(twiml.toString());
        // } else {
        //     dial.client("support_agent");
        // }
        // twiml.dial(optionActions[digits]);
        twiml.redirect(`${call_prefix}/IVRSystem`)
        res.send(twiml.toString());

    }else{
        console.log("invalid digit")
        res.send(redirectToWelcome())
    }
}

exports.menu = (req,res) => {
    const digits = req.body.Digits;
    console.log(digits)
    const optionActions = {
        '1': management,
        '2': support
    }
    res.send((optionActions[digits]) ? new optionActions[digits]() : new redirectToWelcome());
}

function management(){
    const twiml = new VoiceResponse();
    console.log("in mangt")
    const gather = twiml.gather({
        action: `${call_prefix}/onDigitCall`,
        numDigits: '1',
        method: 'POST'
    })
    gather.say(
        'To call the support team, press 2.' +
        'go back to the main menu, press the star key ',
        {voice: 'alice', language: 'en-GB', loop: 2}
    )
    return twiml.toString();
}

function support(){
    const twiml = new VoiceResponse();
    console.log("in support")
    const gather = twiml.gather({
        action: `${call_prefix}/onDigitCall`,
        numDigits: '1',
        method: 'POST'
    })
    gather.say(
        'To call the management team, press 1.' +
        'go back to the main menu, press the star key ',
        {voice: 'alice', language: 'en-GB', loop: 2}
    )
    return twiml.toString();
}


















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

    