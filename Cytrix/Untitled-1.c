#include<Wire.h>
#include<Adafruit_MPU6050.h>
#include<Adafruit_Sensor.h>
#include<arduinoFFT.h>

// ============ FFT CONFIGURATION ============
#define SAMPLES 256              // Must be power of 2
#define SAMPLING_FREQUENCY 100   // Hz (100 samples per second)

// Parkinsonian tremor frequency range
#define PARKINSONIAN_LOW 4.0     // Hz
#define PARKINSONIAN_HIGH 6.0    // Hz

// ============ GLOBAL OBJECTS ============
Adafruit_MPU6050 mpu;

// FFT arrays
double vReal[SAMPLES];
double vImag[SAMPLES];
ArduinoFFT<double> FFT = ArduinoFFT<double>(vReal, vImag, SAMPLES, SAMPLING_FREQUENCY);

// Timing variables
unsigned long samplingPeriod;
unsigned long microseconds;

// ============ SETUP ============