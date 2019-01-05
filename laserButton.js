'use strict';

const Gpio = require('onoff').Gpio;
const laser  = new Gpio(4, 'out');
const button = new Gpio(17, 'in', 'both');
let laserOn = 0;

button.watch((err, val) => {
  if (err) {
    console.error(err);
    return;
  }
  laserOn = laserOn ? 0 : 1;

  laser.writeSync(laserOn);

});

function onClose() {
  laser.writeSync(0);
  laser.unexport();
  button.unexport();
}

process.on('SIGINT', onClose);
