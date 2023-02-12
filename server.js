//file system module to perform file operations
'use strict';
const fs = require('fs');
//import module being used (express is something that I have access to in node program)
let express = require('express');
let app = express();
let server = app.listen(process.env.PORT || 3000);
app.use(express.static('public')); //redirect users connecting to ip to public folder

//openai stuff
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

//Initialize conversation
let conversation = fs.readFileSync('saves/convo.lx', 'utf8');

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

  let convo = conversation.substring(0, conversation.length-7).replaceAll("\n", "</p><p>");
  sendInitialMessage(socket.id, convo);

  socket.on('message', function(msg) {
    sendMessage(socket.id, "User: " + msg);
    conversation += "\n\nUser: " + msg + "\n\nLexi: ";
    askAI();
  });
});

function sendMessage(source, msg) {
  io.sockets.emit('message', msg);
  addToConsole("<" + source + "> " + msg)
}

function sendInitialMessage(source, msg) {
  io.sockets.emit('message', msg);
  addToConsole("<" + source + "> Initial Message Sent")
}


async function askAI() {
  let response = await openai.createCompletion({
     model: "text-davinci-003",
     prompt: conversation,
     temperature: 1,
     max_tokens: 512,
     top_p: 1,
     frequency_penalty: 0.0,
     presence_penalty: 0.6,
     stop: ["User:"]
  });
  let r = response.data.choices[0].text;
  sendMessage("AI", "Lexi: " + r);
}


function addToConsole(msg) {
  let time = true;
  let print = '<' + getTime('fulltime') + '> ' + msg.replaceAll("\n", " [break] ");

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
