"use strict";

/**
 * Created by roee on 10/01/2017.
 */
var fs = require('fs');
var request = require('request');

module.exports = class DirectAdmin {

    constructor() {
        this.token = 'dKP3RfXdt51h_L1q9KCUwmQVFkH52yy2vW';
        this.secret = 'L1vtUxg3JH4Z9Q7jSPVTG';
        this.apiUrl = 'https://api.godaddy.com';

    };

    createDNSRecord(domain, body, cb) {
        this._request('/v1/domains/' + domain + '/records', 'patch', body, cb);
    };

    _request(apiMethod, cb) {
        var requestData = {
            url: this.apiUrl + url,
            headers: {
                'Authorization': 'sso-key ' + this.token + ':' + this.secret
            },
            method: method,
            json: [body]
        };

        request(requestData.url, requestData, function (error, response, body) {
            cb();
        });
    }
};