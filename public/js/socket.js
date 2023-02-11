let socket;

//connect to server
socket = io();

//join message
socket.on('join', function(id) {
  console.log(id);
});
