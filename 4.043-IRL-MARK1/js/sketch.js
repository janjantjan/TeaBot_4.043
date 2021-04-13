const { ipcRenderer } = require("electron");  // allows p5 to talk to main and discordbot
const serialPort = require('serialport');
var sp = null;

let speed = 1;
let x = -40;
let y = 0;


function setup() {
  createCanvas(800, 600);
  y = height / 2;

 listSerialPort();
 
}



function draw() {
  background(220);
  x += speed;
  if (x - 40 > width) {
    x = -40;
  }
  ellipse(x, y, 80, 80);
}


function keyPressed() {

  if (key == 'A' || key == 'a') {
      console.log("p5 ok");
  }

  if (key == 'B' || key == 'b') {
      messageToDiscord('hello from p5');
  }

  if (key == 'H' || key == 'h') {
    sendToArduino('H');
  }

  if (key == 'L' || key == 'l') {
    sendToArduino('L');
  }  

}

// Sends message to Discord
function messageToDiscord(data) {    
  ipcRenderer.send('messageFromP5',data);
}

// receives messages from Discord, and passes it to Arduino
ipcRenderer.on("fromDiscordBot", (event, message) => {
  console.log(message); // prints message so we can see it

  sendToArduino(message);
});

// receives thumbsup from Discord, and passes it to Arduino
ipcRenderer.on("thumbsup", (event, message) => {
  //console.log(message);

  sendToArduino('H');
});

// receives thumbsdown from Discord, and passes it to Arduino
ipcRenderer.on("thumbsdown", (event, message) => {
  //console.log(message);

  sendToArduino('L');
});


function listSerialPort() {

  // to list serial port in terminal, use these:
  // ls /dev/tty.*
  // ls /dev/cu.*

  // list serial ports 
  /*serialPort.list().then(
    ports => ports.forEach(console.log),
    err => console.error(err)
  )
  */


  //initialize serialport with 115200 baudrate.
   sp = new serialPort('/dev/tty.usbserial-1410', {
    baudRate: 115200,
  });

  sp.write( "start!", function(err) {
    if (err) {
        return console.log('Error on write: ', err.message);
    }
    console.log('message written');
  });

}

// output data via serial port to Arduino
function sendToArduino(data) {

  sp.write(data);

}

