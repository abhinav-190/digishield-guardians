
import React, { useState, useEffect } from 'react';
import { Database } from 'lucide-react';
import DataCard from './ui/DataCard';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const generateGraphData = () => {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i % 24;
    return {
      hour: `${hour}:00`,
      nodes: Math.floor(Math.random() * 30) + 20,
      connections: Math.floor(Math.random() * 50) + 30,
      bandwidth: Math.floor(Math.random() * 100),
    };
  });
};

const NetworkGraph: React.FC = () => {
  const [data, setData] = useState(generateGraphData());
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoading(true);
      
      setTimeout(() => {
        const newData = [...data.slice(1), {
          hour: `${new Date().getHours()}:00`,
          nodes: Math.floor(Math.random() * 30) + 20,
          connections: Math.floor(Math.random() * 50) + 30,
          bandwidth: Math.floor(Math.random() * 100),
        }];
        
        setData(newData);
        setIsLoading(false);
      }, 500);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [data]);

  return (
    <DataCard 
      title="Network Graph Analysis" 
      icon={<Database className="h-5 w-5" />}
      isLoading={isLoading}
      className="h-full"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Active Nodes</p>
            <p className="text-xl font-semibold mt-1">{data[data.length - 1].nodes}</p>
          </div>
          
          <div className="glass-card p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Connections</p>
            <p className="text-xl font-semibold mt-1">{data[data.length - 1].connections}</p>
          </div>
          
          <div className="glass-card p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Bandwidth Usage</p>
            <p className="text-xl font-semibold mt-1">{data[data.length - 1].bandwidth}%</p>
          </div>
        </div>
        
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="hour" 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'rgba(255,255,255,0.1)',
                  fontSize: '12px',
                  borderRadius: '6px'
                }}
              />
              <Legend 
                iconSize={10}
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              />
              <Line 
                type="monotone" 
                dataKey="nodes" 
                stroke="#3b82f6" 
                activeDot={{ r: 6 }} 
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="connections" 
                stroke="#10b981" 
                activeDot={{ r: 6 }} 
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="bandwidth" 
                stroke="#f59e0b" 
                activeDot={{ r: 6 }} 
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DataCard>
  );
};

export default NetworkGraph;
