var tf = require("@tensorflow/tfjs");
const model = tf.sequential();


model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

function exportar () {
		this.predecir = (valor)=>
		{
			var prediccion = model.predict(tf.tensor2d([valor], [1, 1])).dataSync();
			//console.log(model)
			return prediccion;
		}
		this.entrenarModelo = (x,y) => {
			const height = tf.tensor2d(x, [x.length, 1]);
			const weight = tf.tensor2d(y, [y.length, 1]);
			model.fit(height, weight, { epochs: 500 }).then(() => {});
		}
	}
	module.exports = new exportar();  

