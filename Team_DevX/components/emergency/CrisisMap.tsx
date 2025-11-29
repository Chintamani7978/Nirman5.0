import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, MapPin, Zap, CheckCircle2, Circle } from "lucide-react";
import { useState, useEffect } from "react";

interface EmergencyIncident {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  severity: string;
  incident_type: string;
}

interface CrisisZone {
  id: string;
  latitude: number;
  longitude: number;
  radius_km: number;
  risk_level: number;
  forecast_confidence: number;
}

interface Props {
  incidents: EmergencyIncident[];
  zones: CrisisZone[];
  selectedIncident: EmergencyIncident | null;
}

export default function CrisisMap({ incidents, zones, selectedIncident }: Props) {
  const [mapUrl, setMapUrl] = useState<string>("");

  useEffect(() => {
    if (incidents.length === 0) return;

    // Calculate map bounds from incidents and zones
    const allPoints = [
      ...incidents.map((i) => ({ lat: i.latitude, lon: i.longitude })),
      ...zones.map((z) => ({ lat: z.latitude, lon: z.longitude })),
    ];

    if (allPoints.length === 0) return;

    const lats = allPoints.map((p) => p.lat);
    const lons = allPoints.map((p) => p.lon);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);

    // Add 10% padding
    const latPadding = (maxLat - minLat) * 0.1;
    const lonPadding = (maxLon - minLon) * 0.1;

    const centerLat = (minLat + maxLat) / 2;
    const centerLon = (minLon + maxLon) / 2;

    // Build OpenStreetMap URL with markers
    let url = `https://www.openstreetmap.org/?zoom=11&lat=${centerLat}&lon=${centerLon}&layers=M`;

    // For now, we'll use a static map service or display info text
    // In production, integrate with Mapbox/Leaflet for interactive features
    setMapUrl(url);
  }, [incidents, zones]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Emergency Response Map
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Map Placeholder */}
        <div className="w-full h-96 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-200 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-semibold">Interactive Map View</p>
            <p className="text-sm mb-4">
              {incidents.length} incident{incidents.length !== 1 ? "s" : ""} • {zones.length} risk zone{zones.length !== 1 ? "s" : ""}
            </p>
            <a
              href={mapUrl || "https://www.openstreetmap.org/"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm"
            >
              Open Full Map →
            </a>
          </div>
        </div>

        {/* Map Legend */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Incidents Legend */}
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="font-semibold text-red-900 mb-3"> Active Incidents</p>
            <div className="space-y-2">
              {incidents.length === 0 ? (
                <p className="text-xs text-red-700">No active incidents</p>
              ) : (
                incidents.slice(0, 3).map((incident) => (
                  <div
                    key={incident.id}
                    className={`text-xs p-2 rounded ${
                      selectedIncident?.id === incident.id
                        ? "bg-red-200 text-red-900 font-semibold"
                        : "bg-white text-red-700"
                    }`}
                  >
                    <span className="font-semibold">{incident.incident_type.toUpperCase()}</span> - {incident.title}
                    <br />
                    <span className="text-muted-foreground text-xs">
                      ({incident.latitude.toFixed(2)}, {incident.longitude.toFixed(2)})
                    </span>
                  </div>
                ))
              )}
              {incidents.length > 3 && (
                <p className="text-xs text-red-600 italic">+{incidents.length - 3} more</p>
              )}
            </div>
          </div>

          {/* Zones Legend */}
          <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <p className="font-semibold text-yellow-900 mb-3"> Predicted Risk Zones</p>
            <div className="space-y-2">
              {zones.length === 0 ? (
                <p className="text-xs text-yellow-700">No predicted zones</p>
              ) : (
                zones.slice(0, 3).map((zone) => (
                  <div key={zone.id} className="text-xs p-2 rounded bg-white text-yellow-700">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold">Risk Level: {zone.risk_level}/10</span>
                      <span className="text-xs inline-flex items-center gap-1">
                        {zone.forecast_confidence > 0.7 ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : zone.forecast_confidence > 0.4 ? (
                          <Circle className="h-3 w-3 text-yellow-500" />
                        ) : (
                          <Circle className="h-3 w-3 text-red-600" />
                        )}
                        <span>{Math.round(zone.forecast_confidence * 100)}%</span>
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      Radius: {zone.radius_km} km • ({zone.latitude.toFixed(2)}, {zone.longitude.toFixed(2)})
                    </span>
                  </div>
                ))
              )}
              {zones.length > 3 && (
                <p className="text-xs text-yellow-600 italic">+{zones.length - 3} more</p>
              )}
            </div>
          </div>
        </div>

        {/* Severity Heatmap Information */}
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <p className="font-semibold text-blue-900 mb-2"> Severity Distribution</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { color: "bg-red-500", label: "Critical", count: incidents.filter((i) => i.severity === "critical").length },
              { color: "bg-orange-500", label: "High", count: incidents.filter((i) => i.severity === "high").length },
              { color: "bg-yellow-500", label: "Medium", count: incidents.filter((i) => i.severity === "medium").length },
              { color: "bg-blue-500", label: "Low", count: incidents.filter((i) => i.severity === "low").length },
            ].map((item) => (
              <div key={item.label}>
                <div className={`h-8 rounded ${item.color} mb-1`}></div>
                <p className="text-xs font-semibold">{item.label}</p>
                <p className="text-sm font-bold">{item.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Integration Note */}
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 flex gap-2">
          <Zap className="h-5 w-5 text-blue-600 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <p className="font-semibold">Map Integration Note</p>
            <p className="text-xs">In production, this component integrates with Mapbox GL or Leaflet for interactive mapping with real-time marker updates, clustering, and heatmap overlays.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
