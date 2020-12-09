//Importar código de la seguridad y vigilación de puertos
//require("./seguridad/");
console.log(process.argv);
var tiempo = 0;
process.argv.map(a=>
{
	if(!Number.isNaN(a))
	{
		tiempo = a;
		console.log("Llegó un tiempo de:",tiempo)
	}
})
if(tiempo == 0)
{
	console.log("No llegó nada")
}