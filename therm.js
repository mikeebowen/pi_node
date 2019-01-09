const Gpio = require('onoff').Gpio;
const useGPIO = (gpio_array, index, value) => gpio_array[index].writeSync(value);
const usePIN = (pin, value) => pin.writeSync(value);

var ds18b20 = require('ds18b20');
ds18b20.sensors(function(err, ids) {
// got sensor IDs ...
});

var segmentIO = [];
var dp = 7;

//LED pin == GPIO == segment 
// 11     ==  24  == a
// 07     ==  21  == b
// 04     ==  13  == c
// 02     ==  05  == d
// 01     ==  22  == e
// 10     ==  12  == f
// 05     ==  19  == g
// 03     ==  06  == dp

var segments = [ 24, 21, 13, 5, 22, 12, 19, 6 ];

// set all segment leds to off initially.
for (i = 0; i <= 7; i++)
{
	segmentIO.push(new Gpio(segments[i], 'out'));
	useGPIO(segmentIO, i, 0);
}

var digitIO = [];

//LED pin == GPIO == digit
// 12     ==  23  == digit 1
// 09     ==  16  == digit 2
// 08     ==  20  == digit 3
// 06     ==  26  == digit 4

var digits = [ 23, 16, 20, 26 ];


for (i = 0; i <= 3; i++)
{
	digitIO.push(new Gpio(digits[i], 'out'));
	useGPIO(digitIO, i, 1);
}

var numInv = {' ':[1,1,1,1,1,1,1],
'0':[0,0,0,0,0,0,1],
'1':[1,0,0,1,1,1,1],
'2':[0,0,1,0,0,1,0],
'3':[0,0,0,0,1,1,0],
'4':[1,0,0,1,1,0,0],
'5':[0,1,0,0,1,0,0],
'6':[0,1,0,0,0,0,0],
'7':[0,0,0,1,1,1,1],
'8':[0,0,0,0,0,0,0],
'9':[0,0,0,0,1,0,0],
'a':[0,0,0,1,0,0,0],
'b':[1,1,0,0,0,0,0],
'c':[0,1,1,0,0,0,1],
'd':[1,0,0,0,0,1,0],
'e':[0,1,1,0,0,0,0],
'f':[0,1,1,1,0,0,0],
'g':[0,0,0,0,1,0,0]}

process.on('SIGINT', function() {
    console.log("Caught interrupt signal!");
    process.exit();
});

function getTimeString()
{
	var d = new Date();
	var h = d.getHours();
	var m = d.getMinutes();
	var hr = h.toString();
	var mn = m.toString();
	if (h < 10)
		hr = "0" + hr;
	if (m < 10)
		mn = "0" + mn;
	return hr + mn;
}

var gTemp = 0;
var celsius = true;

function displayLoop()
{
	//var curHHMM = getTimeString();
	var gpio = 0;
	var temperature = gTemp.toFixed(1).toString();
	var startdigit = 0;
	var unit = 'f';
	if (temperature.length == 3)
		temperature = ' ' + temperature;
	if (celsius)
		unit = 'c';
	var rawtemp = temperature.slice(0,2) + temperature.slice(3) + unit;

	for (digit = 0; digit <= 3; digit++)
	{
		for ( loop = 0; loop <= 6; loop++)
		{
			if (numInv[rawtemp.substring(digit, digit+1)][loop] == 0)
				gpio = 1;
			else 
				gpio = 0;
			useGPIO(segmentIO, loop, gpio);
		}
		if (digit == 1)
			useGPIO(segmentIO, dp, 1);
		else 
			useGPIO(segmentIO, dp, 0);
		useGPIO(digitIO, digit, 0);
		for(spin = 0; spin <= 100000; spin++)
			spin= spin;
		useGPIO(digitIO, digit, 1); 
	}

}

setInterval(function () {
	ds18b20.temperature('28-041721237dff', function(err, value) {
		console.log('Current temp is: ' + value);
		if (celsius == false)
		{
			gTemp = value;
			celsius = true;
		}
		else {
			gTemp = value * 9 / 5 + 32;
			celsius = false;
		}
		var sTemp = gTemp.toString();
		console.log('string temp is: ' + sTemp);
	})}, 5000);

setInterval(displayLoop, 10 );
