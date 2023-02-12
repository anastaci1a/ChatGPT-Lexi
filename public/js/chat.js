let messageInput, chatlogDiv, chatlogP;

function setupChat() {
  //chat textbox
  messageInput = createInput();
  messageInput.id('messageInput');

  //chatlog div
  chatlogDiv = createElement('div', '');
  chatlogDiv.id('chatlogDiv');

  //pressing enter to send
  $(document).keypress(function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
      msgSend();
    }
  });

  //send message to server
  function msgSend() {
    let msg = messageInput.value();
    if (messageInput.value() != '') {
      socket.emit('message', msg); //send to server
      messageInput.value(''); //clear message box
    }
  }

  //receive message/confirmation from server
  socket.on('message', function(msg) {
    chatlogP = createP(msg);

    chatlogP.style('font-family: Arial, Helvetica, sans-serif;');
    chatlogP.parent('chatlogDiv');
    //scroll down once a message is received
    let objDiv = document.getElementById('chatlogDiv');
    objDiv.scrollTop = objDiv.scrollHeight;
  });

  elementPos();
}

function elementPos() {
  let inputW = width/2;
  messageInput.position(width/2 - inputW/2, height - 2.5*padding);
  messageInput.size(inputW, padding);

  let divW = width/2;
  let divH = height - padding*5;
  chatlogDiv.position(width/2 - divW/2, padding);
  chatlogDiv.size(divW, divH);
}

function userInTextbox() {
  return messageInput.value().length > 0;
}
