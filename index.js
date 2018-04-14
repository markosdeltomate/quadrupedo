const five = require('johnny-five');

const board = new five.Board();

board.on('ready', () => {
  const motorA = new five.Servo({ pin: 8, startAt: 90 });
  const motorB = new five.Servo({ pin: 9, startAt: 0 });
  const motores = new five.Servos([motorA, motorB]);

  /*
   * Servo Motores
   * Los servos pueden incluir en su configuracion un controller, como el PCA9685 con su Address,
   * tambien pueden tener posicion de inicio, rango de angulos y home position. Ademas aceptan un
   * parametro "inverted" para identificar si rotan en sentido del reloj o el inverso.
   */

  board.repl.inject({ motorA, motorB, motores });
});

