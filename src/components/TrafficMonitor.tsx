
import React, { useState, useEffect } from 'react';
import { Activity, Shield } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import DataCard from './ui/DataCard';

const generateTrafficData = (length: number = 24) => {
  return Array.from({ length }, (_, i) => {
    const hour = i % 24;
    const baseValue = 100 + Math.sin(i / 3) * 50;
    const ddosAttempt = Math.random() > 0.9;
    
    return {
      hour: `${hour}:00`,
      traffic: Math.floor(baseValue + Math.random() * 50),
      blocked: ddosAttempt ? Math.floor(Math.random() * 200 + 50) : Math.floor(Math.random() * 10),
      ddosAttempt,
    };
  });
};

const TrafficMonitor: React.FC = () => {
  const [data, setData] = useState(generateTrafficData());
  const [isLoading, setIsLoading] = useState(false);
  const [currentStats, setCurrentStats] = useState({
    traffic: 0,
    blocked: 0,
    ddosAttempts: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoading(true);
      
      setTimeout(() => {
        const newData = [...data.slice(1), {
          hour: `${new Date().getHours()}:00`,
          traffic: Math.floor(100 + Math.random() * 100),
          blocked: Math.floor(Math.random() * 30),
          ddosAttempt: Math.random() > 0.9,
        }];
        
        setData(newData);
        
        // Calculate current stats
        const last5Entries = newData.slice(-5);
        setCurrentStats({
          traffic: Math.floor(last5Entries.reduce((sum, item) => sum + item.traffic, 0) / 5),
          blocked: Math.floor(last5Entries.reduce((sum, item) => sum + item.blocked, 0) / 5),
          ddosAttempts: last5Entries.filter(item => item.ddosAttempt).length
        });
        
        setIsLoading(false);
      }, 500);
    }, 8000);
    
    // Set initial stats
    const last5Entries = data.slice(-5);
    setCurrentStats({
      traffic: Math.floor(last5Entries.reduce((sum, item) => sum + item.traffic, 0) / 5),
      blocked: Math.floor(last5Entries.reduce((sum, item) => sum + item.blocked, 0) / 5),
      ddosAttempts: last5Entries.filter(item => item.ddosAttempt).length
    });
    
    return () => clearInterval(interval);
  }, [data]);

  return (
    <DataCard 
      title="Traffic Monitor" 
      icon={<Activity className="h-5 w-5" />}
      isLoading={isLoading}
      className="h-full"
      footer={
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span className="text-muted-foreground">Legitimate Traffic</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="text-muted-foreground">Blocked Requests</span>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Current Traffic</p>
            <p className="text-xl font-semibold mt-1">{currentStats.traffic} req/s</p>
          </div>
          
          <div className="glass-card p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Blocked</p>
            <p className="text-xl font-semibold mt-1">{currentStats.blocked} req/s</p>
          </div>
          
          <div className="glass-card p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">DDoS Attempts</p>
            <div className="flex items-center">
              <p className="text-xl font-semibold mt-1">{currentStats.ddosAttempts}</p>
              {currentStats.ddosAttempts > 0 && <Shield className="ml-2 h-4 w-4 text-primary" />}
            </div>
          </div>
        </div>
        
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="blockedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <Area 
                type="monotone" 
                dataKey="traffic" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1}
                fill="url(#trafficGradient)" 
              />
              <Area 
                type="monotone" 
                dataKey="blocked" 
                stroke="#ef4444" 
                fillOpacity={1}
                fill="url(#blockedGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DataCard>
  );
};

export default TrafficMonitor;
