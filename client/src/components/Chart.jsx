import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE"];

export const Chart = ({ data, title }) => {
  // Extract unique keys from the data (excluding 'name')
  const keys = [...new Set(data.flatMap(Object.keys))].filter(key => key !== 'name');

  return (
    <div className="w-full h-[400px] bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#666', fontSize: 12 }}
            tickLine={{ stroke: '#666' }}
          />
          <YAxis 
            tick={{ fill: '#666', fontSize: 12 }}
            tickLine={{ stroke: '#666' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#f8f8f8', border: '1px solid #d5d5d5' }}
            itemStyle={{ color: '#333' }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
          />
          {keys.map((key, index) => (
            <Bar 
              key={key} 
              dataKey={key} 
              fill={COLORS[index % COLORS.length]}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};