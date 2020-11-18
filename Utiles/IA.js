var tf = require("@tensorflow/tfjs");
const model = tf.sequential();


function exportar () {
		this.predecir = (valor)=>
		{
			var prediccion = model.predict(tf.tensor2d([valor], [1, 1]));
			console.log(model)
			return prediccion;
		}
	}
	module.exports = new exportar();  


const Xtrain=[1.82, 1.70, 1.87, 1.54, 1.63]
const ytrain=[80, 75, 85, 65, 72]

// Construir nuestro modelo
const m = tf.variable(tf.scalar(Math.random())) //peso
const b = tf.variable(tf.scalar(Math.random())) //bias(sesgo) 

console.log("peso1"+m);
console.log("sesgo1"+b);

// Crear Función Predict
function predict(x) {
  return tf.tidy(() => {
      return m.mul(x).add(b)
  });
}

// Entrenamiento

function loss(predictions, labels) {
  return predictions.sub(labels).square().mean();
}

const learningRate = 0.0001;
const optimizer = tf.train.sgd(learningRate);

const numIterations = 1000;
const errors = []

// Ciclo de Optimización

for (let iter = 0; iter < numIterations; iter++) {
  optimizer.minimize(() => {
      const predsYs = predict(Xtrain);
      const e = loss(predsYs, ytrain);
      errors.push(e.dataSync())
      return e
  });
}

// Hacer Predicciones

console.log(errors[0])
console.log(errors[numIterations - 1])

const Xtest = tf.tensor1d([67,87.8,67,75.12,82.84,73,72.23,72.2,65,72.44,88,86.3,70,76.09,58.61,61,71.9,60,77.43,75.99,65.9,77.1,74,68.89,55,62.5,72.5,71.7,74.44,92.3,74,69,64,65.8,82.5,71.22,68,68,68.93,75,61.93,73,71.1,76,87.1,72.5,75.1,75.8,72.3,81.9,77,62,76.08,80,58.35,72.3,66.5,69,55.7,65.22,61,75.2,67.32,83,71,73.2,66.39,75.52,78,72,63,61.2,63.77,75.6,55.55,73.66,85.78,68,61.92,78,68.66,59,75.9,75.84,56.5,81,80,73.14,81.7,60,56.43,86.4,70,65.95,64,63,74,62.1,68.88,68])
const ytest = tf.tensor1d([7160,8962,7383,7961,8444,7828,7852,8173,7114,8102,9106,9278,7465,7679,5969,6619,8118,6575,8363,7940,7245,8677,7866,7616,5540,6677,8009,8122,8116,9472,8146,6903,6520,7052,8501,7700,7121,7097,7699,8195,6808,7462,7761,8202,9062,7937,7663,7954,8006,8881,8585,7178,7647,8619,6458,7683,6900,7878,5788,6823,6615,8105,6773,9096,7532,7802,7558,8171,8212,7233,7006,6644,6919,7599,5857,8293,9486,7340,6804,8325,7859,6202,8504,7584,6225,8342,8543,7911,8760,6915,6376,8825,7165,7157,6501,7184,7769,6359,7003,6832])

const predictions = predict(Xtest);
var error=tf.losses.meanSquaredError (ytest, predictions)

console.log("El Error Cuadrático Medio es "+error);
console.log("peso1"+m);
console.log("sesgo1"+b);

console.log("predicciones",predictions);