var mdns = require('mdns2');


function createAdvertisement()  {
    try {
        var mdns_txt_record = {
            name: domoConfig.domoConf.svcName,
            port: domoConfig.domoConf.svcPort
        };
        var advert = mdns.createAdvertisement(mdns.tcp(domoConfig.domoConf.svcName) , domoConfig.domoConf.svcPort, {txtRecord: mdns_txt_record});
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
}