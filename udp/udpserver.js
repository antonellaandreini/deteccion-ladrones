const dgram = require('dgram');

function createServer(PORT,onData){
	const server = dgram.createSocket('udp6');
	server.on('error', (err) => {
	  server.close();
	});
	
	server.on('message',onData);

	server.on('listening', () => {
	  const address = server.address();
	  console.log('UDP server corriendo',address);
	});

	server.bind(PORT);

}

module.exports = createServer;