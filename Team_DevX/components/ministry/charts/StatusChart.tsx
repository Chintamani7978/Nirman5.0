import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface StatusChartProps {
  data: { status: string; count: number }[];
}

// Expanded professional color palette (soft gradients & premium tones)
const COLORS = [
  '#4F46E5', // Indigo
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#0EA5E9', // Sky
];

const StatusChart = ({ data }: StatusChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
            Problems by Status
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-4 flex justify-center">
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={110}
                innerRadius={55} // donut chart for more professionalism
                paddingAngle={3}
                blendStroke
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                dataKey="count"
                nameKey="status"
              >
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  borderRadius: "14px",
                  padding: "12px",
                  border: "none",
                  backgroundColor: "white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                }}
              />

              <Legend
                verticalAlign="bottom"
                height={36}
                wrapperStyle={{ fontSize: '14px', fontWeight: 500 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatusChart;