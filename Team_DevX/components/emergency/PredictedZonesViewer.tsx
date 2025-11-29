import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Gauge, TrendingUp, MapPin, CheckCircle2, Circle } from "lucide-react";
import { motion } from "framer-motion";

interface PredictedZone {
  id: string;
  latitude: number;
  longitude: number;
  radius_km: number;
  risk_level: number;
  forecast_confidence: number;
  affected_area_description?: string;
  affected_population_estimate?: number;
  predicted_severity?: string;
  forecast_updated_at?: string;
}

interface Props {
  zones: PredictedZone[];
  isLoading?: boolean;
}

const getRiskColor = (level: number) => {
  if (level >= 8) return { bg: "bg-destructive/10", border: "border-destructive/30", text: "text-destructive", label: "Critical" };
  if (level >= 6) return { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-500", label: "High" };
  if (level >= 4) return { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-500", label: "Medium" };
  return { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-500", label: "Low" };
};

const getConfidenceIcon = (confidence: number) => {
  if (confidence >= 0.8) return <CheckCircle2 className="h-4 w-4 text-green-600" />;
  if (confidence >= 0.5) return <Circle className="h-3 w-3 text-yellow-500" />;
  return <Circle className="h-3 w-3 text-red-600" />;
};

export default function PredictedZonesViewer({ zones, isLoading = false }: Props) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center">
          <div className="animate-spin text-muted-foreground">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (zones.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Gauge className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No predicted high-risk zones at this time</p>
          <p className="text-sm mt-2">Safe conditions across the region</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Zone Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-destructive/5">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-destructive">{zones.filter((z) => z.risk_level >= 8).length}</p>
            <p className="text-sm text-muted-foreground">Critical Risk Zones</p>
          </CardContent>
        </Card>
        <Card className="bg-orange-500/5">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-orange-600">{zones.filter((z) => z.risk_level >= 6 && z.risk_level < 8).length}</p>
            <p className="text-sm text-muted-foreground">High Risk Zones</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500/5">
          <CardContent className="pt-4">
            <p className="text-3xl font-bold text-yellow-600">
              {zones.reduce((sum, z) => sum + z.affected_population_estimate || 0, 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total at Risk (Est.)</p>
          </CardContent>
        </Card>
      </div>

      {/* Zones List */}
      <div className="space-y-3">
        {zones.map((zone, idx) => {
          const riskInfo = getRiskColor(zone.risk_level);
          return (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className={`${riskInfo.bg} border-l-4 ${riskInfo.text} ${riskInfo.border}`}>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">Zone #{idx + 1}</h3>
                          <Badge className={`${riskInfo.text} ${riskInfo.bg} border ${riskInfo.border}`}>
                            {riskInfo.label}
                          </Badge>
                        </div>
                        {zone.affected_area_description && (
                          <p className="text-sm text-muted-foreground">{zone.affected_area_description}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold">{zone.risk_level}</p>
                        <p className="text-xs text-muted-foreground">/10 Risk Level</p>
                      </div>
                    </div>

                    {/* Risk Gauge */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold">Risk Progression</span>
                        <span className="text-muted-foreground">{zone.risk_level}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${
                            zone.risk_level >= 8
                              ? "bg-destructive"
                              : zone.risk_level >= 6
                              ? "bg-orange-500"
                              : zone.risk_level >= 4
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(zone.risk_level / 10) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">Radius</p>
                        <p className="font-semibold">{zone.radius_km} km</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">Location</p>
                        <p className="font-mono text-xs">{zone.latitude.toFixed(2)}, {zone.longitude.toFixed(2)}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground font-semibold">Forecast</p>
                        <div className="flex items-center gap-1">
                          <span>{getConfidenceIcon(zone.forecast_confidence)}</span>
                          <span className="font-semibold">{Math.round(zone.forecast_confidence * 100)}%</span>
                        </div>
                      </div>

                      {zone.affected_population_estimate && (
                        <div>
                          <p className="text-xs text-muted-foreground font-semibold">Est. Population</p>
                          <p className="font-semibold">{(zone.affected_population_estimate / 1000).toFixed(1)}k</p>
                        </div>
                      )}
                    </div>

                    {/* Confidence Status */}
                    <div className={`p-2 rounded text-xs font-semibold ${
                      zone.forecast_confidence >= 0.8
                        ? "bg-green-100 text-green-800"
                        : zone.forecast_confidence >= 0.5
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {zone.forecast_confidence >= 0.8 ? (
                        <span className="inline-flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-700" />
                          High Confidence Forecast
                        </span>
                      ) : zone.forecast_confidence >= 0.5 ? (
                        <span className="inline-flex items-center gap-2">
                          <Circle className="h-3 w-3 text-yellow-600" />
                          Moderate Confidence Forecast
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <Circle className="h-3 w-3 text-red-600" />
                          Low Confidence Forecast - Monitor Closely
                        </span>
                      )}
                    </div>

                    {/* Severity Prediction */}
                    {zone.predicted_severity && (
                      <div className="p-2 rounded bg-muted text-xs">
                        <p className="text-muted-foreground font-semibold">Predicted Severity</p>
                        <p className="font-semibold capitalize">{zone.predicted_severity}</p>
                      </div>
                    )}

                    {/* Last Updated */}
                    {zone.forecast_updated_at && (
                      <div className="pt-2 border-t text-xs text-muted-foreground">
                        <p>Last updated {new Date(zone.forecast_updated_at).toLocaleTimeString()}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Forecast Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Forecast Information
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 text-muted-foreground">
          <p>
            <strong>Confidence Levels:</strong> {getConfidenceIcon(0.8)} High (80%+) indicates reliable predictions, {getConfidenceIcon(0.5)} Moderate (50-79%) requires caution, {getConfidenceIcon(0.2)} Low (&lt;50%) needs close monitoring.
          </p>
          <p>
            <strong>Risk Levels:</strong> Critical (8-10) demands immediate action, High (6-7) requires heightened preparedness, Medium (4-5) warrants monitoring, Low (1-3) indicates minimal risk.
          </p>
          <p>
            <strong>Data Source:</strong> Weather API integration, historical incident patterns, geographic vulnerability assessment. Updated every 30 minutes.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
