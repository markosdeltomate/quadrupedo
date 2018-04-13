const five = require('johnny-five');
const EtherPort = require('etherport');
const board = new five.Board({ port: new EtherPort(3030), timeout: 30000 });

board.on('ready', () => {
  const quad = {};

  // Definimos la pierna derecha adelante o 1, la cadera y el fémur.
  quad.d1c = new five.Servo({ address: 0x40, controller: 'PCA9685', pin: 0, board });
  quad.d1f = new five.Servo({ address: 0x40, controller: 'PCA9685', pin: 1, board, invert: true});
  quad.d1 = new five.Servos([quad.d1c, quad.d1f]);

  // Definimos la pierna izquierda adelante o 1, la cadera y el fémur.
  quad.i1c = new five.Servo({ address: 0x40, controller: 'PCA9685', pin: 2, board, invert: true });
  quad.i1f = new five.Servo({ address: 0x40, controller: 'PCA9685', pin: 3, board });
  quad.i1 = new five.Servos([quad.i1c, quad.i1f]);

  // Definimos la pierna derecha detras o 2, la cadera y el fémur.
  quad.d2c = new five.Servo({ address: 0x40, controller: 'PCA9685', pin: 4, board, invert: true });
  quad.d2f = new five.Servo({ address: 0x40, controller: 'PCA9685', pin: 5, board, invert: true });
  quad.d2 = new five.Servos([quad.d2c, quad.d2f]);

  // Definimos la pierna izquierda detras o 2, la cadera y el fémur.
  quad.i2c = new five.Servo({ address: 0x40, controller: 'PCA9685', pin: 6, board });
  quad.i2f = new five.Servo({ address: 0x40, controller: 'PCA9685', pin: 7, board });
  quad.i2 = new five.Servos([quad.i2c, quad.i2f]);

  quad.cadera = new five.Servos([quad.d1c, quad.i1c, quad.d2c, quad.i2c]);
  quad.femurs = new five.Servos([quad.d1f, quad.i1f, quad.d2f, quad.i2f]);

  quad.uniones = new five.Servos([quad.cadera, quad.femurs]);

  quad.piernas = new five.Servos([
    quad.d1c, quad.d1f,
    quad.i1c, quad.i1f,
    quad.d2c, quad.d2f,
    quad.i2c, quad.i2f
  ]);

  board.repl.inject({ quad });
});

