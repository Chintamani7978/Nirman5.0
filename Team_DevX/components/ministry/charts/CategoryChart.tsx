import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useMemo } from "react";

interface CategoryChartProps {
  data: { category: string; count: number }[];
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a29bfe", "#55efc4", "#fab1a0"]; // rotating colors

const CategoryChart = ({ data }: CategoryChartProps) => {
  const animatedData = useMemo(() => data.map((item) => ({ ...item })), [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full space-y-6"
    >
      {/* BAR CHART */}
      <Card className="rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Problems by Category (Bar Chart)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={animatedData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-40" />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} interval={0} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: "12px", padding: "10px", border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }} />
                <Legend />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} animationDuration={800}>
                  {animatedData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* PIE CHART */}
      <Card className="rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Problems Distribution (Pie Chart)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 flex justify-center">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={animatedData}
                dataKey="count"
                nameKey="category"
                outerRadius={100}
                label
              >
                {animatedData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* LINE CHART */}
      <Card className="rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Trend of Problems (Line Chart)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={animatedData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-40" />
                <XAxis dataKey="category" tick={{ fontSize: 12 }} interval={0} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" strokeWidth={3} dot>
                  {animatedData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CategoryChart;