'use strict';

const Gpio = require('onoff').Gpio;

const dot = new Gpio(17, 'out')
const br = new Gpio(16, 'out');
const b = new Gpio(13, 'out');
const bl = new Gpio(12, 'out');
const tr = new Gpio(18, 'out');
const t = new Gpio(19, 'out');
const tl = new Gpio(20, 'out');
const center = new Gpio(21, 'out');

const lights = [dot, br, b, bl, tr, t, tl, center];

lights.forEach(x => {
  x.writeSync(1);
});

setTimeout(() => {
  lights.forEach(x => {
    x.writeSync(0);
    x.unexport();
  });
}, 30000);

