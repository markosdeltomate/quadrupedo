const five = require('johnny-five');

const board = new five.Board();

board.on('ready', () => {
  const motorA = new five.Servo({ pin: 8, startAt: 90 });
  const motorB = new five.Servo({ pin: 9, startAt: 0 });
  const motores = new five.Servos([motorA, motorB]);


  board.repl.inject({ motorA, motorB, motores });
});

