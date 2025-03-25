
import React from 'react';
import ThreatAnalysis from './ThreatAnalysis';
import TrafficMonitor from './TrafficMonitor';
import ApiSecurity from './ApiSecurity';
import NetworkGraph from './NetworkGraph';
import EncryptionStatus from './EncryptionStatus';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and secure your digital infrastructure with real-time insights.
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrafficMonitor />
        </div>
        <div>
          <ThreatAnalysis />
        </div>
        <div>
          <ApiSecurity />
        </div>
        <div>
          <NetworkGraph />
        </div>
        <div>
          <EncryptionStatus />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
