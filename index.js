const five = require('johnny-five');
const EtherPort = require('etherport');
const temporal = require('temporal');

const board = new five.Board({ port: new EtherPort(3030), timeout: 30000 });

board.on('ready', () => {
  const quad = {
    status: 'sleep'
  };
  const altura = 20;
  const centro = 90;
  const zancada = 1;
  const angulos = {
    frente: {
      cadera: [(centro - 30) * zancada, centro, (centro + 30) * zancada],
      femur: [30, 0, 50]
    },
    atras: {
      cadera: [(centro + 30) * zancada, centro, (centro - 30) * zancada],
      femur: [50, 0, 30]
    }
  };
  const easeIn = 'inQuad';
  const easeOut = 'outQuad';

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

  quad.abajo = function abajo() {
    animacionFemures.enqueue({
      duration: 1000,
      fps: 100,
      cuePoints: [0, 0.5, 1.0],
      loop: false,
      oncomplete: function onstop() {
        quad.stop();
      },
      keyFrames: [
        [{ degrees: 0 }, { degrees: 45 }, { degrees: 180 }],
        [{ degrees: 0 }, { degrees: 45 }, { degrees: 180 }],
        [{ degrees: 0 }, { degrees: 45 }, { degrees: 180 }],
        [{ degrees: 0 }, { degrees: 45 }, { degrees: 180 }]
      ]
    });
  };

  quad.caminar = function caminar(dir) {
    const a = dir === 'rev' ? 0 : 2;
    const b = dir === 'rev' ? 2 : 0;

    animacionPiernas.enqueue({
      duration: 1500,
      cuePoints: [0, 0.25, 0.5, 0.625, 0.75, 0.875, 1.0],
      loop: true,
      loopback: 0.5,
      fps: 100,
      onstop: function onstop() {
        quad.firme();
      },
      oncomplete: function oncomplete() {},
      keyFrames: [
        /* d1c, r1f */
        [
          null,
          null,
          { degrees: angulos.frente.cadera[a] },
          { degrees: angulos.frente.cadera[1] },
          { degrees: angulos.frente.cadera[b] },
          null,
          { degrees: angulos.frente.cadera[a] }
        ],
        [
          null,
          { step: altura, easing: easeOut },
          { degrees: angulos.frente.femur[a], easing: easeIn },
          { degrees: angulos.frente.femur[1] },
          { degrees: angulos.frente.femur[b] },
          { step: altura, easing: easeOut },
          { degrees: angulos.frente.femur[a], easing: easeIn }
        ],

        /* i1c, l1f */
        [
          null,
          null,
          { degrees: angulos.frente.cadera[b] },
          null,
          { degrees: angulos.frente.cadera[a] },
          { degrees: angulos.frente.cadera[1] },
          { degrees: angulos.frente.cadera[b] }
        ],
        [
          null,
          null,
          { degrees: angulos.frente.femur[b] },
          { step: altura, easing: easeOut },
          { degrees: angulos.frente.femur[a], easing: easeIn },
          { degrees: angulos.frente.femur[1] },
          { degrees: angulos.frente.femur[b] }
        ],

        /* d2c, r2f */
        [
          null,
          null,
          { degrees: angulos.atras.cadera[b] },
          null,
          { degrees: angulos.atras.cadera[a] },
          { degrees: angulos.atras.cadera[1] },
          { degrees: angulos.atras.cadera[b] }
        ],
        [
          null,
          null,
          { degrees: angulos.atras.femur[b] },
          { step: altura, easing: easeOut },
          { degrees: angulos.atras.femur[a], easing: easeIn },
          { degrees: angulos.atras.femur[1] },
          { degrees: angulos.atras.femur[b] }
        ],

        /* i2c, l2f */
        [
          null,
          null,
          { degrees: angulos.atras.cadera[a] },
          { degrees: angulos.atras.cadera[1] },
          { degrees: angulos.atras.cadera[b] },
          null,
          { degrees: angulos.atras.cadera[a] }
        ],
        [
          null,
          { step: altura, easing: easeOut },
          { degrees: angulos.atras.femur[a], easing: easeIn },
          { degrees: angulos.atras.femur[1] },
          { degrees: angulos.atras.femur[b] },
          { step: altura, easing: easeOut },
          { degrees: angulos.atras.femur[a], easing: easeIn }
        ]
      ]
    });
  };


  quad.firme = function firme() {
    const work = [
      {
        name: 'd1',
        offset: 0,
        home: angulos.frente.femur[1],
        chome: angulos.frente.cadera[1]
      },
      {
        name: 'd2',
        offset: 0,
        home: angulos.atras.femur[1],
        chome: angulos.frente.cadera[1]
      },
      {
        name: 'i1',
        offset: 0,
        home: angulos.frente.femur[1],
        chome: angulos.frente.cadera[1]
      },
      {
        name: 'i2',
        offset: 0,
        home: angulos.atras.femur[1],
        chome: angulos.frente.cadera[1]
      }
    ];

    work.forEach((pierna, i) => {
      work[i].offset = Math.abs(quad[`${pierna.name}f`].last.reqDegrees - pierna.home);
    });

    const grouped = (work[1].offset > work[3].offset) ?
      [[0, 2], [1, 3]] :
      [[1, 3], [0, 2]];

    grouped.forEach((group, i) => {
      group.forEach((leg) => {
        temporal.queue([
          {
            delay: 250 * i,
            task: () => {
              quad[`${work[leg].name}f`].to(work[leg].home + altura);
            }
          },
          {
            delay: 50,
            task: () => {
              quad[`${work[leg].name}c`].to(work[leg].chome);
            }
          },
          {
            delay: 50,
            task: () => {
              quad[`${work[leg].name}f`].to(work[leg].home);
            }
          }
        ]);
      });
    });
    quad.state = 'stand';
  };

  quad.arriba = () => {
    quad.cadera.to(60);
    quad.femures.to(30);
  };

  quad.stop = () => {
    animacionPiernas.stop();
    animacionFemures.stop();
  };

  board.repl.inject({ quad });
});

