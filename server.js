var http	= require('http');
var fs 		= require('fs');
var express = require('express');
var app 	= express();
var $		= require('jquery').create();
var qs		= require('querystring');

var server = http.createServer(
	function (request, response) {
		
		// When dealing with CORS (Cross-Origin Resource Sharing)
		// requests, the client should pass-through its origin (the
		// requesting domain). We should either echo that or use *
		// if the origin was not passed.
		var origin = (request.headers.origin || '*');
		
		console.log(origin);
		
		// Check to see if this is a security check by the browser to
		// test the availability of the API for the client. If the
		// method is OPTIONS, the browser is checking to see what
		// HTTP methods (and properties) have been granted to the client
		if(request.method.toUpperCase() === "OPTIONS") {
			
			// Echo back the Origin (calling domain) so that the client
			// is granted access to make subsequent requests to the API.
			response.writeHead(
				"204",
				"No Content",
				{
					"access-control-allow-origin" : origin,
					"access-control-allow-credentials" : "true",
					"access-control-allow-methods" : "GET, POST, PUT, DELETE, OPTIONS",
					"access-control-allow-headers" : "content-type, accept, origin",
					"access-control-max-age" : 10,
					"content-length" : 0
				}
			);
			return(response.end());
		}
		if(request.method.toUpperCase() === "GET") {
			
			var requestBodyBuffer = [];
			request.on('data', function (chunk) {requestBodyBuffer.push(chunk);});
			request.on('end', function () {
				var requestBody = requestBodyBuffer.join("");
			});
			
			var message = "Settings Saved";
			
			response.writeHead(
				"200",
				"OK",
				{
					"access-control-allow-origin" : origin,
					"content-type" : "text/plain",
					"content-length" : message.length
				}
			);
			
			return(response.end(message));
		}
		if(request.method.toUpperCase() === "POST") {
			var query = '';
			var $data = {};
			var requestBodyBuffer = [];
			request.on("data", function (chunk) {query += chunk;});
			request.on("end", function () {
				$data = qs.parse(query);
				console.log($data.background);
			});
			
			var message = "Settings Saved"
			
			response.writeHead(
				"200",
				"OK",
				{
					"access-control-allow-origin" : origin,
					"content-type" : "text/plain",
					"content-length" : message.length
				}
			);
			
			return(response.end(message));
		}
	}
);

server.listen(8000);
console.log("Node.js listening on port 8000");

app.post('/savesettings', function (req, res){ console.log("here"); console.log(req.query.background);
	$.get('config.xml', function (data) {
		$(data).find('settings').each(function () {
			//$(this).find('background > color').text(req.body.option-background-color);
			//$(this).find('background > image').text(req.body.option-background-image);
			//if(req.body.option-startup-enabled) {
			//	$(this).find('startup > enabled').text("true");
			//} else {
			//	$(this).find('startup > enabled').text("false");
			//}
			//if(req.body.option-splash-enabled) {
			//	$(this).find('startup > splash > enabled').text("true");
			//} else {
			//	$(this).find('startup > splash > enabled').text("false");
			//}
			//$(this).find('startup > splash > image').text(req.body.option-splash-image);
			//$(this).find('security > password').text(req.body.option-password);
		});
	});
	res.send(200, 'Settings Saved');
});

//app.listen(8000);
//console.log("Running on port 8000");