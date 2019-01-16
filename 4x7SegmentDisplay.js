'use strict';

const Gpio = require('onoff').Gpio;

const bl = new Gpio(4, 'out');
const btm = new Gpio(17, 'out');
const dot = new Gpio(27, 'out');
const br = new Gpio(22, 'out');
const ctr = new Gpio(5, 'out');
const not4th = new Gpio(6, 'out');
const tl = new Gpio(24, 'out');
const not1st = new Gpio(18, 'out');
const top = new Gpio(23, 'out');
const not2nd = new Gpio(25, 'out');
const not3rd = new Gpio(12, 'out');
const tr = new Gpio(16, 'out');

const pins = [bl, btm, dot, br, ctr, not4th, tl, not1st, top, not2nd, not3rd, tr];
const negateNums = [not1st, not2nd, not3rd, not4th];

const lights = [top, tr, br, btm, bl, tl, ctr, dot];

const letters = {
  0: [1, 1, 1, 1, 1, 1, 0, 0],
  1: [0, 1, 1, 0, 0, 0, 0, 0],
  2: [1, 1, 0, 1, 1, 0, 1, 0],
  3: [1, 1, 1, 1, 0, 0, 1, 0],
  4: [0, 1, 1, 0, 0, 1, 1, 0],
  5: [1, 0, 1, 1, 0, 1, 1, 0],
  6: [0, 0, 1, 1, 1, 1, 1, 0],
  7: [1, 1, 1, 0, 0, 0, 0, 0],
  8: [1, 1, 1, 1, 1, 1, 1, 0],
  9: [1, 1, 1, 1, 0, 1, 1, 0],
  a: [1, 1, 1, 0, 1, 1, 1, 0],
  b: [0, 0, 1, 1, 1, 1, 1, 0],
  c: [1, 0, 0, 1, 1, 1, 0, 0],
  d: [0, 1, 1, 1, 1, 0, 1, 0],
  e: [1, 0, 0, 1, 1, 1, 1, 0],
  f: [1, 0, 0, 0, 1, 1, 1, 0],
  g: [1, 1, 1, 1, 0, 1, 1, 0],
  h: [0, 1, 1, 0, 1, 1, 1, 0],
  i: [0, 1, 1, 0, 0, 0, 0, 0],
  j: [0, 1, 1, 1, 1, 0, 0, 0],
  k: [0, 1, 0, 1, 1, 1, 1, 0],
  l: [0, 0, 0, 1, 1, 1, 0, 0],
  m: [0, 0, 1, 0, 1, 0, 1, 0],
  n: [1, 1, 1, 0, 1, 1, 0, 0],
  o: [1, 1, 1, 1, 1, 1, 0, 0],
  p: [1, 1, 0, 0, 1, 1, 1, 0],
  q: [1, 1, 1, 0, 0, 1, 1, 0],
  r: [0, 0, 0, 0, 1, 0, 1, 0],
  s: [1, 0, 1, 1, 0, 1, 1, 0],
  t: [0, 0, 0, 1, 1, 1, 1, 0],
  u: [0, 1, 1, 1, 1, 1, 0, 0],
  v: [0, 1, 1, 1, 1, 1, 0, 0],
  w: [0, 0, 1, 1, 1, 0, 0, 0],
  x: [0, 1, 1, 0, 1, 1, 1, 0],
  y: [0, 1, 1, 1, 0, 1, 1, 0],
  z: [1, 1, 0, 1, 1, 0, 1, 0]
};

pins.forEach(el => {
  el.writeSync(0);
});

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
// lights[0].write(1, err => {
//   if (err) throw err;

//   setTimeout(() => {
//     lights[0].write(0, err => {
//       if (err) throw err;
//     });
//   }, 5000);
// });

function writeNumSync(i = 0, pinIndex = 0, pins = negateNums) {
  pins.forEach((p, j) => {
    const bitVal = j === pinIndex ? 0 : 1;
    p.writeSync(bitVal);
  });

  letters[i].forEach((bit, ii) => {
    lights[ii].writeSync(bit);
  });
  for (let i = 0; i < pins.length; i++) {
    if (i < 3) {
      writeNumSync(i, i, negateNums); 
    } else {
      writeNumSync(0, 0, negateNums)
    }
  }
  // pinIndex += 1;
  // i += 1;
  // if (pinIndex < 3) {
  //   writeNumSync(i, pinIndex, negateNums); 
  // } else {
  //   writeNumSync(0, 0, negateNums)
  // }
}

function loop() {
  while(true) {
    setTimeout(() => {
      writeNumSync(0, 0, negateNums);
      setTimeout(() => {
        writeNumSync(1, 1, negateNums);
        setTimeout(() => {
          writeNumSync(2, 2, negateNums);
          setTimeout(() => {
            writeNumSync(3, 3, negateNums);            
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  }
}

function getTime() {
  const d = new Date();
  return (d.getHours().toString() + d.getMinutes().toString()).split('').map(n => parseInt(n));
}

// const lightInterval = setInterval(writeNumSync, 10);
let index = 0;
const lightInterval = setInterval(() => {
  const time = getTime();
  letters[time[index]].forEach((bit, ii) => {
    lights[ii].writeSync(bit);
  });
  negateNums.forEach((p, j) => {
    const bitVal = j === index ? 0 : 1;
    p.writeSync(bitVal);
  });
  if (index < negateNums.length) {
    index += 1;
  } else {
    index = 0;
  }
}, 1);

// setTimeout(() => {
//   pins.forEach(el => {
//     el.writeSync(0);
//   });
// }, 10000);

process.on('SIGINT', () => {
  console.log('signal interrupted');
  clearInterval(lightInterval);
  pins.forEach(el => {
    el.writeSync(0);
  });
  process.exit();
});
