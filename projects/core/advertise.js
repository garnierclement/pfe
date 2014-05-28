#!/usr/bin/env node

var mdns = require('mdns2');

function createAdvertisement()  {
    try {
        var mdns_txt_record = {
            id: "none"
        };
        var advert = mdns.createAdvertisement(mdns.tcp("node"),32323, {txtRecord: mdns_txt_record});
        advert.on('error', function(error) {
            console.log("advert ERROR ", error);
            setTimeout(createAdvertisement, 30 * 1000);
        });
        advert.start();
    } catch (ex){
        console.log("advert creation ERROR ");
        setTimeout(createAdvertisement, 30 * 1000);
    }
}

createAdvertisement();