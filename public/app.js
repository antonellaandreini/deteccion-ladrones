$(document).ready(function() { 
	$.material.init();


	var socket 	= io();
	var video = new Video();
	var alerts = new Alerts();
	var sensibilidad = new Sensibilidad();

	function Sensibilidad(){
		var actual = 0;
		var coef = 0;
		var MAX = 2.0;
		var that = this;

		socket.on('init',function(coef){
			init(coef);
		});

		function init(coef){
			actual = (1-coef/MAX)*100;
			renderSlider();
			$('.change-coef').click(function(){
				if($(this).is('[data-add]')){
					that.inc();
				}else{
					that.dec();
				}
			});
		}

		this.inc = function(){
			if(actual<90){
				actual += 10;
				sendCoef();
			}
		};
		this.dec = function(){
			if(actual>10){
				actual -= 10;
				sendCoef();
			}
		};

		function getCoef(){
			return (1-actual/100)*MAX;
		}

		function renderSlider(){
			$('#coef-progress').width(actual+'%');
		}

		function sendCoef(){
			renderSlider();
			socket.emit('coefChange',getCoef());
		}
	}

	function Alerts(){
		var cant = 0;
		var that = this;

		socket.on('detection',function(msg){
			that.add();
		});

		this.add = function(){
			if(cant>2) return;
			var alert = $(createAlert());
			alert.appendTo('#alerts-wrapper').show(300);
			cant++;
			setTimeout(function(){
				alert.remove();
				cant--;
			},5000);
		}

		function createAlert(){
			return `<div class="alert alert-dismissible alert-warning" style="display: none;">
						<button type="button" class="close" data-dismiss="alert">×</button>
						<h4>¡Atención!</h4>
						<p>Movimiento detectado</p>
					</div>`;
		}
	}

	function Video(){
		var image 	= new Image();
		var canvas 	= document.getElementById("video-canvas");
		var ctx 	= canvas.getContext("2d");

		resizeCanvas();
		$(window).on("resize", function(){                      
			resizeCanvas();
		});

		socket.on('frame',function(data){
			drawImage(ctx,data);
		});

		function resizeCanvas(){
			var w = $('#canvas-wrapper').width();
			canvas.width = w;
			canvas.height = w/1.33;
			ctx.rect(0,0,canvas.width,canvas.height);
			ctx.stroke();
		}

		function drawImage(ctx, buffer) {
			var uint8Arr = new Uint8Array(buffer);
			var str = String.fromCharCode.apply(null, uint8Arr);
			var base64String = btoa(str);
			image.onload = function() {
				ctx.drawImage(this, 0,0, canvas.width, canvas.height);
			};
			image.src = 'data:image/png;base64,' + base64String;
		}

	}

	
});