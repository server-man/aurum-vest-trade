import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, CheckCircle, AlertTriangle, FileCheck } from "lucide-react";

const SOC2 = () => {
  return (
    <div className="min-h-screen bg-binance-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 md:px-8 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            SOC 2 <span className="text-gradient">Compliance</span>
          </h1>
          <p className="text-gray-400 mb-8">
            Our commitment to security, availability, processing integrity, confidentiality, and privacy
          </p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">What is SOC 2?</h2>
              <p className="mb-4">
                SOC 2 (Service Organization Control 2) is an auditing procedure developed by the American Institute 
                of CPAs (AICPA) that ensures service providers securely manage data to protect the interests and 
                privacy of their clients. Aurum Vest is committed to maintaining SOC 2 Type II compliance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Trust Service Criteria</h2>
              
              <div className="space-y-4">
                <div className="glass-effect rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <Shield className="h-8 w-8 text-binance-yellow flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-binance-yellow mb-2">Security</h3>
                      <p className="mb-2">
                        Protection of system resources against unauthorized access, use, or modification.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                        <li>Multi-factor authentication (MFA) and biometric authentication</li>
                        <li>Network security and firewall protection</li>
                        <li>Intrusion detection and prevention systems</li>
                        <li>Regular security assessments and penetration testing</li>
                        <li>Secure development lifecycle practices</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="glass-effect rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-8 w-8 text-binance-yellow flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-binance-yellow mb-2">Availability</h3>
                      <p className="mb-2">
                        The system is available for operation and use as committed or agreed.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                        <li>99.9% uptime SLA commitment</li>
                        <li>Redundant infrastructure and failover systems</li>
                        <li>24/7 system monitoring and alerting</li>
                        <li>Disaster recovery and business continuity plans</li>
                        <li>Regular backup procedures</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="glass-effect rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <FileCheck className="h-8 w-8 text-binance-yellow flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-binance-yellow mb-2">Processing Integrity</h3>
                      <p className="mb-2">
                        System processing is complete, valid, accurate, timely, and authorized.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                        <li>Transaction validation and verification procedures</li>
                        <li>Automated error detection and correction</li>
                        <li>Audit trails for all system activities</li>
                        <li>Quality assurance testing protocols</li>
                        <li>Data integrity checks and validation</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="glass-effect rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <Lock className="h-8 w-8 text-binance-yellow flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-binance-yellow mb-2">Confidentiality</h3>
                      <p className="mb-2">
                        Information designated as confidential is protected as committed or agreed.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                        <li>End-to-end encryption for data in transit and at rest</li>
                        <li>Access controls and role-based permissions</li>
                        <li>Confidentiality agreements with all personnel</li>
                        <li>Secure key management practices</li>
                        <li>Data classification and handling procedures</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="glass-effect rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <Eye className="h-8 w-8 text-binance-yellow flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-binance-yellow mb-2">Privacy</h3>
                      <p className="mb-2">
                        Personal information is collected, used, retained, disclosed, and disposed of properly.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm ml-4">
                        <li>Privacy policy and user consent management</li>
                        <li>Data minimization and purpose limitation</li>
                        <li>User rights management (access, deletion, portability)</li>
                        <li>Privacy impact assessments</li>
                        <li>GDPR and privacy regulation compliance</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Our Security Controls</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass-effect rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-binance-yellow mb-2">Physical Security</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Tier 3+ data centers</li>
                    <li>24/7 physical security</li>
                    <li>Biometric access controls</li>
                    <li>Video surveillance</li>
                  </ul>
                </div>

                <div className="glass-effect rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-binance-yellow mb-2">Logical Security</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Role-based access control (RBAC)</li>
                    <li>Least privilege principle</li>
                    <li>Session management</li>
                    <li>Automated account lockout</li>
                  </ul>
                </div>

                <div className="glass-effect rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-binance-yellow mb-2">Change Management</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Formal change approval process</li>
                    <li>Testing environments</li>
                    <li>Rollback procedures</li>
                    <li>Change documentation</li>
                  </ul>
                </div>

                <div className="glass-effect rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-binance-yellow mb-2">Incident Response</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>24/7 incident response team</li>
                    <li>Documented response procedures</li>
                    <li>Post-incident analysis</li>
                    <li>User notification protocols</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Audit Process</h2>
              <p className="mb-4">
                Our SOC 2 Type II audit is performed annually by an independent third-party auditor to verify that:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Our security controls are properly designed</li>
                <li>Controls are operating effectively over time</li>
                <li>We meet all relevant Trust Service Criteria</li>
                <li>Our systems protect customer data appropriately</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Compliance Monitoring</h2>
              <p className="mb-4">We continuously monitor our compliance through:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Automated security scanning and vulnerability assessments</li>
                <li>Regular internal audits and control testing</li>
                <li>Employee security awareness training</li>
                <li>Third-party vendor risk assessments</li>
                <li>Continuous improvement of security practices</li>
              </ul>
            </section>

            <section className="glass-effect rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Request SOC 2 Report</h2>
              <p className="mb-4">
                Enterprise customers can request a copy of our latest SOC 2 Type II report under NDA. 
                This report provides detailed information about our security controls and audit results.
              </p>
              <p>
                <strong>Contact:</strong>{" "}
                <a href="mailto:compliance@aurumvest.com" className="text-binance-yellow hover:underline">
                  compliance@aurumvest.com
                </a>
              </p>
            </section>

            <section>
              <div className="bg-binance-yellow/10 border border-binance-yellow/30 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <AlertTriangle className="h-6 w-6 text-binance-yellow flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Security Notice</h3>
                    <p className="text-sm">
                      While we maintain rigorous security controls, no system is 100% secure. We encourage users 
                      to follow security best practices including using strong passwords, enabling 2FA, and 
                      monitoring account activity regularly.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SOC2;