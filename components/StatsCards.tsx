
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface StatsCardsProps {
  country: string;
  stats: { internet: number; mobile: number; youth: number };
}

const StatsCards: React.FC<StatsCardsProps> = ({ country, stats }) => {
  const data = [
    { name: 'Internet Penetration', value: stats.internet, fill: '#3b82f6' },
    { name: 'Mobile Usage', value: stats.mobile, fill: '#10b981' },
    { name: 'Youth Pop. (<25)', value: stats.youth, fill: '#f59e0b' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
        Digital Landscape: {country}
      </h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
            <XAxis type="number" hide />
            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4">
        {data.map((item) => (
          <div key={item.name} className="text-center">
            <div className="text-xs text-slate-500 uppercase font-medium">{item.name.split(' ')[0]}</div>
            <div className="text-lg font-bold text-slate-800">{item.value}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCards;
