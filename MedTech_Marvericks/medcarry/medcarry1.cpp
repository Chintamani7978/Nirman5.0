#include "thingProperties.h"
#include "Preferences.h"
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <math.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define SCREEN_ADDRESS 0x3C
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

//--PINS--
#define RelayPin1 15
#define ButtonPin1 4
#define ButtonPin2 5
#define wifiLed    2
#define THERMISTOR_PIN 34

// --- Thermistor Parameters ---
const float R_FIXED = 10000.0;   // 10kΩ fixed resistor
const float BETA = 3950.0;       // Beta coefficient
const float To = 298.15;         // 25°C in Kelvin
const float Ro = 10000.0;        // 10kΩ at 25°C

// --- Voltage supply compensation ---
const float V_SUPPLY = 3.1;      // Measured actual supply voltage (battery powered)

// --- State ---
Preferences pref;
float currentTemp = 0;

// --- Button debounce ---
bool button1Prev = HIGH;
bool button2Prev = HIGH;
unsigned long lastButton1Press = 0;
unsigned long lastButton2Press = 0;
const unsigned long debounceDelay = 50;

// --- Timing ---
unsigned long lastTempReadTime = 0;
const unsigned long tempReadInterval = 1000;  // 1 second

void setup() {
  Serial.begin(115200);
  delay(1500);

  initProperties();
  ArduinoCloud.begin(ArduinoIoTPreferredConnection);
  setDebugMessageLevel(2);
  ArduinoCloud.printDebugInfo();

  pref.begin("Relay_State", false);

  pinMode(RelayPin1, OUTPUT);
  pinMode(wifiLed, OUTPUT);
  pinMode(ButtonPin1, INPUT_PULLUP);
  pinMode(ButtonPin2, INPUT_PULLUP);

  digitalWrite(wifiLed, LOW);
  digitalWrite(RelayPin1, !cooler); //ACTIVE LOW

  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    while (true);
  }
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.display();

  // Load preferences
  set_temp = pref.getFloat("setTemp", 25);
  auto_Mode = pref.getBool("Mode", true);
  cooler = pref.getBool("Cooler", false);
  digitalWrite(RelayPin1, !cooler);
}

void loop() {
  ArduinoCloud.update();
  unsigned long currentMillis = millis();
  if (currentMillis - lastTempReadTime >= tempReadInterval) {
    lastTempReadTime = currentMillis;
    readTemperature();
    temperature_sensor = currentTemp;  // Update Arduino Cloud variable
  }

  handleButtons();

  if (auto_Mode) {
    handleCooling();
  } else {
    digitalWrite(RelayPin1, !cooler);  // Manual mode control
  }

  displayData();
}

void readTemperature() {
  const int samples = 10;
  long adcSum = 0;

  for (int i = 0; i < samples; i++) {
    adcSum += analogRead(THERMISTOR_PIN);
    delay(5);
  }

  int adcValue = adcSum / samples;
  float voltage = adcValue * V_SUPPLY / 4095.0;
  float resistance = (voltage * R_FIXED) / (V_SUPPLY - voltage);
  float temperatureK = 1.0 / ((1.0 / To) + (1.0 / BETA) * log(resistance / Ro));
  float temperatureC = temperatureK - 273.15;
  currentTemp = temperatureC - 4.2;  // Optional calibration offset

  Serial.print("ADC: ");
  Serial.print(adcValue);
  Serial.print("  Voltage: ");
  Serial.print(voltage, 3);
  Serial.print(" V  Temp: ");
  Serial.print(currentTemp, 2);
  Serial.println(" °C");
}

void handleCooling() {
  if (currentTemp > set_temp) {
    cooler = true;
  } else {
    cooler = false;
  }

  digitalWrite(RelayPin1, !cooler);  // Active LOW
  pref.putBool("Cooler", cooler);
}

void displayData() {
  display.clearDisplay();

  display.setTextSize(2);
  display.setCursor(0, 7);
  display.println("----------");

  display.setCursor(42, 20);
  display.print((int)currentTemp);
  display.print((char)247);  // Degree symbol
  display.println("C");

  display.setCursor(0, 34);
  display.println("----------");

  display.setTextSize(1);
  display.setCursor(35, 57);
  display.print("SetTemp:");
  display.print((int)set_temp);
  display.print((char)247);
  display.println("C");

  display.setCursor(20, 45);
  if (auto_Mode) {
    display.print("Automatic Mode");
  } else {
    display.print("Manual Mode ");
    display.setCursor(0, 0);
    display.print("Cooler: ");
    display.print(cooler ? "ON " : "OFF");
  }

