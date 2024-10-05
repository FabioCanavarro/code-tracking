#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "EVELYN 4G";
const char* password = "EVELYN5588";


void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  Serial.println("Connected to WiFi");
  Serial.print("ESP8266 IP address: ");
  Serial.println(WiFi.localIP());
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








    //change it
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
  
  delay(2000);
}