
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Search, AlertTriangle, Shield, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { scanDomain } from '@/services/securityScanService';
import ScanResultsSummary from '@/components/ScanResultsSummary';
import VulnerabilityList from '@/components/VulnerabilityList';
import SecurityHeadersCheck from '@/components/SecurityHeadersCheck';

// Define the form values type
interface ScanFormValues {
  domain: string;
}

// Define the scan result type
interface ScanResult {
  domain: string;
  timestamp: string;
  scanId: string;
  securityScore: number;
  vulnerabilities: any[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  };
  tlsInfo: {
    certificate: {
      validUntil: string;
      issuer: string;
      version: string;
    };
    protocols: {
      name: string;
      secure: boolean;
    }[];
  };
  headers: {
    name: string;
    value: string;
    status: 'good' | 'warning' | 'bad';
  }[];
}

const SecurityScan: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Initialize form with react-hook-form
  const form = useForm<ScanFormValues>({
    defaultValues: {
      domain: '',
    },
  });

  // Handle form submission
  const onSubmit = async (values: ScanFormValues) => {
    try {
      // Clear previous results and errors
      setScanResult(null);
      setError(null);
      setIsScanning(true);
      
      // Format domain (add https:// if missing)
      let domain = values.domain.trim();
      if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
        domain = `https://${domain}`;
      }
      
      // Extract hostname from URL
      const hostname = new URL(domain).hostname;
      
      // Call the scan service
      const result = await scanDomain(hostname);
      
      // Store result and show success toast
      setScanResult(result);
      toast({
        title: "Scan completed",
        description: `Security scan for ${hostname} completed successfully.`,
      });
    } catch (err) {
      // Handle error
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast({
        variant: "destructive",
        title: "Scan failed",
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Security Scanner</h1>
        <p className="text-muted-foreground">
          Scan government websites for security vulnerabilities and compliance issues.
        </p>
      </div>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            <span>Domain Security Scanner</span>
          </CardTitle>
          <CardDescription>
            Enter a government domain to analyze security configuration and vulnerabilities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter a government domain (e.g., example.gov.in)" 
                        {...field} 
                        className="bg-background"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isScanning}
              >
                {isScanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Start Security Scan
                  </>
                )}
              </Button>
            </form>
          </Form>
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Scan Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          This scanner is designed for authorized security testing of government websites only. 
          Use in accordance with responsible disclosure policies.
        </CardFooter>
      </Card>
      
      {scanResult && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ScanResultsSummary 
              securityScore={scanResult.securityScore}
              summary={scanResult.summary}
              domain={scanResult.domain}
              timestamp={scanResult.timestamp}
            />
            <SecurityHeadersCheck 
              headers={scanResult.headers}
              tlsInfo={scanResult.tlsInfo}
            />
          </div>
          
          <VulnerabilityList vulnerabilities={scanResult.vulnerabilities} />
        </div>
      )}
    </div>
  );
};

export default SecurityScan;
