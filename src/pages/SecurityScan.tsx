
import React, { useState } from 'react';
import { Shield, Search, AlertTriangle, Lock, Server, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';

// Mock data for demonstration purposes
const mockVulnerabilities = {
  'xss': {
    name: 'Cross-Site Scripting (XSS)',
    description: 'Vulnerability that allows attackers to inject malicious scripts into web pages.',
    severity: 'high',
    recommendation: 'Implement Content Security Policy and validate/sanitize all user inputs.'
  },
  'sqli': {
    name: 'SQL Injection',
    description: 'Allows attackers to execute malicious SQL statements to manipulate the database.',
    severity: 'critical',
    recommendation: 'Use parameterized queries or prepared statements. Validate all inputs.'
  },
  'csrf': {
    name: 'Cross-Site Request Forgery',
    description: 'Forces authenticated users to execute unwanted actions on a web application.',
    severity: 'medium',
    recommendation: 'Implement anti-CSRF tokens and SameSite cookie attributes.'
  },
  'outdated': {
    name: 'Outdated Software',
    description: 'Using software versions with known vulnerabilities.',
    severity: 'medium',
    recommendation: 'Regularly update and patch all software components.'
  },
  'ssl': {
    name: 'Weak SSL/TLS Configuration',
    description: 'Insecure cipher suites or protocol versions that can be exploited.',
    severity: 'high',
    recommendation: 'Configure servers to use only strong ciphers and TLS 1.2+ protocols.'
  }
};

// Security risk severity icons and colors
const SeverityIcon = ({ severity }: { severity: string }) => {
  switch (severity) {
    case 'critical':
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case 'high':
      return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    case 'medium':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'low':
      return <AlertTriangle className="h-5 w-5 text-green-500" />;
    default:
      return <AlertTriangle className="h-5 w-5 text-muted-foreground" />;
  }
};

const SecurityScan: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);
  const { toast } = useToast();

  // Simulate a security scan - in a real app, this would be an API call
  const handleScan = async () => {
    if (!domain) {
      toast({
        title: "Error",
        description: "Please enter a domain to scan",
        variant: "destructive",
      });
      return;
    }

    // Validate domain format
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      toast({
        title: "Invalid Domain",
        description: "Please enter a valid domain (e.g., example.gov.in)",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    setScanResults(null);

    try {
      // Simulate backend API call with a delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // For demonstration, we'll randomly assign some vulnerabilities
      const foundVulnerabilities: any = {};
      const allVulnKeys = Object.keys(mockVulnerabilities);
      
      // Randomly select 0-4 vulnerabilities
      const numVuln = Math.floor(Math.random() * 5);
      
      // Shuffle and select vulnerabilities
      const shuffled = [...allVulnKeys].sort(() => 0.5 - Math.random());
      for (let i = 0; i < numVuln; i++) {
        const key = shuffled[i];
        foundVulnerabilities[key] = mockVulnerabilities[key as keyof typeof mockVulnerabilities];
      }
      
      // Generate mock security score (higher is better)
      const securityScore = Math.max(40, 100 - (numVuln * 15) - Math.floor(Math.random() * 10));
      
      // Create complete scan results
      const results = {
        domain,
        timestamp: new Date().toISOString(),
        securityScore,
        vulnerabilities: foundVulnerabilities,
        scanDuration: (Math.random() * 3 + 1).toFixed(2),
        sslCertificate: {
          valid: Math.random() > 0.3, // 70% chance of valid certificate
          expiryDate: new Date(Date.now() + (Math.random() * 365 + 30) * 24 * 60 * 60 * 1000).toISOString(),
          issuer: ['DigiCert', 'Let\'s Encrypt', 'Sectigo', 'GeoTrust'][Math.floor(Math.random() * 4)]
        },
        headers: {
          'Content-Security-Policy': Math.random() > 0.5,
          'X-XSS-Protection': Math.random() > 0.3,
          'X-Content-Type-Options': Math.random() > 0.4,
          'Strict-Transport-Security': Math.random() > 0.6
        }
      };
      
      setScanResults(results);
      
      toast({
        title: "Scan Complete",
        description: `Security assessment for ${domain} completed successfully.`,
      });
    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: "Scan Failed",
        description: "There was an error scanning the domain. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Website Security Assessment</h1>
        <p className="text-muted-foreground">
          Scan government websites for security vulnerabilities and receive detailed assessments.
        </p>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            <span>Domain Security Scanner</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              placeholder="Enter domain (e.g., example.gov.in)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleScan} 
              disabled={isScanning}
              className="min-w-[120px]"
            >
              {isScanning ? "Scanning..." : "Scan Domain"}
            </Button>
          </div>
          
          {isScanning && (
            <div className="mt-4 p-4 text-center">
              <div className="animate-pulse flex flex-col items-center gap-2">
                <Shield className="h-12 w-12 text-primary" />
                <p className="text-muted-foreground">Scanning {domain}...</p>
                <p className="text-xs text-muted-foreground">Checking for vulnerabilities and security issues</p>
              </div>
            </div>
          )}
          
          {scanResults && (
            <div className="mt-6 space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{scanResults.domain}</h3>
                  <p className="text-sm text-muted-foreground">Scanned on {new Date(scanResults.timestamp).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Scan duration: {scanResults.scanDuration}s</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`text-3xl font-bold ${getScoreColor(scanResults.securityScore)}`}>
                    {scanResults.securityScore}/100
                  </div>
                  <div className="text-sm text-muted-foreground">Security Score</div>
                </div>
              </div>
              
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <Card className="bg-secondary/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Server className="h-4 w-4" /> 
                      Server Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>SSL Certificate</span>
                        <span className={scanResults.sslCertificate.valid ? "text-green-500" : "text-red-500"}>
                          {scanResults.sslCertificate.valid ? "Valid" : "Invalid"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Certificate Issuer</span>
                        <span>{scanResults.sslCertificate.issuer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Expiry Date</span>
                        <span>{new Date(scanResults.sslCertificate.expiryDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-secondary/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Globe className="h-4 w-4" /> 
                      Security Headers
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <div className="space-y-2">
                      {Object.entries(scanResults.headers).map(([header, implemented]: [string, boolean]) => (
                        <div key={header} className="flex justify-between">
                          <span>{header}</span>
                          <span className={implemented ? "text-green-500" : "text-red-500"}>
                            {implemented ? "Implemented" : "Missing"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Vulnerabilities Found</h3>
                
                {Object.keys(scanResults.vulnerabilities).length === 0 ? (
                  <div className="p-6 text-center">
                    <Shield className="h-12 w-12 mx-auto text-green-500 mb-2" />
                    <h4 className="text-lg font-medium">No Vulnerabilities Detected</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      The website appears to be secure. Continue to monitor regularly.
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px] rounded-md border">
                    <div className="p-4 space-y-4">
                      {Object.entries(scanResults.vulnerabilities).map(([key, vuln]: [string, any]) => (
                        <Card key={key} className="bg-secondary/50">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-md font-medium flex items-center gap-2">
                              <SeverityIcon severity={vuln.severity} />
                              <span>
                                {vuln.name}
                                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-secondary">
                                  {vuln.severity.toUpperCase()}
                                </span>
                              </span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm mb-2">{vuln.description}</p>
                            <div className="text-sm bg-secondary/70 p-3 rounded mt-2">
                              <strong className="text-xs uppercase tracking-wider">Recommendation:</strong>
                              <p className="mt-1">{vuln.recommendation}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityScan;
