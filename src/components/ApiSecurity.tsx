
import React, { useState, useEffect } from 'react';
import { Zap, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import DataCard from './ui/DataCard';
import { cn } from '@/lib/utils';

// Mock API endpoints
const apiEndpoints = [
  { id: 1, name: "User Authentication", route: "/api/auth", method: "POST" },
  { id: 2, name: "Data Retrieval", route: "/api/data", method: "GET" },
  { id: 3, name: "Payment Processing", route: "/api/payments", method: "POST" },
  { id: 4, name: "File Upload", route: "/api/upload", method: "PUT" },
  { id: 5, name: "Analytics", route: "/api/analytics", method: "GET" },
];

const statuses = ["secured", "warning", "vulnerable"] as const;
type ApiStatus = typeof statuses[number];

interface ApiEndpoint {
  id: number;
  name: string;
  route: string;
  method: string;
  status: ApiStatus;
  lastChecked: string;
  responseTime: number;
}

const ApiSecurity: React.FC = () => {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize with random status
    const initialEndpoints = apiEndpoints.map(endpoint => ({
      ...endpoint,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastChecked: new Date().toISOString(),
      responseTime: Math.floor(Math.random() * 200) + 50,
    }));
    
    setEndpoints(initialEndpoints);
    setIsLoading(false);
    
    // Update status randomly every 10 seconds
    const interval = setInterval(() => {
      setIsLoading(true);
      
      setTimeout(() => {
        setEndpoints(prev => 
          prev.map(endpoint => ({
            ...endpoint,
            status: Math.random() > 0.8 
              ? statuses[Math.floor(Math.random() * statuses.length)] 
              : endpoint.status,
            lastChecked: new Date().toISOString(),
            responseTime: Math.floor(Math.random() * 200) + 50,
          }))
        );
        
        setIsLoading(false);
      }, 500);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: ApiStatus) => {
    switch (status) {
      case "secured":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "vulnerable":
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = (status: ApiStatus) => {
    switch (status) {
      case "secured":
        return "Secured";
      case "warning":
        return "Warning";
      case "vulnerable":
        return "Vulnerable";
    }
  };

  return (
    <DataCard 
      title="API Security Monitor" 
      icon={<Zap className="h-5 w-5" />}
      isLoading={isLoading}
      className="h-full"
    >
      <div className="space-y-4">
        {endpoints.map((endpoint) => (
          <div 
            key={endpoint.id} 
            className="glass-card p-3 rounded-lg flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <span 
                  className={cn(
                    "text-xs uppercase font-medium px-2 py-0.5 rounded",
                    endpoint.method === "GET" && "bg-blue-500/10 text-blue-500",
                    endpoint.method === "POST" && "bg-green-500/10 text-green-500",
                    endpoint.method === "PUT" && "bg-purple-500/10 text-purple-500",
                    endpoint.method === "DELETE" && "bg-red-500/10 text-red-500",
                  )}
                >
                  {endpoint.method}
                </span>
                <h4 className="font-medium">{endpoint.name}</h4>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{endpoint.route}</p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Response Time</p>
                <p className={cn(
                  "text-sm font-medium",
                  endpoint.responseTime < 100 && "text-green-500",
                  endpoint.responseTime >= 100 && endpoint.responseTime < 150 && "text-yellow-500",
                  endpoint.responseTime >= 150 && "text-red-500",
                )}>
                  {endpoint.responseTime}ms
                </p>
              </div>
              
              <div className="flex items-center gap-1">
                {getStatusIcon(endpoint.status)}
                <span 
                  className={cn(
                    "text-sm",
                    endpoint.status === "secured" && "text-green-500",
                    endpoint.status === "warning" && "text-yellow-500",
                    endpoint.status === "vulnerable" && "text-red-500",
                  )}
                >
                  {getStatusText(endpoint.status)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DataCard>
  );
};

export default ApiSecurity;
