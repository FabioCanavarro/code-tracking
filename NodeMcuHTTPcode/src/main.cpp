#include <Arduino.h> //done
#include <ESP8266WiFi.h> //done
#include <ESP8266HTTPClient.h> //done
#include <ArduinoJson.h> //done
#include <WiFiManager.h> //done
#include "DHT.h" //done
#include <TimeLib.h>
#include <OneWire.h>
#include <DallasTemperature.h>

/* 
*Commands 
Upload:
      C:\Users\ASUS\.platformio\penv\Scripts\platformio.exe run --target upload
Serial Monitor:
      C:\Users\ASUS\.platformio\penv\Scripts\platformio.exe device monitor

Combined command:
  cd NodeMcuHTTPcode; C:\Users\ASUS\.platformio\penv\Scripts\platformio.exe run --target upload; C:\Users\ASUS\.platformio\penv\Scripts\platformio.exe device monitor --baud 115200 
*/


//*Pins and Setup
// initiating the Pins
// receiving Pins
const int DHTPIN = D3;     //completed
const int HYGROGENATOR_PIN = D6; //completed
const int DB18S20 = D4; //completed

// output Pins
const int UAH = D5; //completed
const int water_pump = D8; //completed
const int fertilizer_pump = D7; //completed
const int growlight = D0; //completed


// DHT22 setup
DHT dht(DHTPIN, DHT22);

// DS18B20 setup
OneWire oneWire(DB18S20);
DallasTemperature sensors(&oneWire);



//*Variable
// needed config for HYGROGENATOR
const int needed_air_temp= 26; //adjustable
const int needed_soil_temp = 29; //adjustable
const int needed_humidity_percentage = 60; //adjustable
const int needed_moisture_percentage = 70; //adjustable
const int AirValue = 561;   //replace the value with value when placed in air using calibration code 
const int WaterValue = 310; //replace the value with value when placed in water using calibration code 

// needed config for Fertilizer
const int duration_before_fertlizer_in_hours=1 ;

// Misc
int soilMoistureValue = 0;
int soilmoisturepercent=0;
int currentsecond;
int tempsecond = 1800;//some delay before spraying

// Initiating variable
int hum;
int tempC;
int moisturelevel;
int soiltempc;
int soilTemp;
int airTemp;
int humidity;
int soilMoisture;
int timer = millis();









//*Functions
int readDS18B20(){
  sensors.requestTemperatures();
  float tempC = sensors.getTempCByIndex(0);
  if(tempC != DEVICE_DISCONNECTED_C) 
  {
    return tempC;
  } 
  else
  {
    Serial.println("Error: Could not read temperature data");
    return 0;
  }
  
}


int read_hygrometer(){
  soilMoistureValue = analogRead(HYGROGENATOR_PIN);  // put Sensor insert into soil
  Serial.println(soilMoistureValue);
  soilmoisturepercent = map(soilMoistureValue, AirValue, WaterValue, 0, 100);
  if(soilmoisturepercent >= 100)
  {
    return 100;
  }
  else if(soilmoisturepercent <=0)
  {
    return 0;
  }

  else if(soilmoisturepercent >0 && soilmoisturepercent < 100)
  {
    return soilmoisturepercent;
  }
  return soilmoisturepercent;
}


WiFiServer server(80);

