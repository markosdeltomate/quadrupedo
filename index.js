const five = require('johnny-five');
const EtherPort = require('etherport');
const board = new five.Board({ port: new EtherPort(3030), timeout: 30000 });

board.on('ready', () => {
  const quad = {
    status: 'sleep'
  };

  // Definimos la pierna derecha adelante o 1, la cadera y el fémur.
  quad.d1c = new five.Servo({ address: 0x40, controller: 'PCA9685', pin: 0, invert: true });
  quad.d1f = new five.Servo({ address: 0x40, controller: 'PCA9685', pin: 1, invert: true });
  quad.d1 = new five.Servos([quad.d1c, quad.d1f]);

  // Definimos la pierna izquierda adelante o 1, la cadera y el fémur.
  quad.i1c = new five.Servo({ address: 0x40, controller: 'PCA9685', pin: 2 });
  quad.i1f = new five.Servo({ address: 0x40, controller: 'PCA9685', pin: 3 });
  quad.i1 = new five.Servos([quad.i1c, quad.i1f]);

  // Definimos la pierna derecha detras o 2, la cadera y el fémur.
  quad.d2c = new five.Servo({ address: 0x40, controller: 'PCA9685', pin: 4 });
  quad.d2f = new five.Servo({ address: 0x40, controller: 'PCA9685', pin: 5, invert: true });
  quad.d2 = new five.Servos([quad.d2c, quad.d2f]);

  // Definimos la pierna izquierda detras o 2, la cadera y el fémur.
  quad.i2c = new five.Servo({ address: 0x40, controller: 'PCA9685', pin: 6, invert: true });
  quad.i2f = new five.Servo({ address: 0x40, controller: 'PCA9685', pin: 7 });
  quad.i2 = new five.Servos([quad.i2c, quad.i2f]);

  quad.cadera = new five.Servos([quad.d1c, quad.i1c, quad.d2c, quad.i2c]);
  quad.femures = new five.Servos([quad.d1f, quad.i1f, quad.d2f, quad.i2f]);

  quad.piernas = new five.Servos([
    quad.d1c, quad.d1f,
    quad.i1c, quad.i1f,
    quad.d2c, quad.d2f,
    quad.i2c, quad.i2f
  ]);

  const animacionPiernas = new five.Animation(quad.piernas);
  const animacionFemures = new five.Animation(quad.femures);

  quad.sleep = function sleep() {
    animacionFemures.enqueue({
      duration: 1000,
      fps: 100,
      cuePoints: [0, 0.5, 1.0], // 3 cuadros por animacion
      loop: false,
      oncomplete: function onstop() {
        quad.stop();
      },
      keyFrames: [
        [{ degrees: 0 }, { degrees: 45 }, { degrees: 180 }], // 1er motor
        [{ degrees: 0 }, { degrees: 45 }, { degrees: 180 }], // 2do motor
        [{ degrees: 0 }, { degrees: 45 }, { degrees: 180 }], // 3er motor
        [{ degrees: 0 }, { degrees: 45 }, { degrees: 180 }] // 4to motor
      ]
    });
  };

  quad.stand = () => {
    quad.cadera.to(60); // movemos los motores por grupos sin animacion
    quad.femures.to(30);
  };

  quad.stop = () => {
    animacionPiernas.stop();
    animacionFemures.stop();
  };

  board.repl.inject({ quad });
});

