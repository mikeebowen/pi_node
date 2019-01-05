'use strict';
const Gpio = require('onoff').Gpio;
const laser = new Gpio(4, 'out');
const interval = setInterval(blinkLaser, 500);

function blinkLaser() {
  if (laser.readSync === 0) {
    laser.writeSync(1);
  } else {
    laser.writeSync(0);
  }

  function endBlink() {
    clearInterval(interval);
    laser.writeSync(0);
    laser.unexport();
  }

  setTimeout(endBlink, 5000);
}
