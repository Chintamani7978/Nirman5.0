/*
 * Water Quality Monitor - Turbidity + DHT11 Temperature/Humidity
 * Auto-calibrating Turbidity Meter with Environmental Data
 * Arduino Nano Compatible
 */

#include <DHT.h>

const int sensorPin = A0;        // Turbidity sensor on A0
#define DHTPIN 3               // DHT11 data pin on D3
#define DHTTYPE DHT11          // Sensor type

DHT dht(DHTPIN, DHTTYPE);

float voltage, ntu, airVoltage = 0;
float temperature, humidity;
String waterQuality;
bool calibrated = false;

void setup() {
  Serial.begin(9600);
  dht.begin();
  Serial.println("=== Water Quality Monitor Starting ===");
  Serial.println("1. Hold turbidity sensor in AIR (no water)");
  Serial.println("2. Wait for 'CALIBRATION COMPLETE'");
  Serial.println("3. Test with clear water");
}

void loop() {
  // Auto-calibrate turbidity sensor once in air (first 10 seconds)
  if (!calibrated && millis() < 10000) {
    airVoltage = readAverageVoltage();
    Serial.print("Air calibration: ");
    Serial.print(airVoltage, 2);
    Serial.println("V (should be 3.0-4.5V)");
    if (airVoltage > 2.5) {
      calibrated = true;
      Serial.println("CALIBRATION COMPLETE! Now test water.");
    }
    delay(2000);
    return;
  }

  if (!calibrated) {
    Serial.println("Turbidity calibration failed - check wiring");
    delay(2000);
    return;
  }

  // Read Turbidity
  voltage = readAverageVoltage();
  float normalizedVoltage = (voltage / airVoltage) * 4.25;
  ntu = calculateNTU(normalizedVoltage);
  classifyWater(ntu);

  // Read DHT11
  temperature = dht.readTemperature();
  humidity = dht.readHumidity();

  // Display all readings
  Serial.println("========================");
  Serial.print("Raw Voltage: ");
  Serial.print(voltage, 2);
  Serial.print("V | Calib: ");
  Serial.print(normalizedVoltage, 2);
  Serial.print("V | NTU: ");
  Serial.print(ntu, 0);
  Serial.print(" | ");
  Serial.println(waterQuality);

  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println(" °C");

  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println(" %");

  Serial.println("========================");
  
  // Error handling for DHT11
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("DHT11 read error - check wiring!");
  }

  delay(2000);
}

// Average 800 readings for stable turbidity measurement
float readAverageVoltage() {
  float volt = 0;
  for (int i = 0; i < 800; i++) {
    volt += ((float)analogRead(sensorPin) / 1023.0) * 5.0;
    delayMicroseconds(100);
  }
  return volt / 800.0;
}

float calculateNTU(float v) {
  if (v < 2.5) return 3000;
  if (v > 4.2) return 0;
  return -1120.4 * square(v) + 5742.3 * v - 4352.9;
}

void classifyWater(float ntuValue) {
  if (ntuValue < 50) {
    waterQuality = "CLEAR";
  } else if (ntuValue < 300) {
    waterQuality = "CLOUDY";
  } else {
    waterQuality = "TURBID";
  }
}

float square(float x) {
  return x * x;
}