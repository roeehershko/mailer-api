"use strict";

/**
 * Created by roee on 10/01/2017.
 */
var fs = require('fs');
var DigitalOcean = require('do-wrapper');
var api = new DigitalOcean('4f7df95ffbc6e52360a60e9884e4e1eba1ce94b98cfa6668dd2685ea1954364b');

module.exports = class DigitalOcean {

    constructor() {
        this.machineCacheDir = 'Cache/Machines.json';
        this.image = 22278266;
        this.machines = [];
        this._loadMachineCache();


    }

    _loadMachineCache() {
        var self = this;
        var data = fs.readFileSync(this.machineCacheDir);
        data = data.toString() || '[]';

        self.machines = JSON.parse(data);
    }

    _updateMachineCache() {
        var file = fs.createWriteStream(this.machineCacheDir);
        file.write(JSON.stringify(this.machines, null, 2));
        file.end();
    }

    _addMachineCache(data) {

        this.machines.push(data);
        this._updateMachineCache();
    }

    createMachine(name, cb) {

        var self = this;
        var data = {
            "name": name,
            "region": "ams3",
            "size": "1gb",
            "image": self.image,
            "ssh_keys": null,
            "backups": false,
            "ipv6": false,
            "user_data": null,
            "private_networking": false,
            "volumes": null,
            "tags": [
                "mails"
            ]
        };

        api.dropletsCreate(data, function (err, data) {
            setTimeout(function () {
                api.dropletsGetById(data.body.droplet.id, function (err, res) {
                    var machineData = {
                        id: data.body.droplet.id,
                        name: name,
                        ip: res.body.droplet.networks.v4[0].ip_address
                    };

                    self._addMachineCache(machineData);
                    cb(machineData);
                })
            }, 1000);
        });
    }

    createMachines(machines, names, cb) {
        var created = 0;
        var self = this;
        var machinesReady = [];
        for(var i = 1; i <= machines; i++) {
            (function () {
                var machineName = names[i - 1];
                self.createMachine(machineName, function (machineData) {
                    created += 1;
                    machinesReady.push(machineData);

                    if (created == names.length) {
                        cb(machinesReady);
                    }
                })
            }());
        }
    }

    clearMachines() {
        for(var k in this.machines)
        {
            var machine = this.machines[k];
            api.dropletsDelete(machine.id);
        }

        this.machines = [];
        this._updateMachineCache();
    }
};