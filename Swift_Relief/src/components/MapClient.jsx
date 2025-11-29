// MapClient.jsx
"use client";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, Circle } from "react-leaflet"; // Import Circle
import L from "leaflet";

// 🛸 Custom drone icon
const droneIcon = new L.Icon({
  iconUrl: "/drone.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// ❤️ Custom red pointer icon for live GPS
const liveGPSIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// 🎯 Pick From/To points
function LocationPicker({ setTo, setToText }) {
  // Removed clickCount state as we only set 'to' now
  // const [clickCount, setClickCount] = useState(0);

  useMapEvents({
    click(e) {
      const coords = [e.latlng.lat, e.latlng.lng];
      // Always set 'to' coordinates on click
      setTo(coords);
      setToText(coords.join(", "));
    },
  });
  return null;
}

export default function MapClient({
  from, to, setFrom, setTo,
  fromText, setFromText,
  toText, setToText,
  route, dronePos, liveGPSCoords // Add liveGPSCoords prop
}) {
  return (
    <MapContainer
      center={[20.26, 85.83]} // Default center
      zoom={15}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* 📍 Location Picker */}
      <LocationPicker
        // Removed setFrom, setFromText as they are no longer used for map clicks
        setTo={setTo}
        setToText={setToText}
      />

      {/* 🔵 Markers & Route */}
      {from && <Marker position={from}></Marker>}
      {to && <Marker position={to}></Marker>}
      {route.length > 0 && <Polyline positions={route} color="blue" />}
      {dronePos && <Marker position={dronePos} icon={droneIcon}></Marker>}
      {liveGPSCoords && <Marker position={liveGPSCoords} icon={liveGPSIcon}></Marker>} {/* Live GPS Marker */}

      {/* Translucent radius around 'to' coordinates */}
      {to && <Circle center={to} radius={50} pathOptions={{ color: 'purple', fillColor: 'purple', fillOpacity: 0.2 }} />} {/* 50 meters radius */}
    </MapContainer>
  );
}
