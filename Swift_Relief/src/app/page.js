// page.js

"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MapClient = dynamic(() => import("../components/MapClient"), {
  ssr: false,
});

export default function Home() {
  // 🌍 States
  const [started, setStarted] = useState(false);
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [route, setRoute] = useState([]);
  const [dronePos, setDronePos] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [mapKey, setMapKey] = useState(0);
  const [gpsPollingInterval, setGpsPollingInterval] = useState(null); // New state for GPS polling

  // Serial Port States
  const [serialPortPath, setSerialPortPath] = useState("/dev/cu.usbserial-0001");
  const [baudRate, setBaudRate] = useState(115200);
  const [isPortOpen, setIsPortOpen] = useState(false);
  const [sentData, setSentData] = useState("");
  const [receivedData, setReceivedData] = useState([]);
  const [sendInput, setSendInput] = useState("");
  const [liveGPSCoords, setLiveGPSCoords] = useState(null); // New state for live GPS

  const routeIndexRef = useRef(0);
  const currentRouteIndex = useRef(0);

  // Helper function to calculate distance between two lat/lon points in meters (Haversine formula approximation)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres
    return d;
  };

  // Effect to automatically update 'From' input when live GPS data is received
  useEffect(() => {
    if (liveGPSCoords) {
      const formattedCoords = `${liveGPSCoords[0].toFixed(6)}, ${liveGPSCoords[1].toFixed(6)}`;
      setFromText(formattedCoords);
      setFrom(liveGPSCoords); // Ensure 'from' state is also updated
    }
  }, [liveGPSCoords, setFromText, setFrom]);

  // Effect to update the route when 'from' or 'to' coordinates change
  useEffect(() => {
    if (from && to) {
      handleGetRoute();
    }
  }, [from, to]);

  // 🚀 Functions
  const handleGetRoute = () => {
    if (!from || !to) return;
    const r = [from, to, from];
    setRoute(r);
    setDronePos(from);
    routeIndexRef.current = 0;
  };

  const handleSimulate = () => {
    if (!route.length || !isPortOpen) return alert("⚠️ No route set or serial port not open!");

    const totalDuration = 10000; // Total duration for the simulation (e.g., 10 seconds)
    const numSteps = 100; // Number of steps for smoother animation
    const stepDuration = totalDuration / numSteps;

    let currentStep = 0;
    let startPoint = route[0];
    let endPoint = route[1];

    const id = setInterval(() => {
      if (!startPoint || !endPoint) { // Added null check for startPoint/endPoint
        clearInterval(id);
        setIntervalId(null);
        alert("Error: Route points are undefined during simulation.");
        return;
      }

      if (currentRouteIndex.current < route.length - 1 || currentStep <= numSteps) {
        const progress = currentStep / numSteps;
        const interpolatedLat = startPoint[0] + (endPoint[0] - startPoint[0]) * progress;
        const interpolatedLon = startPoint[1] + (endPoint[1] - startPoint[1]) * progress;
        const currentDronePos = [interpolatedLat, interpolatedLon];
        setDronePos(currentDronePos);

        // Continuous radius check at each interpolation step
        if (to && currentDronePos) {
          const distanceToTarget = calculateDistance(currentDronePos[0], currentDronePos[1], to[0], to[1]);
          const dropRadius = 50; // 50 meters
          console.log(`Simulation: DronePos: ${currentDronePos[0]}, ${currentDronePos[1]}, To: ${to[0]}, ${to[1]}, Distance: ${distanceToTarget.toFixed(2)}m, DropRadius: ${dropRadius}m`);

          if (distanceToTarget <= dropRadius) {
            handleDrop(); // Automatically trigger drop
            clearInterval(id);
            setIntervalId(null);
            setDronePos(to); // Snap drone to 'to' location for visual confirmation
            alert("🚁 Drone reached destination radius. Item dropped automatically!");

            // Smoothly return drone to 'from' coordinates after 2 seconds
            setTimeout(() => {
              if (!from || !to) { // Ensure from and to are defined
                alert("Error: 'From' or 'To' coordinates are undefined for return journey.");
                return;
              }

              const returnDuration = 3000; // 3 seconds for return journey
              const returnNumSteps = 60; // 60 steps for smoother return
              const returnStepDuration = returnDuration / returnNumSteps;

              let currentReturnStep = 0;
              const returnIntervalId = setInterval(() => {
                if (currentReturnStep <= returnNumSteps) {
                  const progress = currentReturnStep / returnNumSteps;
                  // Interpolate from 'to' back to 'from'
                  const interpolatedLat = to[0] + (from[0] - to[0]) * progress;
                  const interpolatedLon = to[1] + (from[1] - to[1]) * progress;
                  setDronePos([interpolatedLat, interpolatedLon]);
                  currentReturnStep++;
                } else {
                  clearInterval(returnIntervalId);
                  alert("🚁 Drone returned to 'From' coordinates smoothly.");
                  setDronePos(from); // Ensure it lands exactly on 'from'
                }
              }, returnStepDuration);
            }, 2000); // 2-second delay before starting return journey
            return;
          }
        }

        currentStep++;
        if (currentStep > numSteps) {
          // Move to next segment if not already at the end
          currentRouteIndex.current++;
          if (currentRouteIndex.current < route.length - 1) {
            startPoint = route[currentRouteIndex.current];
            endPoint = route[currentRouteIndex.current + 1];
            currentStep = 0;
          } else {
            // Reached the end of the entire route without dropping
            clearInterval(id);
            setIntervalId(null);
            alert("🚁 Simulation finished, drone did not enter drop radius.");
          }
        }
      } else {
        clearInterval(id);
        setIntervalId(null);
        alert("🚁 Simulation finished.");
      }
    }, stepDuration);
    setIntervalId(id);
  };

  const handleOpenPort = async () => {
    try {
      const res = await fetch("/api/serial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path: serialPortPath, baudRate: parseInt(baudRate) }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setIsPortOpen(true);
        // Re-enable automatic GPS polling
        const interval = setInterval(handleReadSerialData, 3000); // Poll every 3 seconds
        setGpsPollingInterval(interval);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to open serial port:", error);
      alert("Failed to connect to serial port.");
    }
  };

  const handleClosePort = async () => {
    try {
      const res = await fetch("/api/serial", {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setIsPortOpen(false);
        // Stop GPS polling when port is closed
        if (gpsPollingInterval) {
          clearInterval(gpsPollingInterval);
          setGpsPollingInterval(null);
        }
        setLiveGPSCoords(null); // Clear live GPS data
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to close serial port:", error);
      alert("Failed to close serial port.");
    }
  };

  const handleSendSerialData = async () => {
    if (!sendInput) return;
    try {
      const res = await fetch("/api/serial", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: sendInput }),
      });
      const data = await res.json();
      if (res.ok) {
        setSentData(sendInput);
        setSendInput("");
        alert(data.message);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to send data:", error);
      alert("Failed to send data to serial port.");
    }
  };

  const handleReadSerialData = async () => {
    try {
      if (!isPortOpen) {
        console.log("Serial port not open, skipping read.");
        return; // Only attempt to read if port is open
      }

      const res = await fetch("/api/serial");
      console.log("API Response Status:", res.status);
      const data = await res.json();
      console.log("API Response Data:", data);

      if (res.ok) {
        const receivedString = data.data; // Now expects a single string
        console.log("Received Raw String:", receivedString);

        if (receivedString && receivedString.startsWith("GPS_LIVE:")) {
          console.log("String starts with GPS_LIVE:", receivedString);
          const coordsString = receivedString.substring("GPS_LIVE:".length);
          console.log("Coords String after substring:", coordsString);
          const [lat, lon] = coordsString.split(",").map(parseFloat);
          console.log("Parsed Lat, Lon:", lat, lon);

          if (!isNaN(lat) && !isNaN(lon)) {
            setLiveGPSCoords([lat, lon]);
            setDronePos([lat, lon]); // Update drone position to live GPS
            setFrom([lat, lon]); // Set 'from' to live GPS
            setReceivedData((prev) => [...prev, `Live GPS: Lat ${lat.toFixed(6)}, Lon ${lon.toFixed(6)}`]);
            console.log(`Received Live GPS: Lat ${lat}, Lon ${lon}. Setting 'from' and 'dronePos' to this.`); // Log for debugging
          } else {
            console.warn(`Received malformed GPS data, skipping: ${receivedString}. Parsed: Lat=${lat}, Lon=${lon}`);
            setReceivedData((prev) => [...prev, `Malformed GPS: ${receivedString}`]);
          }
        } else if (receivedString) { // Only process if receivedString is not empty and not GPS_LIVE
          setReceivedData((prev) => [...prev, receivedString]);
          console.log(`Received non-GPS data or empty string: ${receivedString}`);
        }
      } else {
        console.error(`Error reading serial data API: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to fetch or parse serial data:", error);
    }
  };

  const handleShowLiveGPSOnMap = () => {
    if (liveGPSCoords) {
      setDronePos(liveGPSCoords); // Show drone at live GPS
      setFrom(liveGPSCoords); // Set 'from' to live GPS
      alert(`Displaying live GPS on map: Lat ${liveGPSCoords[0].toFixed(6)}, Lon ${liveGPSCoords[1].toFixed(6)}`);
    } else {
      alert("No live GPS data available yet. Please open the port and ensure GPS data is being received.");
    }
  };

  const handleStop = () => {
    if (intervalId) clearInterval(intervalId);
    // Also clear GPS polling interval if it was active
    if (gpsPollingInterval) {
      clearInterval(gpsPollingInterval);
      setGpsPollingInterval(null);
    }
  };

  const handleConfirm = async () => {
    if (!isPortOpen) return alert("⚠️ Serial port is not open!");
    if (!from || !to) return alert("⚠️ Please select both From and To coordinates before confirming!");

    const dataToSend = `COORD:FROM:${from[0]},${from[1]}:TO:${to[0]},${to[1]}`;

    try {
      const res = await fetch("/api/serial", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: dataToSend }),
      });
      const responseData = await res.json();
      if (res.ok) {
        setSentData(dataToSend);
        alert("✅ Coordinates sent successfully!");
      } else {
        alert(`Error sending coordinates: ${responseData.error}`);
      }
    } catch (error) {
      console.error("Failed to send coordinates:", error);
      alert("❌ Error sending coordinates!");
    }
  };

  const handleDrop = async () => {
    if (!isPortOpen) return alert("⚠️ Serial port is not open!");
    try {
      const res = await fetch("/api/serial", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: "DROP" }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("📦 Item drop command sent successfully!");
      } else {
        alert(`Error sending drop command: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to send drop command:", error);
      alert("❌ Error sending drop command!");
    }
  };

  const handleReset = () => {
    setFrom(null);
    setTo(null);
    setFromText("");
    setToText("");
    setRoute([]);
    setDronePos(null);
    if (intervalId) clearInterval(intervalId);
    setMapKey((prev) => prev + 1);
  };

  // ✍️ Handle manual input
  const handleFromInput = (e) => {
    setFromText(e.target.value);
    const v = e.target.value.split(",").map((n) => parseFloat(n.trim()));
    if (v.length === 2 && !isNaN(v[0]) && !isNaN(v[1])) setFrom(v);
  };

  const handleToInput = (e) => {
    setToText(e.target.value);
    const v = e.target.value.split(",").map((n) => parseFloat(n.trim()));
    if (v.length === 2 && !isNaN(v[0]) && !isNaN(v[1])) setTo(v);
  };

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black 
                 flex flex-col items-center justify-center p-8 text-white relative overflow-hidden"
    >
      {/* 🌌 Background stars */}
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.15)_1px,transparent_1px)] 
                  [background-size:20px_20px] animate-pulse"
      ></div>

      {/* 🚁 Intro Loader */}
      <AnimatePresence>
        {!started && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/60"
          >
            <div className="relative bg-gray-900/80 border border-gray-700 rounded-2xl shadow-2xl p-10 text-center max-w-md overflow-hidden">
              {/* Drone orbit animation */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              >
                <div className="relative w-64 h-64 rounded-full border border-purple-500/40">
                  <motion.div
                    className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12"
                    animate={{ rotate: -360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 6,
                      ease: "linear",
                    }}
                  >
                    <Image
                      src="/drone.png" // 👉 Place your drone.png inside /public
                      alt="Drone Loader"
                      width={48}
                      height={48}
                      className="drop-shadow-lg"
                    />
                  </motion.div>
                </div>
              </motion.div>

              {/* Loader content */}
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-yellow-300 mb-6 relative z-10">
                Want to deliver medicines faster?
              </h1>
              <button
                onClick={() => setStarted(true)}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-green-400 to-teal-500 hover:opacity-90 shadow-lg text-lg font-semibold relative z-10"
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌠 Main App */}
      {started && (
        <>
          {/* Title */}
          <h1
            className="text-6xl font-extrabold 
  bg-gradient-to-r from-emerald-400 via-amber-400 to-red-600 
  bg-clip-text text-transparent 
  drop-shadow-[0_0_35px_rgba(245,158,11,0.7)] 
  mb-10 tracking-tight font-['Poppins']"
          >
            Swift Relief
          </h1>

          {/* 🚀 Instructions */}
          <div className="w-full max-w-3xl bg-gradient-to-b from-gray-900/90 to-black/80 border border-purple-700/50 rounded-2xl shadow-2xl p-6 space-y-4 mb-6">
            <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 drop-shadow-md">
              📖 How to Use
            </h2>
            <div className="w-20 h-1 mx-auto bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full"></div>
            <ul className="mt-4 space-y-3 text-gray-300 text-center">
              <li>
                <span className="font-semibold text-yellow-300">
                  🟡 First click
                </span>{" "}
                → <span className="text-white">From</span>
              </li>
              <li>
                <span className="font-semibold text-green-400">
                  🟢 Second click
                </span>{" "}
                → <span className="text-white">To</span>
              </li>
              <li className="text-gray-400">
                Or manually enter coordinates in the input boxes below ⬇️
              </li>
            </ul>
            <div className="mt-4 text-center text-sm sm:text-base text-gray-400">
              Workflow:
              <br />
              <span className="font-semibold text-purple-400">
                ✨ Get Route
              </span>{" "}
              →
              <span className="font-semibold text-blue-400">
                {" "}
                🚁 Simulate Drone
              </span>{" "}
              →
              <span className="font-semibold text-red-400">
                {" "}
                ⏹ Stop / Confirm
              </span>{" "}
              →<span className="font-semibold text-teal-400"> 📦 Drop</span> →
              <span className="font-semibold text-pink-400"> 🔄 Reset</span>
            </div>
          </div>

          {/* Inputs */}
          <div className="flex gap-4 w-full max-w-3xl mb-4">
            <input
              type="text"
              placeholder="From (lat,lng)"
              value={fromText}
              onChange={handleFromInput}
              className="flex-1 px-8 py-2 rounded-full bg-gray-800 text-white border border-gray-600"
            />
            <input
              type="text"
              placeholder="To (lat,lng)"
              value={toText}
              onChange={handleToInput}
              className="flex-1 px-8 py-2 rounded-full bg-gray-800 text-white border border-gray-600"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <button
              onClick={handleGetRoute}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90"
            >
              Get Route
            </button>
            <button
              onClick={handleSimulate}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
            >
              Simulate Drone
            </button>
            <button
              onClick={handleStop}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:opacity-90"
            >
              Stop
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:opacity-90"
            >
              Confirm
            </button>
            <button
              onClick={handleDrop}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 hover:opacity-90"
            >
              Drop
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-red-500 to-pink-600 hover:opacity-90"
            >
              Reset
            </button>
          </div>

          {/* Serial Communication Controls */}
          <div className="w-full max-w-3xl bg-gradient-to-b from-gray-900/90 to-black/80 border border-teal-700/50 rounded-2xl shadow-2xl p-6 space-y-4 mb-6">
            <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-green-500 drop-shadow-md">
              🔌 Serial Communication
            </h2>
            <div className="w-20 h-1 mx-auto bg-gradient-to-r from-blue-400 to-green-500 rounded-full mb-4"></div>

            <div className="flex flex-wrap justify-center gap-3 mb-4">
              <input
                type="text"
                placeholder="Serial Port Path (e.g., /dev/cu.usbserial-0001)"
                value={serialPortPath}
                onChange={(e) => setSerialPortPath(e.target.value)}
                className="flex-1 px-4 py-2 rounded-full bg-gray-800 text-white border border-gray-600 min-w-[250px]"
              />
              <input
                type="number"
                placeholder="Baud Rate (e.g., 115200)"
                value={baudRate}
                onChange={(e) => setBaudRate(e.target.value)}
                className="flex-1 px-4 py-2 rounded-full bg-gray-800 text-white border border-gray-600 min-w-[150px]"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-3 mb-4">
              <button
                onClick={handleOpenPort}
                disabled={isPortOpen}
                className={`px-6 py-2 rounded-full ${isPortOpen ? "bg-gray-600" : "bg-gradient-to-r from-lime-500 to-green-600 hover:opacity-90"}`}
              >
                Open Port
              </button>
              <button
                onClick={handleClosePort}
                disabled={!isPortOpen}
                className={`px-6 py-2 rounded-full ${!isPortOpen ? "bg-gray-600" : "bg-gradient-to-r from-red-500 to-rose-600 hover:opacity-90"}`}
              >
                Close Port
              </button>
            </div>

            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="Data to send"
                value={sendInput}
                onChange={(e) => setSendInput(e.target.value)}
                className="flex-1 px-4 py-2 rounded-full bg-gray-800 text-white border border-gray-600"
                disabled={!isPortOpen}
              />
              <button
                onClick={handleSendSerialData}
                disabled={!isPortOpen || !sendInput}
                className={`px-6 py-2 rounded-full ${!isPortOpen || !sendInput ? "bg-gray-600" : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:opacity-90"}`}
              >
                Send Data
              </button>
            </div>

            <div className="flex justify-center mb-4">
              <button
                onClick={handleReadSerialData} // This function will be auto-triggered, but can also be pressed manually
                disabled={!isPortOpen}
                className={`px-6 py-2 rounded-full ${!isPortOpen ? "bg-gray-600" : "bg-gradient-to-r from-yellow-500 to-orange-600 hover:opacity-90"}`}
              >
                Get GPS Data
              </button>
            </div>

            <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700 max-h-40 overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-200 mb-2">Received Data:</h3>
              {receivedData.length === 0 ? (
                <p className="text-gray-400">No data received yet.</p>
              ) : (
                <ul className="list-disc list-inside text-gray-300">
                  {receivedData.map((data, index) => (
                    <li key={index}>{data}</li>
                  ))}
                </ul>
              )}
            </div>

            {liveGPSCoords && (
              <div className="text-sm text-center text-green-400 font-semibold mt-2">
                Live GPS: {liveGPSCoords[0].toFixed(6)}, {liveGPSCoords[1].toFixed(6)}
              </div>
            )}

            {sentData && (
              <div className="text-sm text-gray-400 text-center">
                Last Sent: <span className="font-mono text-purple-300">{sentData}</span>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="w-full max-w-5xl h-[600px] shadow-lg rounded-xl overflow-hidden">
            <MapClient
              key={mapKey}
              from={from}
              to={to}
              // Removed setFrom as map clicks no longer set 'from'
              setTo={setTo}
              fromText={fromText}
              // Removed setFromText as map clicks no longer set 'from'
              toText={toText}
              setToText={setToText}
              route={route}
              dronePos={dronePos}
              liveGPSCoords={liveGPSCoords} // Pass liveGPSCoords to MapClient
            />
          </div>
        </>
      )}
    </main>
  );
}
