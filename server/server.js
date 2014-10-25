var mongo = require("mongodb").MongoClient,

express = require('express'),
app = express(),
http = require('http').Server(app),
io = require('socket.io')(http);

mongo.connect("mongodb://127.0.0.1/chat", function (err, db) {
	if (err)
		throw err;
	console.log("mongo db connection established.");

	io.on('connection', function (socket) {

		var col = db.collection('messages'),
		sendStatus = function (s) {
			socket.emit('status', s);
		};
		/*
		col.remove({}, function(e) {
		console.log(e);
		});*/
		col.find().limit(100).sort({
			_id : 1
		}).toArray(function (e, res) {
			if (e)
				throw e;
			socket.emit('output', res);
		});
		console.log(socket.conn.id, 'a user connected');

		socket.on('input', function (msg) {
			var name = msg.name,
			msgText = msg.message,
			wsPattern = /^\s*$/;

			if (wsPattern.test(name) || wsPattern.test(msg)) {
				console.log("invalid input");
				sendStatus("Name and Message is required");
			} else {
				col.insert({
					name : name,
					message : msgText
				}, function (e) {
					io.emit("output", [msg]);
					sendStatus({
						message : "Message Sent",
						clear : true
					});
					console.log("inserted");
				});
			}
			//console.log('message: ' + msg);
			//io.emit('chat message', socket.conn.id + msg);
		});
		socket.on('disconnect', function () {
			console.log('user disconnected');
		});
	});
});

app.get('/', function (req, res) {
	//res.send('<h1>Hello world</h1>');
	//console.log(req.url, req.route, req.get);
	//  for(var x in req) console.log(x);
	res.sendFile(__dirname + '/public/index.html');
});

app.use('/img', express.static(__dirname + '/public/img'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));

http.listen(process.env.port || 80, function (e) {
	if (e)
		throw e;
	console.log('listening on *:' + (process.env.port || 80));
});
