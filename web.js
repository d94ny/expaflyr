var http = require('http');
var port = process.env.PORT || 3000;

http.createServer(function(request,response) {
	console.log("Received request");
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Hello Danny !");
	response.end();

}).listen(port);
console.log("Running on "+port+" ...");