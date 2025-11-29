import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Users, Clock, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface EmergencyIncident {
  id: string;
  title: string;
  incident_type: string;
  severity: string;
  latitude: number;
  longitude: number;
  affected_population: number;
  life_threatening: boolean;
  created_at: string;
  ai_confidence_score?: number;
}

interface Props {
  incidents: EmergencyIncident[];
  selectedIncident: EmergencyIncident | null;
  onSelectIncident: (incident: EmergencyIncident) => void;
  onAssignResources: () => void;
}

const getSeverityColor = (severity: string) => {
  const colors: Record<string, string> = {
    critical: "bg-destructive/10 border-destructive/30 text-destructive",
    high: "bg-orange-500/10 border-orange-500/30 text-orange-500",
    medium: "bg-yellow-500/10 border-yellow-500/30 text-yellow-500",
    low: "bg-blue-500/10 border-blue-500/30 text-blue-500",
  };
  return colors[severity] || colors.medium;
};

const getIncidentIcon = (type: string) => {
  const icons: Record<string, string> = {
    flood: "🌊",
    cyclone: "🌪️",
    fire: "🔥",
    earthquake: "🌍",
    medical_emergency: "🏥",
    accident: "🚨",
  };
  return icons[type] || "⚠️";
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
};

export default function IncidentPrioritizer({ incidents, selectedIncident, onSelectIncident, onAssignResources }: Props) {
  if (incidents.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No active emergency incidents</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incidents List */}
        <div className="lg:col-span-2 space-y-3">
          {incidents.map((incident, idx) => (
            <motion.div
              key={incident.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card
                className={`cursor-pointer transition-all ${
                  selectedIncident?.id === incident.id
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/50"
                } ${getSeverityColor(incident.severity)}`}
                onClick={() => onSelectIncident(incident)}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{getIncidentIcon(incident.incident_type)}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-lg">{incident.title}</h3>
                          <p className="text-sm text-muted-foreground capitalize">{incident.incident_type.replace("_", " ")}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${getSeverityColor(incident.severity)}`}>
                          {incident.severity}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{formatTime(incident.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{incident.affected_population} affected</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-muted-foreground" />
                          <span>{Math.round((incident.ai_confidence_score || 0.8) * 100)}% confidence</span>
                        </div>
                      </div>

                      {incident.life_threatening && (
                        <div className="mt-2 p-2 rounded bg-destructive/20 border border-destructive/50">
                          <p className="text-xs font-semibold text-destructive">⚠️ LIFE-THREATENING INCIDENT</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Selected Incident Details */}
        <div className="lg:col-span-1">
          {selectedIncident ? (
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Incident Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-semibold capitalize">{selectedIncident.incident_type.replace("_", " ")}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Severity</p>
                  <p className={`font-semibold uppercase ${getSeverityColor(selectedIncident.severity)}`}>
                    {selectedIncident.severity}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-mono text-sm">{selectedIncident.latitude.toFixed(6)}, {selectedIncident.longitude.toFixed(6)}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Affected Population</p>
                  <p className="font-semibold text-lg">{selectedIncident.affected_population.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Reported</p>
                  <p className="font-semibold">{formatTime(selectedIncident.created_at)}</p>
                </div>

                <Button onClick={onAssignResources} className="w-full mt-4" size="lg">
                  <Zap className="mr-2 h-4 w-4" />
                  Assign Resources
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-muted-foreground">
                <p>Select an incident to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
