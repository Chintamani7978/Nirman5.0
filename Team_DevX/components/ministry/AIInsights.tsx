import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, TrendingUp, Smile, Frown } from "lucide-react";

const AIInsights = () => {
  // Placeholder data - in a real app, this would come from an AI service
  const insights = {
    emergingConcerns: [
      "Increased reports of water logging in Sector 15.",
      "Frequent power outages in the industrial area.",
      "Demand for a new public park in the city center.",
    ],
    sentiment: {
      positive: 78,
      negative: 22,
    },
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">AI-Powered Insights</CardTitle>
        <BrainCircuit className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-md font-semibold flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4" />
              Top Emerging Concerns
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {insights.emergingConcerns.map((concern, index) => (
                <li key={index}>{concern}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-md font-semibold flex items-center gap-2 mb-2">
              Sentiment Overview
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-green-600">
                <Smile className="h-5 w-5" />
                <span className="font-bold text-lg">{insights.sentiment.positive}%</span>
                <span>Positive</span>
              </div>
              <div className="flex items-center gap-2 text-red-600">
                <Frown className="h-5 w-5" />
                <span className="font-bold text-lg">{insights.sentiment.negative}%</span>
                <span>Negative</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsights;
