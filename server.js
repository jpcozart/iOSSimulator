var simulator = simulator || {};

(function (server, http, fs, $, qs, jstoxml, undefined) {
	simulator.server = http.createServer(
		function (request, response) { 
			//Setup private variables
			var origin = (request.headers.origin || '*');
			var query = '';
			var $data = {};
			var message = '';
			//CORS Preflight permissions check
			if(request.method.toUpperCase() === "OPTIONS") { response.writeHead( "204", "No Content", { "access-control-allow-origin" : origin, "access-control-allow-credentials" : "true", "access-control-allow-methods" : "GET, POST, PUT, DELETE, OPTIONS", "access-control-allow-headers" : "content-type, accept, origin", "access-control-max-age" : 10, "content-length" : 0 }); return(response.end()); }
			//Handle GET requests
			if(request.method.toUpperCase() === "GET") {
				request.on('data', function (chunk) {query += chunk;});
				request.on('end', function () {
					$data = qs.parse(query);
					switch($data.action)
					{
						case "something":
							break;
						default:
							return(response.end(Send404()));
					}
				});
			}
			if(request.method.toUpperCase() === "POST") {
				request.on("data", function (chunk) {query += chunk;});
				request.on("end", function () {
					$data = qs.parse(query);
					switch($data.action)
					{
						case "savesettings":
							SaveSettings();
							return(response.end(message));
							break;
						default:
							return(response.end(Send404()));
					}
				});
			}
			
			function Send404() {
				response.writeHead(
					"404",
					"Not Found",
					{
						"access-control-allow-origin" : origin,
						"content-type" : "text/plain",
						"content-length" : message.length
					}
				);
				return;
			}
			
			function SaveSettings() {
				fs.readFile('config.xml', function (err, data) {
					if(err) {throw err;}	
					var $xml = $(data.toString()).find('settings').each(function () {
						$(this).find('background > color').text($data.backgroundColor);
						$(this).find('background > image').text($data.backgroundImage);
						if($data.startupEnabled === "on") {
							$(this).find('startup > enabled').text("true");
						} else {
							$(this).find('startup > enabled').text("false");
						}
						if($data.splashEnabled === "on") {
							$(this).find('startup > splash > enabled').text("true");
						} else {
							$(this).find('startup > splash > enabled').text("false");
						}
						$(this).find('startup > splash > image').text($data.splashImage);
						$(this).find('security > password').text($data.password);
					});
					
					console.log($xml.xml());
					
					fs.writeFile('config.xml', data.toString(), function (err) {
						if(err) {throw err;}
					});
				});
				
				message = "Saved Settings";
				
				response.writeHead(
					"200",
					"OK",
					{
						"access-control-allow-origin" : origin,
						"content-type" : "text/plain",
						"content-length" : message.length
					}
				);
				return;
			}
		}
	);
}(simulator.server = simulator.server || {}, require('http'), require('fs'), require('jquery'), require('querystring'), require('jstoxml')));

simulator.server.listen(8000);
console.log("Node.js listening on port 8000");
