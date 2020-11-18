var tf = require("@tensorflow/tfjs");
const model = tf.sequential();
function entrenarModelo () {
  
}

model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

const height = tf.tensor2d([1.82, 1.70, 1.87, 1.54, 1.63], [5, 1]);
const weight = tf.tensor2d([80, 75, 85, 65, 72], [5, 1]);

// Entrenando el modelo
model.fit(height, weight, { epochs: 500 }).then(() => {
	function exportar () {
		this.predecir = (valor)=>
		{
			model.predict(tf.tensor2d([valor], [1, 1])).print();
		}
	}
	module.export = exportar;  
});

