//better performance
p5.disableFriendlyErrors = true;

//disable right click menu
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
}, false);

//***
function setup() {
  //canvas & colors
  colorMode(HSB, 360, 100, 100, 255);
  setupCanvas();
  //draw setup
  rectMode(CENTER);
  ellipseMode(CENTER);
  textAlign(CENTER, CENTER);

  setupChat();
  setupInput();
}

//***
function draw() {
  backgroundColor = color((frameCount / 2) % 360, 20, 100);
  // chatlogDiv.style('background-color: hsl(' + str(hue(backgroundColor)) + ', ' + str(0.8*saturation(backgroundColor)) + ', ' + str(0.8*brightness(backgroundColor)));
  drawBackground();

  //input
  mouse.update();
}
