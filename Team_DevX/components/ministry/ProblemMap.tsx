import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import L from "leaflet";
import { Spinner } from "@/components/ui/spinner"; // Assuming you have a spinner component

// Fix for default marker icon issue with webpack
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;


const fetchProblemsWithLocation = async () => {
  const { data, error } = await supabase
    .from("problems")
    .select("id, title, description, category, latitude, longitude")
    .not("latitude", "is", null)
    .not("longitude", "is", null);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const ProblemMap = () => {
  const { data: problems, isLoading, error } = useQuery({
    queryKey: ["problemsWithLocation"],
    queryFn: fetchProblemsWithLocation,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="large" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading map data: {error.message}</div>;
  }

  // Default center for the map if no problems are available
  const defaultCenter: [number, number] = [20.5937, 78.9629]; // Centered on India

  return (
    <MapContainer
      center={defaultCenter}
      zoom={5}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%", borderRadius: "inherit" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {problems?.map((problem) => (
        <Marker key={problem.id} position={[problem.latitude, problem.longitude]}>
          <Popup>
            <div className="font-bold">{problem.title}</div>
            <div>Category: {problem.category}</div>
            <p>{problem.description.substring(0, 100)}...</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default ProblemMap;
