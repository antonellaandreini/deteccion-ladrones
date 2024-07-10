const dgram = require('dgram');
const MSG_MAXSIZE = 65526;

function createClient(PORT){
	const client = dgram.createSocket('udp6');


	function sendAny(data,length,callback){

		if(length>MSG_MAXSIZE){
			console.log('descartando paquete demasiado grande',length);
			if(callback) callback();
			return;
		}

		client.send(data,0,length,PORT,false,function(err,bytes){
			if(err) throw err;
			if(callback) callback(bytes);
		});
	}
	
	return {
		send : function(data,lengthOrcallback,callback){
			if(lengthOrcallback && typeof lengthOrcallback == 'function'){
				sendAny(data,data.byteLength,lengthOrcallback);
			}else if(lengthOrcallback){
				sendAny(data,lengthOrcallback,callback);
			}else{
				sendAny(data,data.byteLength,callback);
			}
		}
	};
}
module.exports = createClient;