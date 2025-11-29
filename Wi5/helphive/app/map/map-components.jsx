"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

export default function MapComponent() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetch("/api/tickets")
      .then((res) => res.json())
      .then(setTickets);
  }, []);

  return (
    <MapContainer center={[20.2961, 85.8245]} zoom={15} className="h-full w-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {tickets.map((t) => (
        <Marker key={t.id} position={[t.location_lat, t.location_lng]}>
          <Popup>
            <strong>{t.title}</strong>
            <p>{t.description}</p>
            <img src={t.image_url} width="120" />
            <p>Status: {t.status}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
