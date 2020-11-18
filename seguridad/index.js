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

var IPs = [];


c.on('packet', function(nbytes, trunc) {
  //console.log("--------------------------------------------------------------------------------------------------------")
  //console.log("Llegó algo", fechas(new Date())) 
 // console.log('packet: tamaño ' + nbytes + ' bytes, truncado? ' + (trunc ? 'sí' : 'no'));

  // raw packet data === buffer.slice(0, nbytes)

  if (linkType === 'ETHERNET') 
  {
    var ret = decoders.Ethernet(buffer);

    if (ret.info.type === PROTOCOL.ETHERNET.IPV4) {
      //console.log('Decodificando la IP');

      ret = decoders.IPV4(buffer, ret.offset);
      //console.log('de: ' + ret.info.srcaddr + ' a ' + ret.info.dstaddr);

      actualizarIPs(ret.info.srcaddr);

      if (ret.info.protocol === PROTOCOL.IP.TCP) {
        var datalen = ret.info.totallen - ret.hdrlen;

        //console.log('Decodificando TCP');

        ret = decoders.TCP(buffer, ret.offset);
        //console.log(' del puerto: ' + ret.info.srcport + ' a el puerto: ' + ret.info.dstport);
        datalen -= ret.hdrlen;
        //console.log(buffer.toString('binary', ret.offset, ret.offset + datalen));
      } else if (ret.info.protocol === PROTOCOL.IP.UDP) {
        //console.log('Decodificando UDP');

        ret = decoders.UDP(buffer, ret.offset);
        //console.log(' del puerto: ' + ret.info.srcport + ' a el puerto: ' + ret.info.dstport);
       // console.log(buffer.toString('binary', ret.offset, ret.offset + ret.info.length));
      } else
        {
          //console.log('No soporta IPV4: ' + PROTOCOL.IP[ret.info.protocol]);
        }
    } else {
      //console.log('Unsupported Ethertype: ' + PROTOCOL.ETHERNET[ret.info.type]);
    }
  }
});


function actualizarIPs (ip) {
  if(ip!='104.129.131.178')
  {
    var incluye = false;
    IPs.map(a=>
    {
      if(a.ip == ip)
      {
        incluye = true;
      }
    });
    if(incluye==false)
    {
      IPs.push({ip:ip,cant:1});
    }
    else
    {
      const ind = IPs.findIndex(a=>ip==a.ip);
      IPs[ind].cant = IPs[ind].cant + 1;
    }
  }
  
}

setInterval(()=>
{
  console.log(IPs);
  IPs.map((a)=>
  {
    if(a.cant > 500)
    {
      banear(a.ip):
    }
  })
  IPs = []
},5000);
 

function banear (ip) {
  console.log("Baneando a ", ip)
  const shell = require('shelljs')
  shell.exec('ufw insert 1 deny from '+ip+' to any port 80')
  shell.exec('ufw insert 1 deny from '+ip+' to any port 4000')
  setTimeout(()=>{desbanear(ip)},20000);
}

function desbanear (ip) {
  console.log("Desbaneando a ", ip);
  // shell.exec('ufw insert 1 deny from '+ip+' to any port 80')
  // shell.exec('ufw insert 1 deny from '+ip+' to any port 4000')
}
// import * as tf from "@tensorflow/tfjs";
// document.getElementById("hola").innerText = "Hola";

// // Usamos un modelo secuencial para regresión lineal
// const model = tf.sequential();
// model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

// // Seleccionamos pérdida y optimizador para modelo
// model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

// // Altura y peso como los datos de entrenamiento
// const height = tf.tensor2d([1.82, 1.70, 1.87, 1.54, 1.63, 1.72], [6, 1]);
// const weight = tf.tensor2d([80, 75, 85, 65, 72, 75], [6, 1]);

// // Entrenando el modelo
// model.fit(height, weight, { epochs: 500 }).then(() => {
//   // Usamos modelo para predeccir peso para una altura de 183 cm
//   model.predict(tf.tensor2d([1.80], [1, 1])).print();
// });

