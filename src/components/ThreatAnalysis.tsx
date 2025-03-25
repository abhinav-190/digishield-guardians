
import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import DataCard from './ui/DataCard';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const generateRandomThreats = () => {
  return {
    critical: Math.floor(Math.random() * 5),
    high: Math.floor(Math.random() * 10),
    medium: Math.floor(Math.random() * 20),
    low: Math.floor(Math.random() * 30),
  };
};

const ThreatAnalysis: React.FC = () => {
  const [threats, setThreats] = useState(generateRandomThreats());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoading(true);
      setTimeout(() => {
        setThreats(generateRandomThreats());
        setIsLoading(false);
      }, 500);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const totalThreats = 
    threats.critical + threats.high + threats.medium + threats.low;

  return (
    <DataCard 
      title="Real-time Threat Analysis" 
      icon={<Shield className="h-5 w-5" />}
      isLoading={isLoading}
      className="h-full"
    >
      <div className="space-y-6">
        {totalThreats > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-2xl font-semibold">{totalThreats}</h4>
                <p className="text-sm text-muted-foreground">Active threats detected</p>
              </div>
              
              {threats.critical > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-500 animate-pulse-subtle">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs font-medium">{threats.critical} Critical</span>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-red-500">Critical</span>
                  <span>{threats.critical}</span>
                </div>
                <div className="relative h-1 w-full bg-muted overflow-hidden rounded-full">
                  <div 
                    className={cn("absolute top-0 left-0 h-full bg-red-500")}
                    style={{ width: `${(threats.critical / 5) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-orange-500">High</span>
                  <span>{threats.high}</span>
                </div>
                <div className="relative h-1 w-full bg-muted overflow-hidden rounded-full">
                  <div 
                    className={cn("absolute top-0 left-0 h-full bg-orange-500")}
                    style={{ width: `${(threats.high / 10) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-yellow-500">Medium</span>
                  <span>{threats.medium}</span>
                </div>
                <div className="relative h-1 w-full bg-muted overflow-hidden rounded-full">
                  <div 
                    className={cn("absolute top-0 left-0 h-full bg-yellow-500")}
                    style={{ width: `${(threats.medium / 20) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-green-500">Low</span>
                  <span>{threats.low}</span>
                </div>
                <div className="relative h-1 w-full bg-muted overflow-hidden rounded-full">
                  <div 
                    className={cn("absolute top-0 left-0 h-full bg-green-500")}
                    style={{ width: `${(threats.low / 30) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Shield className="h-12 w-12 text-green-500 mb-3" />
            <h4 className="text-lg font-medium">All Clear</h4>
            <p className="text-sm text-muted-foreground mt-1">
              No active threats detected
            </p>
          </div>
        )}
      </div>
    </DataCard>
  );
};

export default ThreatAnalysis;
