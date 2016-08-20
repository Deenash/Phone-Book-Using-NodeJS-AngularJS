
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();
var nodemailer = require('nodemailer');
//var favicon = require('serve-favicon');
//var cors= require("cors");
//var twilio = require('twilio');



var asd = require('http').Server(app);
//var io = require('socket.io')(asd);



//io.on('connection', function(socket){
//	  socket.on('chat message', function(msg){
//	    io.emit('chat message', msg);
//	  });
//	});



console.log("app.js");


var homePage = require('./routes/homePage');

// all environments
//app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'secretSession'}));
//setting favicon
//app.use(favicon(__dirname + '/public/images/favicon.png'));

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use('/',homePage);
//app.use('/userGraph',showGraph);



app.listen(3000);
console.log("Running from port 3000");

module.exports = app;
