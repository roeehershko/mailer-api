"use strict";

var nodemailer = require('nodemailer');

var smtpConfig = {
    host: 'test-s7owe.amentraffic.com',
    port: 25,
    ignoreTLS: true,
    secure: false, // use SSL
    auth: {
        user: 'mailer',
        pass: 'Abc1234'
    }
};

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(smtpConfig);

// setup e-mail data with unicode symbols
var mailOptions = {
    from: '"Fred Foo ?" <mailer@test-s7owe.amentraffic.com>', // sender address
    to: 'roy@hershko.net', // list of receivers
    subject: 'Hello ', // Subject line
    text: 'Hello world ?', // plaintext body
    html: '<b>Hello world ?</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
});