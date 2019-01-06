'use strict';

const Gpio = require('onoff').Gpio;

const e = new Gpio(17, 'out');
const d = new Gpio(16, 'out');
const c = new Gpio(13, 'out');
const dp = new Gpio(12, 'out');
const g = new Gpio(18, 'out');
const f = new Gpio(19, 'out');
const a = new Gpio(20, 'out');
const b = new Gpio(21, 'out');

const lights = [e, d, c, dp, g, f, a, b];

lights.forEach(x => {
  x.writeSync(1);
  setTimeout(() => {
    x.writeSync(0);
  }, 1000);
});

setTimeout(() => {
  lights.forEach(x => {
    x.writeSync(0);
    x.unexport();
  });
}, 30000);