void setup() {
  // wifi
  Serial.begin(115200);
    Serial.println("Ready");
    WiFiManager wm;

    bool res;
    res = wm.autoConnect("NodeMcuV3","pass");

    if(!res) {
        Serial.println("Failed to connect");
    } 
    else {
        Serial.println("");
        Serial.println("WiFi connected.");
        Serial.println("IP address: ");
        Serial.println(WiFi.localIP());
        server.begin();
    }
  pinMode(growlight,OUTPUT);
  pinMode(water_pump,OUTPUT);
  pinMode(fertilizer_pump,OUTPUT);
  pinMode(UAH,OUTPUT);
  sensors.begin();
  Serial.begin(115200); 
  dht.begin();
  delay(1000);
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    String url = "http://192.168.18.15:3001/api/nodeMCU-data";
    Serial.print("Connecting to: ");
    Serial.println(url);
    http.begin(client, url);
    http.addHeader("Content-Type", "application/json");

  currentsecond= second();

  // Wait a few seconds between measurements.
  

    // Check if readings have failed
    
  float hum = dht.readHumidity();
  float tempC = dht.readTemperature();
  int moisturelevel = read_hygrometer();
  int soiltempc = readDS18B20();
  



    //change it to fit into network code
    float soilTemp = soiltempc;
    float airTemp = tempC;
    float humidity = hum;
    float soilMoisture = moisturelevel;
    
    Serial.println("Readings:");
    Serial.print("Humidity: ");
    Serial.println(humidity);
    Serial.print("AirTemp: ");
    Serial.println(airTemp);
    Serial.print("Moisture: ");
    Serial.println(soilMoisture);
    Serial.print("SoilTemp: ");
    Serial.println(soilTemp);



    if (isnan(hum) || isnan(tempC)) 
  {
      Serial.print("Failed to read");
      Serial.setCursor(0,1);
      Serial.print("from DHT sensor!");
      // return;
  }   

// !Please Change so that website display error message
// Error 







    // Create JSON object
    // Create JSON object
    DynamicJsonDocument doc(200);
    doc["SoilTemp"] = soilTemp;
    doc["AirTemp"] = airTemp;
    doc["Humidity"] = humidity;
    doc["SoilMoisture"] = soilMoisture;

    String requestBody;
    serializeJson(doc, requestBody);

    Serial.println("[HTTP] POST...");
    Serial.println("Request body:");
    Serial.println(requestBody);
    
    int httpCode = http.POST(requestBody);

    if (httpCode > 0) {
      Serial.printf("[HTTP] POST... code: %d\n", httpCode);

      if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_CREATED) {
        String payload = http.getString();
        Serial.println("Response payload:");
        Serial.println(payload);
      } else {
        Serial.printf("Server returned non-OK status: %d\n", httpCode);
        Serial.println("Response headers:");
        Serial.println(http.getString());
      }
    } else {
      Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }
  

  


// !Please Change so that website display the timer
if (((currentsecond - tempsecond) /3600) >= duration_before_fertlizer_in_hours)
{
  /*
    this is where the code for spraying it will be
    turn on spray
  */

  // !Please Change so that website display the message
  digitalWrite(fertilizer_pump,HIGH);

  Serial.print("Spraying fertilizer.");
  delay(300);


  Serial.print("Spraying fertilizer..");
  delay(300);


  Serial.print("Spraying fertilizer...");
  tempsecond = currentsecond;
  digitalWrite(fertilizer_pump,LOW);
  /*
    this is where the code for spraying it will be
    turn off spray
  */
}

if (soilMoisture < needed_moisture_percentage){
  /*
    this is where the code for spraying it will be
    turn on spray
  */
 // !Please Change so that website display the message
  digitalWrite(water_pump,HIGH);
  Serial.print("Spraying water.");
  delay(300);
  Serial.print("Spraying water..");  
  delay(300);
  Serial.print("Spraying water...");
  digitalWrite(water_pump,LOW);
  /*
    this is where the code for spraying it will be
    turn off spray
  */
  delay(250);
  int moisturelevel = read_hygrometer();
}









if (tempC < needed_air_temp){
  /*
    Growlight
  */

  delay(200);
  digitalWrite(growlight,HIGH);
  float tempC = dht.readTemperature();
  
}
else if (tempC > needed_air_temp){
  /*
    turn off growlight
    turn on ultrasonic atomizer humidifier for 3 sec
  */
  delay(200);
  digitalWrite(growlight,LOW);
  float tempC = dht.readTemperature();
  
}



/*
    soil temp rebound *TODO: havent been make
*/
if (soiltempc < needed_soil_temp){

  float soiltempc = readDS18B20();

}
else if (soiltempc > needed_soil_temp){

  delay(200);
  digitalWrite(water_pump,HIGH);
  
  float soiltempc = readDS18B20();
  delay(400);
  digitalWrite(water_pump,LOW);
  
}





if (hum < needed_humidity_percentage){
  /*
  turn on ultrasonic atomizer humidifier
  */
  delay(200);
  digitalWrite(UAH,HIGH);
  float hum = dht.readHumidity();
  

}
else if (hum > needed_humidity_percentage){
  /*
  turn off ultrasonic atomizer humidifier
  turn on grow light
  */
  delay(200);
  digitalWrite(UAH,HIGH);
  float hum = dht.readHumidity();
}
}