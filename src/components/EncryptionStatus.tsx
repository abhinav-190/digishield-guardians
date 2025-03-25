
import React, { useState, useEffect } from 'react';
import { Lock, Check, AlertTriangle, Clock } from 'lucide-react';
import DataCard from './ui/DataCard';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type EncryptionStatus = 'encrypted' | 'pending' | 'failed';

interface DataAsset {
  id: number;
  name: string;
  type: string;
  size: string;
  status: EncryptionStatus;
  progress: number;
}

const mockDataAssets: DataAsset[] = [
  { id: 1, name: "User Credentials", type: "Database", size: "2.4 GB", status: 'encrypted', progress: 100 },
  { id: 2, name: "Payment Information", type: "Database", size: "1.8 GB", status: 'encrypted', progress: 100 },
  { id: 3, name: "Personal Identifiers", type: "File Storage", size: "4.2 GB", status: 'encrypted', progress: 100 },
  { id: 4, name: "Session Data", type: "Cache", size: "820 MB", status: 'pending', progress: 45 },
  { id: 5, name: "Analytics Data", type: "Database", size: "6.7 GB", status: 'pending', progress: 72 },
];

const EncryptionStatus: React.FC = () => {
  const [dataAssets, setDataAssets] = useState<DataAsset[]>(mockDataAssets);
  const [isLoading, setIsLoading] = useState(false);
  const [encryptionStats, setEncryptionStats] = useState({
    encrypted: 0,
    pending: 0,
    failed: 0,
    totalSize: '',
  });

  useEffect(() => {
    // Initial calculation
    calculateStats(dataAssets);
    
    // Update encryption progress
    const interval = setInterval(() => {
      setIsLoading(true);
      
      setTimeout(() => {
        setDataAssets(prev => 
          prev.map(asset => {
            if (asset.status === 'pending') {
              const newProgress = Math.min(asset.progress + Math.floor(Math.random() * 10) + 5, 100);
              return { 
                ...asset, 
                progress: newProgress,
                status: newProgress === 100 ? 'encrypted' as EncryptionStatus : asset.status
              };
            }
            
            // Randomly fail an encryption (very low chance)
            if (asset.status === 'encrypted' && Math.random() > 0.98) {
              return { ...asset, status: 'failed' as EncryptionStatus };
            }
            
            return asset;
          })
        );
        
        setIsLoading(false);
      }, 500);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    calculateStats(dataAssets);
  }, [dataAssets]);

  const calculateStats = (assets: DataAsset[]) => {
    const encrypted = assets.filter(a => a.status === 'encrypted').length;
    const pending = assets.filter(a => a.status === 'pending').length;
    const failed = assets.filter(a => a.status === 'failed').length;
    
    // Calculate total size (simplified)
    const total = assets.reduce((acc, asset) => {
      const sizeNum = parseFloat(asset.size.split(' ')[0]);
      const unit = asset.size.split(' ')[1];
      
      const sizeInMB = unit === 'GB' ? sizeNum * 1024 : sizeNum;
      return acc + sizeInMB;
    }, 0);
    
    let totalSize = '';
    if (total > 1024) {
      totalSize = `${(total / 1024).toFixed(1)} GB`;
    } else {
      totalSize = `${total.toFixed(0)} MB`;
    }
    
    setEncryptionStats({ encrypted, pending, failed, totalSize });
  };

  const getStatusIcon = (status: EncryptionStatus) => {
    switch (status) {
      case 'encrypted':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <DataCard 
      title="AES-256 Encryption" 
      icon={<Lock className="h-5 w-5" />}
      isLoading={isLoading}
      className="h-full"
    >
      <div className="space-y-6">
        <div className="glass-card p-4 rounded-lg text-center">
          <h3 className="text-sm font-medium text-muted-foreground">Total Protected Data</h3>
          <p className="text-2xl font-semibold mt-1">{encryptionStats.totalSize}</p>
          <div className="flex justify-center gap-6 mt-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Encrypted</p>
              <p className="text-sm font-medium text-green-500">{encryptionStats.encrypted}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-sm font-medium text-yellow-500">{encryptionStats.pending}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Failed</p>
              <p className="text-sm font-medium text-red-500">{encryptionStats.failed}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {dataAssets.map((asset) => (
            <div key={asset.id} className="glass-card p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{asset.name}</h4>
                    <span className="text-xs bg-secondary px-2 py-0.5 rounded">{asset.type}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{asset.size}</p>
                </div>
                
                <div className="flex items-center gap-1">
                  {getStatusIcon(asset.status)}
                  <span 
                    className={cn(
                      "text-sm",
                      asset.status === 'encrypted' && "text-green-500",
                      asset.status === 'pending' && "text-yellow-500",
                      asset.status === 'failed' && "text-red-500",
                    )}
                  >
                    {asset.status === 'encrypted' && 'Encrypted'}
                    {asset.status === 'pending' && 'In Progress'}
                    {asset.status === 'failed' && 'Failed'}
                  </span>
                </div>
              </div>
              
              {asset.status === 'pending' && (
                <div className="mt-2">
                  <Progress value={asset.progress} className="h-1 bg-muted" />
                  <p className="text-xs text-muted-foreground text-right mt-1">{asset.progress}%</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DataCard>
  );
};

export default EncryptionStatus;
