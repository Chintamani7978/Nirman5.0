import ProblemMap from "@/components/ministry/ProblemMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MinistryMapPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Geospatial Intelligence</h1>
      <Card>
        <CardHeader>
          <CardTitle>Problem Hotspots</CardTitle>
        </CardHeader>
        <CardContent className="h-[600px] w-full">
          <ProblemMap />
        </CardContent>
      </Card>
    </div>
  );
};

export default MinistryMapPage;
