var fechas = require("./../Utiles/fechas.js")
var Cap = require('cap').Cap;
var lista = Cap.deviceList();
lista = JSON.stringify(lista, null, 2);
// console.dir(lista);

console.log("Iniciando código de monitoreo de puertos")

var decoders = require('cap').decoders;
var PROTOCOL = decoders.PROTOCOL;

var c = new Cap();
var device = Cap.findDevice('104.129.131.178');
var filter = 'port 80 or port 4000';
var bufSize = 10 * 1024 * 1024;
var buffer = Buffer.alloc(65535);

var linkType = c.open(device, filter, bufSize, buffer);

c.setMinBytes && c.setMinBytes(0);

c.on('packet', function(nbytes, trunc) {
  console.log("--------------------------------------------------------------------------------------------------------")
  console.log("Llegó algo", fechas(new Date())) 
 // console.log('packet: tamaño ' + nbytes + ' bytes, truncado? ' + (trunc ? 'sí' : 'no'));

  // raw packet data === buffer.slice(0, nbytes)

  if (linkType === 'ETHERNET') 
  {
    var ret = decoders.Ethernet(buffer);

    if (ret.info.type === PROTOCOL.ETHERNET.IPV4) {
      console.log('Decodificando la IP');

      ret = decoders.IPV4(buffer, ret.offset);
      console.log('de: ' + ret.info.srcaddr + ' a ' + ret.info.dstaddr);

      if (ret.info.protocol === PROTOCOL.IP.TCP) {
        var datalen = ret.info.totallen - ret.hdrlen;

        console.log('Decodificando TCP');

        ret = decoders.TCP(buffer, ret.offset);
        console.log(' del puerto: ' + ret.info.srcport + ' a el puerto: ' + ret.info.dstport);
        datalen -= ret.hdrlen;
        //console.log(buffer.toString('binary', ret.offset, ret.offset + datalen));
      } else if (ret.info.protocol === PROTOCOL.IP.UDP) {
        console.log('Decodificando UDP');

        ret = decoders.UDP(buffer, ret.offset);
        console.log(' del puerto: ' + ret.info.srcport + ' a el puerto: ' + ret.info.dstport);
       // console.log(buffer.toString('binary', ret.offset, ret.offset + ret.info.length));
      } else
        console.log('No soporta IPV4: ' + PROTOCOL.IP[ret.info.protocol]);
    } else
      console.log('Unsupported Ethertype: ' + PROTOCOL.ETHERNET[ret.info.type]);
  }
});
