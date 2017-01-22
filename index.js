"use strict";

var MailerSetup = require('./Common/MailerSetup');


var mailer = new MailerSetup('test', 1);

mailer.start(function (data) {
    console.log(data);
});