#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

#include <ArduinoJson.h>
#include <WiFiManager.h>

const char* serverUrl = "https://c925-45-126-185-184.ngrok-free.app/api/nodeMCU-data";

WiFiServer server(80);

void setup() {
    Serial.begin(115200);
    Serial.println("Ready");
    WiFiManager wm;

    bool res;
    res = wm.autoConnect("NodeMcuV3","pass");

    if(!res) {
        Serial.println("Failed to connect");
        ESP.restart();
    } 
    else {
        Serial.println("");
        Serial.println("WiFi connected.");
        Serial.println("IP address: ");
        Serial.println(WiFi.localIP());
        server.begin();
    }
}

void loop(){
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClientSecure client;
    client.setInsecure(); // Only use this for testing. In production, use proper certificate validation.
    HTTPClient https;
    

    float soilTemp = random(100);
    float airTemp = random(100);
    float humidity = random(100);
    float soilMoisture = random(100);
    
    // Create JSON object
    // Create JSON object
    DynamicJsonDocument doc(200);
    doc["SoilTemp"] = soilTemp;
    doc["AirTemp"] = airTemp;
    doc["Humidity"] = humidity;
    doc["SoilMoisture"] = soilMoisture;

    // Serialize JSON to string
    String jsonString;
    serializeJson(doc, jsonString);

    // Send HTTP POST request
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(jsonString);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println(httpResponseCode);
      Serial.println(response);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  }

  delay(2000);  // Wait for 5 seconds before sending the next data point
}