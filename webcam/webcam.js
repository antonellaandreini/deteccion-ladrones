const cv = require('opencv');
const conf = require('../conf');
const streaming = require('../udp/udpclient')(conf.streaming.port);
const detect = require('../detection/detection');

const DELAY = 1000 / conf.webcam.fps;
const WIDTH  = conf.webcam.width;
const HEIGHT = conf.webcam.height;

const camara = new cv.VideoCapture(0); 

camara.setWidth(WIDTH);
camara.setHeight(HEIGHT);



var Last = undefined;

function readCamara(){
	camara.read(function(err,img){
		if(err) throw err;
		detect(img);
		streaming.send(img.toBuffer(),function(){
			setTimeout(readCamara,DELAY);
		});
	});
}

readCamara();
