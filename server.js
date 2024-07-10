const express = require('express');
const app = express();
const Sequelize = require('sequelize');
require('sequelize-values')(Sequelize);
var models  = require('./models');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const conf = require('./conf');
const udpserver = require('./udp/udpserver');
const spawn = require('child_process').spawn;
const sharp = require('sharp');
var fs = require('fs');
const formidable = require('formidable');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
const nodemailer = require('nodemailer');

app.get('/', function(req, res){
  res.sendFile(__dirname+'/public/index.html');
});


//Si se clickea el link a 'Historico' se renderiza la pagina y se le pasa la lista de archivos en la carpeta photos 
app.get('/historico', function(req, res){
  fs.readdir('./public/photos', function(err, items){
    res.render('historico.jade',{
      img: items.reverse().slice(0,18)  //Muestra solo las ultimas 18 fotos
    })
  })
});

//Si se clickea el link a 'Configurar mail' se renderiza la pagina
app.get('/Configurar_mail', function(req, res){
  res.render('configurar_mail.jade',{})
});

app.post('/Configurar_mail',function(req,res){
  procesarForm(req,res);
  });


function procesarForm(req,res){
var form = new formidable.IncomingForm();
form.parse(req, function (err, fields, files) {
  console.log('hola ' + fields.input_email +' '+ fields.input_check);  
  models.Mail.create({contenido: fields.input_email, check: fields.input_check}).then(
   usu => {
      console.log( usu.contenido + ' ' + usu.check); 
  res.render('configurar_mail.jade',{})
});
});
}


function onDectionMsg(data,rinfo){
  io.sockets.volatile.emit('detection',data.toString());
}
 
function onStreamFrame(data,rinfo){
	sharp(data).jpeg({quality:70}).toBuffer().then(jpeg => {
  		io.sockets.volatile.emit('frame',jpeg);
	});
}

//Cuando un cliente se conecta al servidor, carga el ultimo coeficiente de sensibilidad. Cuando el usuario cambia el valor del coeficiente, lo guarda en la base de datos
io.on('connection',function(socket){
  models.Conf.findOne({order: [['updatedAt', 'DESC']]}).then(config => { 
    console.log(config.get('coeficiente')); 
    socket.emit('init',config.get('coeficiente'));
  })
  socket.on('coefChange',function(coef){
    models.Conf.create({coeficiente: coef }).then (
      conf => {
           console.log('Se cambio el coeficiente' + coef);
      }
  )
  });
});


udpserver(conf.detection.port,onDectionMsg);
udpserver(conf.streaming.port,onStreamFrame);

http.listen(conf.webserver.port, function(){
  console.log('server http en ',conf.webserver.port);
});

//Crea un proceso para la webcam y otro para la deteccion de movimiento.
var p_w = spawn('node',['webcam.js'],{cwd:'./webcam'},onExit);
var p_d = spawn('node',['detection.js'],{cwd:'./detection'},onExit);

function onExit(error){
  console.log(error);
}
