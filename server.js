//file system module to perform file operations
'use strict';
const fs = require('fs');
//import module being used (express is something that I have access to in node program)
let express = require('express');
let app = express();
let server = app.listen(process.env.PORT || 3000);
app.use(express.static('public')); //redirect users connecting to ip to public folder
//favicon
app.use('/favicon.ico', express.static('public/data/images/favicon.ico'));

//console log of all messages
let consolelog = [];

//server started message
addToConsole('Server started...');

//socket.io
let socket = require('socket.io');
let io = socket(server);

//server connected message
addToConsole('Server connected.');

//connections with clients
io.sockets.on('connection', function(socket) {
  let joined = false;
  addToConsole('New Connection: ' + socket.id);
  io.to(socket.id).emit('join', socket.id);
});


function addToConsole(msg) {
  let time = true;
  let print = '<' + getTime('fulltime') + '> ' + msg;

  //print & save
  console.log(print);
  consolelog.push(print);
}

function getTime(mode) {
  //get time for console time
  let date_ob = new Date();
  // current date
  // adjust 0 before single digit date
  let year = date_ob.getFullYear(); // current year
  let month = ('0' + (date_ob.getMonth() + 1)).slice(-2); // current month
  let date = ('0' + date_ob.getDate()).slice(-2); // current date
  let hours = date_ob.getHours(); // current hours
  let minutes = date_ob.getMinutes(); // current minutes
  let seconds = ('0' + date_ob.getSeconds()).slice(-2); //current seconds
  // returns repending on mode
  let r = '';
  if (mode == 'fulltime') {
    r = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
  }
  if (mode == 'date') {
    r = year + '-' + month + '-' + date;
  }
  return r;
}
