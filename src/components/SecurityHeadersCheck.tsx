
import React from 'react';
import { Lock, Check, X, AlertTriangle } from 'lucide-react';
import DataCard from './ui/DataCard';
import { cn } from '@/lib/utils';

interface SecurityHeader {
  name: string;
  value: string;
  status: 'good' | 'warning' | 'bad';
}

interface TLSInfo {
  certificate: {
    validUntil: string;
    issuer: string;
    version: string;
  };
  protocols: {
    name: string;
    secure: boolean;
  }[];
}

interface SecurityHeadersCheckProps {
  headers: SecurityHeader[];
  tlsInfo: TLSInfo;
}

const SecurityHeadersCheck: React.FC<SecurityHeadersCheckProps> = ({ headers, tlsInfo }) => {
  // Get icon based on status
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'good': return <Check className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'bad': return <X className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <DataCard 
      title="Security Configurations" 
      icon={<Lock className="h-5 w-5" />}
      className="h-full"
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">TLS/SSL Configuration</h3>
          
          <div className="glass-card p-3 rounded-lg">
            <h4 className="text-sm font-medium">Certificate</h4>
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Valid Until</p>
                <p>{tlsInfo.certificate.validUntil}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Issuer</p>
                <p>{tlsInfo.certificate.issuer}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Version</p>
                <p>{tlsInfo.certificate.version}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Protocols</h4>
            <div className="grid grid-cols-2 gap-2">
              {tlsInfo.protocols.map((protocol) => (
                <div 
                  key={protocol.name}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-md",
                    protocol.secure ? "bg-green-500/10" : "bg-red-500/10"
                  )}
                >
                  <span className="text-sm">{protocol.name}</span>
                  {protocol.secure ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">HTTP Security Headers</h3>
          <div className="space-y-2">
            {headers.map((header) => (
              <div 
                key={header.name}
                className="flex items-start justify-between p-3 glass-card rounded-lg"
              >
                <div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(header.status)}
                    <h4 className="font-medium text-sm">{header.name}</h4>
                  </div>
                  <p className="text-xs mt-1 text-muted-foreground max-w-[300px] truncate">{header.value}</p>
                </div>
                <div>
                  <span 
                    className={cn(
                      "text-xs uppercase font-medium px-2 py-0.5 rounded",
                      header.status === 'good' && "bg-green-500/10 text-green-500",
                      header.status === 'warning' && "bg-yellow-500/10 text-yellow-500",
                      header.status === 'bad' && "bg-red-500/10 text-red-500",
                    )}
                  >
                    {header.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DataCard>
  );
};

export default SecurityHeadersCheck;
