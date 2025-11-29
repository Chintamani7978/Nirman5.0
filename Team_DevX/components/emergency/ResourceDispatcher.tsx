import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Navigation, Truck, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface ResourceDeployment {
  id: string;
  resource_id: string;
  resource_name: string;
  resource_type: string;
  incident_id: string;
  status: string;
  distance_km: number;
  eta_minutes: number;
  assigned_at: string;
  current_latitude?: number;
  current_longitude?: number;
}

interface Props {
  deployments: ResourceDeployment[];
  isLoading?: boolean;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-700 border-yellow-500/30",
    en_route: "bg-blue-500/10 text-blue-700 border-blue-500/30",
    arrived: "bg-green-500/10 text-green-700 border-green-500/30",
    completed: "bg-gray-500/10 text-gray-700 border-gray-500/30",
  };
  return colors[status] || colors.pending;
};

const getResourceIcon = (type: string) => {
  const icons: Record<string, string> = {
    ambulance: "🚑",
    fire_truck: "🚒",
    rescue_team: "👨‍🚒",
    police: "🚔",
    shelter: "🏠",
    water_tanker: "💧",
    medical_van: "🚑",
    supply_truck: "🚚",
  };
  return icons[type] || "🚛";
};

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: "Assigned",
    en_route: "En Route",
    arrived: "Arrived",
    completed: "Completed",
  };
  return labels[status] || status;
};

export default function ResourceDispatcher({ deployments, isLoading = false }: Props) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center">
          <div className="animate-spin text-muted-foreground">
            <Truck className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (deployments.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No resources assigned yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deployments.map((deployment, idx) => (
          <motion.div
            key={deployment.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className={`border-l-4 ${deployment.status === "en_route" ? "border-l-blue-500" : deployment.status === "arrived" ? "border-l-green-500" : "border-l-yellow-500"}`}>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getResourceIcon(deployment.resource_type)}</span>
                      <div>
                        <p className="font-semibold">{deployment.resource_name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{deployment.resource_type.replace("_", " ")}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`uppercase text-xs font-bold ${getStatusColor(deployment.status)}`}>
                      {getStatusLabel(deployment.status)}
                    </Badge>
                  </div>

                  {/* Status Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className={`h-full rounded-full ${
                        deployment.status === "completed"
                          ? "bg-green-500"
                          : deployment.status === "arrived"
                          ? "bg-green-500"
                          : deployment.status === "en_route"
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                      }`}
                      initial={{ width: 0 }}
                      animate={{
                        width:
                          deployment.status === "completed" || deployment.status === "arrived"
                            ? "100%"
                            : deployment.status === "en_route"
                            ? "50%"
                            : "20%",
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Navigation className="h-4 w-4" />
                      <span>{deployment.distance_km.toFixed(1)} km</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{deployment.eta_minutes} min ETA</span>
                    </div>
                  </div>

                  {/* Alert for long ETA */}
                  {deployment.eta_minutes > 30 && deployment.status === "pending" && (
                    <div className="p-2 rounded bg-orange-500/10 border border-orange-500/30 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                      <p className="text-xs text-orange-600">Long ETA - Consider closer resources</p>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="text-xs text-muted-foreground pt-1 border-t">
                    <p>Assigned {new Date(deployment.assigned_at).toLocaleTimeString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats */}
      <Card className="bg-muted/30">
        <CardContent className="pt-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-yellow-600">{deployments.filter((d) => d.status === "pending").length}</p>
              <p className="text-xs text-muted-foreground">Assigned</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{deployments.filter((d) => d.status === "en_route").length}</p>
              <p className="text-xs text-muted-foreground">En Route</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{deployments.filter((d) => d.status === "arrived").length}</p>
              <p className="text-xs text-muted-foreground">Arrived</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">{deployments.filter((d) => d.status === "completed").length}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
