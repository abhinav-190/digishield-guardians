
// Security Scanner Service - Simulates backend API calls for security scanning

interface VulnerabilityResult {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  name: string;
  description: string;
  recommendation: string;
  cvss: number;
}

interface ScanResult {
  domain: string;
  timestamp: string;
  scanId: string;
  securityScore: number;
  vulnerabilities: VulnerabilityResult[];
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

// Common web vulnerabilities for government sites
const commonVulnerabilities: VulnerabilityResult[] = [
  {
    id: 'CVE-2021-44228',
    severity: 'critical',
    name: 'Log4j Remote Code Execution',
    description: 'Remote attackers can exploit this vulnerability to take control of the system.',
    recommendation: 'Update Log4j to version 2.15.0 or later immediately.',
    cvss: 10.0
  },
  {
    id: 'CVE-2021-27101',
    severity: 'high',
    name: 'SQL Injection Vulnerability',
    description: 'Input validation issues in web forms allowing SQL injection attacks.',
    recommendation: 'Implement proper input validation and prepared statements.',
    cvss: 8.5
  },
  {
    id: 'CVE-2022-22965',
    severity: 'critical',
    name: 'Spring4Shell RCE',
    description: 'Remote Code Execution vulnerability in Spring Framework.',
    recommendation: 'Update to Spring Framework 5.3.18 or later.',
    cvss: 9.8
  },
  {
    id: 'CVE-2021-44515',
    severity: 'medium',
    name: 'Cross-Site Scripting (XSS)',
    description: 'Reflected XSS vulnerability in search functionality.',
    recommendation: 'Implement proper output encoding and CSP headers.',
    cvss: 6.4
  },
  {
    id: 'CVE-2022-30190',
    severity: 'high', 
    name: 'MSDT Follina Vulnerability',
    description: 'Microsoft Windows Support Diagnostic Tool vulnerability.',
    recommendation: 'Apply Microsoft security patch KB5014699.',
    cvss: 7.8
  },
  {
    id: 'CVE-2021-1675',
    severity: 'high',
    name: 'PrintNightmare',
    description: 'Windows Print Spooler elevation of privilege vulnerability.',
    recommendation: 'Disable the Print Spooler service or apply patches.',
    cvss: 8.2
  },
  {
    id: 'CVE-2022-37706',
    severity: 'medium',
    name: 'CSRF Vulnerability',
    description: 'Cross-Site Request Forgery in form submissions.',
    recommendation: 'Implement anti-CSRF tokens in all forms.',
    cvss: 5.7
  },
  {
    id: 'CVE-2021-34527',
    severity: 'low',
    name: 'Information Disclosure',
    description: 'Server exposes sensitive version information in HTTP headers.',
    recommendation: 'Configure server to hide version information.',
    cvss: 3.5
  },
  {
    id: 'CVE-2022-22947',
    severity: 'high',
    name: 'Spring Cloud Gateway RCE',
    description: 'Remote code execution vulnerability in Spring Cloud Gateway.',
    recommendation: 'Update to Spring Cloud Gateway 3.1.1 or later.',
    cvss: 8.7
  },
  {
    id: 'CVE-2022-31656',
    severity: 'low',
    name: 'Missing HTTP Strict Transport Security',
    description: 'HSTS header is not set, potentially allowing downgrade attacks.',
    recommendation: 'Configure web server to set HSTS header with appropriate max-age.',
    cvss: 3.2
  }
];

// HTTP security headers commonly checked in security scans
const securityHeaders = [
  { name: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains', status: 'good' },
  { name: 'Content-Security-Policy', value: "default-src 'self'", status: 'good' },
  { name: 'X-Content-Type-Options', value: 'nosniff', status: 'good' },
  { name: 'X-Frame-Options', value: 'DENY', status: 'good' },
  { name: 'Referrer-Policy', value: 'strict-origin-when-cross-origin', status: 'good' },
  { name: 'Permissions-Policy', value: 'geolocation=()', status: 'good' },
  { name: 'X-XSS-Protection', value: '1; mode=block', status: 'warning' },
];

// TLS protocols with security status
const tlsProtocols = [
  { name: 'TLS 1.3', secure: true },
  { name: 'TLS 1.2', secure: true },
  { name: 'TLS 1.1', secure: false },
  { name: 'TLS 1.0', secure: false },
  { name: 'SSL 3.0', secure: false },
];

// Certificate authorities for government sites
const certificateIssuers = [
  'DigiCert Government CA',
  'Entrust Government CA',
  'GeoTrust Government CA',
  'Sectigo Government CA',
  'GlobalSign Government CA',
];

// Simulate a security scan by generating randomized but realistic results
export const scanDomain = async (domain: string): Promise<ScanResult> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Validate domain is a government website
  if (!domain.endsWith('.gov') && !domain.endsWith('.gov.in') && !domain.includes('government')) {
    throw new Error('Only government websites can be scanned.');
  }
  
  // Generate a random set of vulnerabilities (3-7 items)
  const vulnerabilityCount = Math.floor(Math.random() * 5) + 3;
  const shuffled = [...commonVulnerabilities].sort(() => 0.5 - Math.random());
  const selectedVulnerabilities = shuffled.slice(0, vulnerabilityCount);
  
  // Count vulnerabilities by severity
  const criticalCount = selectedVulnerabilities.filter(v => v.severity === 'critical').length;
  const highCount = selectedVulnerabilities.filter(v => v.severity === 'high').length;
  const mediumCount = selectedVulnerabilities.filter(v => v.severity === 'medium').length;
  const lowCount = selectedVulnerabilities.filter(v => v.severity === 'low').length;
  
  // Calculate security score (0-100)
  // Weighted by severity: critical (-25), high (-15), medium (-8), low (-3)
  const securityScore = Math.max(0, 100 - (criticalCount * 25 + highCount * 15 + mediumCount * 8 + lowCount * 3));
  
  // Generate random TLS info
  const tlsInfo = {
    certificate: {
      validUntil: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      issuer: certificateIssuers[Math.floor(Math.random() * certificateIssuers.length)],
      version: 'v3',
    },
    protocols: tlsProtocols.filter(() => Math.random() > 0.3), // Randomly include some protocols
  };
  
  // Generate HTTP headers with random statuses
  const headers = securityHeaders.map(header => ({
    ...header,
    status: Math.random() > 0.7 ? 'warning' : (Math.random() > 0.8 ? 'bad' : 'good') as 'good' | 'warning' | 'bad',
  }));
  
  return {
    domain,
    timestamp: new Date().toISOString(),
    scanId: `scan-${Math.random().toString(36).substring(2, 15)}`,
    securityScore,
    vulnerabilities: selectedVulnerabilities,
    summary: {
      critical: criticalCount,
      high: highCount,
      medium: mediumCount,
      low: lowCount,
      total: vulnerabilityCount,
    },
    tlsInfo,
    headers,
  };
};
