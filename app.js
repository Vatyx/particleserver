var express = require("express");
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

var EventEmitter = require("events");
var eventEmitter = new EventEmitter.EventEmitter();

app.set("port", process.env.PORT || 3000);

app.post("/", function(req, res) {
    console.log(req.body);
    res.json({foo: "bar"});
    eventEmitter.emit("data");
});

app.listen(app.get("port"), function() {
    console.log("Listening on port", app.get("port"));
});

var net = require('net');

var server = net.createServer(function(socket) {
    socket.write('Echo server\r\n');
    socket.pipe(socket);
    eventEmitter.addListener("data", function() {
        console.log("emitted!");
        socket.write('Echo server\r\n');
        socket.pipe(socket);
    });
    socket.on("close", function() {
        eventEmitter.removeAllListeners("data");
    });
});

server.listen(5000, 'localhost');
