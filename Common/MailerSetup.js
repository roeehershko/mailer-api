"use strict";

/**
 * Created by roee on 10/01/2017.
 */
var random = require("randomstring");
var async = require('async');

var DigitalOcean = require('./Adapters/DigitalOcean'),
    DOAdapter = new DigitalOcean();

var GoDaddy = require('./Adapters/GoDaddy'),
    GDAdapter = new GoDaddy();

module.exports = class MailerSetup {

    // Setup mailing server
    constructor(name, machines) {

        this.servers = [];
        this.serversNames = [];

        // Prepare server names
        this.generateNames(name, machines);
    };

    start() {
        var self = this;
        async.waterfall([
            // Step 1 - Create Machines
            function (cb) {
                DOAdapter.createMachines(self.servers.length, self.serversNames, function (machines) {
                    self.servers = machines;
                    console.log('Step 1 - Done');
                    cb();
                });
            },
            
            // Step 2 - Create GD DNS
            function (cb) {
                console.log('Step 2 started');
                async.eachLimit(self.servers, 5, function (server, dnsCb) {

                    var createDNSData = {
                        type: 'A',
                        name: server.name,
                        data: server.ip
                    };

                    GDAdapter.createDNSRecord('amentraffic.com', createDNSData, function () {
                        dnsCb();
                    });

                }, function () {
                    cb();
                }, function (err) {
                    console.log(err);
                });
       
            }
        ], function () {
            console.log('Servers Created !');
        });
    };

    generateNames(name, machines) {
        // Reset Servers
        this.servers = [];

        // Creating Slugs
        for (var i = 1; i <= machines; i++)
        {
            var sName = name + '-' + random.generate(5).toLowerCase();
            this.servers.push({
                name: name + '-' + sName
            });

            this.serversNames.push(sName);
        }
    };
};