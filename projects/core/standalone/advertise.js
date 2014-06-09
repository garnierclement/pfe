#!/usr/bin/env node

var mdns = require('mdns2');

const NODE_SERVICE = 'node';
const PUBLISH_PORT = 32323;

function createAdvertisement()  {
    try {
        var mdns_txt_record = {
            id: "none"
        };
        
        var advertiser = mdns.createAdvertisement(mdns.tcp(NODE_SERVICE),PUBLISH_PORT, {txtRecord: mdns_txt_record});

        advertiser.on('error', function(error) {
            console.log("advertiser ERROR ", error);
            setTimeout(createAdvertisement, 30 * 1000);
        });

        process.on('SIGINT', function() {
            advertiser.exit();
        });

        advertiser.start();
    } catch (ex){
        console.log("advertiser creation ERROR ");
        setTimeout(createAdvertisement, 30 * 1000);
    }
}



createAdvertisement();