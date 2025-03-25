
import React from 'react';
import { Shield, AlertTriangle, Check } from 'lucide-react';
import DataCard from './ui/DataCard';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ScanResultsSummaryProps {
  securityScore: number;
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  };
  domain: string;
  timestamp: string;
}

const ScanResultsSummary: React.FC<ScanResultsSummaryProps> = ({
  securityScore,
  summary,
  domain,
  timestamp
}) => {
  // Get severity level and color based on score
  const getSeverityInfo = (score: number) => {
    if (score >= 80) return { level: 'Good', color: 'text-green-500', icon: <Check className="h-5 w-5" /> };
    if (score >= 60) return { level: 'Fair', color: 'text-yellow-500', icon: <AlertTriangle className="h-5 w-5" /> };
    return { level: 'Poor', color: 'text-red-500', icon: <AlertTriangle className="h-5 w-5" /> };
  };

  const severityInfo = getSeverityInfo(securityScore);

  return (
    <DataCard 
      title="Security Scan Summary" 
      icon={<Shield className="h-5 w-5" />}
      className="h-full"
    >
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div 
              className={cn(
                "absolute inset-0 rounded-full border-8",
                securityScore >= 80 ? "border-green-500/30" : 
                securityScore >= 60 ? "border-yellow-500/30" : "border-red-500/30"
              )}
            />
            <div className="text-center">
              <div className="text-4xl font-bold">{securityScore}</div>
              <div className={cn("text-sm font-medium", severityInfo.color)}>{severityInfo.level}</div>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="font-medium">{domain}</h3>
            <p className="text-xs text-muted-foreground">Scanned on {new Date(timestamp).toLocaleString()}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Critical Issues</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("text-xl font-semibold", summary.critical > 0 ? "text-red-500" : "text-green-500")}>
                {summary.critical}
              </span>
              {summary.critical > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-500">
                  Immediate action required
                </span>
              )}
            </div>
          </div>
          
          <div className="glass-card p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">High Issues</p>
            <p className={cn("text-xl font-semibold mt-1", summary.high > 0 ? "text-orange-500" : "text-green-500")}>
              {summary.high}
            </p>
          </div>
          
          <div className="glass-card p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Medium Issues</p>
            <p className={cn("text-xl font-semibold mt-1", summary.medium > 0 ? "text-yellow-500" : "text-green-500")}>
              {summary.medium}
            </p>
          </div>
          
          <div className="glass-card p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">Low Issues</p>
            <p className={cn("text-xl font-semibold mt-1", summary.low > 0 ? "text-green-500" : "text-green-500")}>
              {summary.low}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-red-500">Critical</span>
            <span>{summary.critical}</span>
          </div>
          <div className="relative h-1 w-full bg-muted overflow-hidden rounded-full">
            <div 
              className="absolute top-0 left-0 h-full bg-red-500"
              style={{ width: `${(summary.critical / (summary.total || 1)) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs">
            <span className="text-orange-500">High</span>
            <span>{summary.high}</span>
          </div>
          <div className="relative h-1 w-full bg-muted overflow-hidden rounded-full">
            <div 
              className="absolute top-0 left-0 h-full bg-orange-500"
              style={{ width: `${(summary.high / (summary.total || 1)) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs">
            <span className="text-yellow-500">Medium</span>
            <span>{summary.medium}</span>
          </div>
          <div className="relative h-1 w-full bg-muted overflow-hidden rounded-full">
            <div 
              className="absolute top-0 left-0 h-full bg-yellow-500"
              style={{ width: `${(summary.medium / (summary.total || 1)) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs">
            <span className="text-green-500">Low</span>
            <span>{summary.low}</span>
          </div>
          <div className="relative h-1 w-full bg-muted overflow-hidden rounded-full">
            <div 
              className="absolute top-0 left-0 h-full bg-green-500"
              style={{ width: `${(summary.low / (summary.total || 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </DataCard>
  );
};

export default ScanResultsSummary;
