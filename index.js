//Importar código de la seguridad y vigilación de puertos
require("./seguridad/");
console.log("Iniciando servidor");

const path = require("path");
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

var app = express();

var puerto = process.env.PORT || "4000";

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,"/public")));

app.use(cookieParser());

app.use((req, res, next) => {
  next();
});

const rutas = express.Router();
rutas.get("/",(req,res)=>
{
  res.send("Bienvenido")
});
rutas.get('/Saludo/:nombre',(req,res)=>
{
  if(req.params.nombre!=undefined)
    res.send("Hola " + req.params.nombre)
  else
    res.send("No me dijiste tu nombre");
});
rutas.post("/Post",(req,res)=>
{
  console.log("Me llegaron estos datos:", req.body);
  res.send("Gracias, ya me llegaron los datos")
})

app.use(rutas)
//app.listen(puerto, '104.225.141.251', ()=>
app.listen(puerto, ()=>
{
  console.log("Servidor lanzado en el puerto:",puerto);
});
