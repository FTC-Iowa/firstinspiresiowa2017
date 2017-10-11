var functions = require('firebase-functions');

exports.bigben = functions.https.onRequest((req, res) => {
	const hours = (new Date().getHours() % 12) + 1;
	res.status(200).send(`<!doctype html>
		<head>
			<title>Time</title>
		</head>
		<body>
			${'BONG '. repeat(hours)}<br>
			req.method=${req.method}<br>
			req.body.text=${req.body.text}
		</body>
		</html>`);
});


exports.event = functions.https.onRequest((req, res) => {
	var data = "<html><body>";
	switch (req.method) {
		case "GET":
			data += "GET";
			break;
		case "POST":
			data += "POST";
			//var d = JSON.parse(req.body);
			//data += d;
			data += req.body.name;
			break;
		case "DELETE":
			data += "DELETE";
			break;
		case "PUT":
			data += "PUT";
			break;
	}
	data += JSON.stringify(req.body);
	data += req.url;
	data += req.params;
	data += "</body></html>";
	res.status(200).send(data);
});
