const conf = {
	webcam:{
		port:8080,
		width:480,
		height:480,
		fps:25
	},
	detection: {
		port:8081,
		coeficiente:1.2
	},
	streaming:{
		port:8082	
	},
	webserver:{
		port:8090
	},
	storage:{}
}

module.exports = conf;