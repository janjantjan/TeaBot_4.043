#include <Servo.h> 

const int ledPin = 9; // the pin that the LED is attached to
int incomingByte;      // a variable to read incoming serial data into


int pos = 0;    // variable to store the servo position
Servo myservo;  // create servo object to control a servo
int BUTTON_PIN = 7;
int currentState ; 
int downHandle = 0; 
int acceptMessage = 0;
bool pourMessage = false;

void setup() {
  // initialize serial communication:
  Serial.begin(115200);
  // initialize the LED pin as an output:
  pinMode(ledPin, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  myservo.attach(8);
   
}

void loop() {
  
 // see if there's incoming serial data:
  currentState = digitalRead(BUTTON_PIN);
  Serial.println(currentState);
  
  if(currentState == LOW){
    digitalWrite(ledPin, HIGH);
    //Serial.println("dH " + downHandle);
    downHandle = 50;
    acceptMessage++;
  }else{
    digitalWrite(ledPin, LOW);
    downHandle++ ;
    acceptMessage = 0;
    //Serial.println("dH " + downHandle);
  }
  delay(100);
  
  if(downHandle>=100){
     myservo.write(0); 
     delay(25);  
     downHandle = 0;  
     pourMessage = true;
  }

  if(acceptMessage==10){
    Serial.println("PourAccepted");
    
 
  }

  if(pourMessage){
    if(currentState == LOW){
       Serial.println("PourSent");
       pourMessage = false;
       acceptMessage = 11;
       delay(100);
    }
  }
  
  if (Serial.available() > 0) {
    // read the oldest byte in the serial buffer:
    incomingByte = Serial.read();
    
    // if it's a capital H (ASCII 72), handle off:
    if (incomingByte == 'H') {
      myservo.write(0); 
      delay(25);                       
    }
    
    // if it's an L (ASCII 76) handle on:
    if (incomingByte == 'L') {
      myservo.write(90);              
      delay(25);                       
    }
  }
}

  
  

  