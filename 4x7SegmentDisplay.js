'use strict';

const Gpio = require('onoff').Gpio;

const a = new Gpio(4, 'out');
const b = new Gpio(17, 'out');
const c = new Gpio(27, 'out');
const d = new Gpio(22, 'out');
const e = new Gpio(5, 'out');
const f = new Gpio(6, 'out');
const g = new Gpio(13, 'out');
const h = new Gpio(18, 'out');
const i = new Gpio(23, 'out');
const j = new Gpio(25, 'out');
const k = new Gpio(12, 'out');
const l = new Gpio(16, 'out');

const lights = [a, b, c, d, e, f, g, h, i, j, k, l];

function showLight(i) {
  lights[i].write(1, err => {
    if (err) {
      throw err;
    }
    i += 1;
    setTimeout(() => {
      lights[i].write(0, err => {
        if (err) {
          throw err;
        }
        if (i < lights.length) {
          showLight(i);
        }
      });
    }, 5000);
  });
}

// showLight(0);
lights[0].write(1, err => {
  if (err) throw err;

  setTimeout(() => {
    lights[0].write(0, err => {
      if (err) throw err;
    });
  }, 5000);
});
