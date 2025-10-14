import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Lock, Eye, UserCheck, FileText, Database } from "lucide-react";

const GDPR = () => {
  return (
    <div className="min-h-screen bg-binance-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 md:px-8 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            GDPR <span className="text-gradient">Compliance</span>
          </h1>
          <p className="text-gray-400 mb-8">
            We are committed to protecting your privacy and complying with the General Data Protection Regulation (GDPR)
          </p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Our Commitment</h2>
              <p className="mb-4">
                Aurum Vest is fully committed to protecting the personal data of all individuals in the European Union (EU) 
                and European Economic Area (EEA) in accordance with the GDPR. We have implemented comprehensive measures 
                to ensure your data is processed lawfully, fairly, and transparently.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Your Rights Under GDPR</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass-effect rounded-lg p-6">
                  <Eye className="h-8 w-8 text-binance-yellow mb-3" />
                  <h3 className="text-xl font-semibold mb-2">Right to Access</h3>
                  <p className="text-sm">
                    You have the right to request a copy of all personal data we hold about you.
                  </p>
                </div>

                <div className="glass-effect rounded-lg p-6">
                  <FileText className="h-8 w-8 text-binance-yellow mb-3" />
                  <h3 className="text-xl font-semibold mb-2">Right to Rectification</h3>
                  <p className="text-sm">
                    You can request correction of inaccurate or incomplete personal data.
                  </p>
                </div>

                <div className="glass-effect rounded-lg p-6">
                  <Database className="h-8 w-8 text-binance-yellow mb-3" />
                  <h3 className="text-xl font-semibold mb-2">Right to Erasure</h3>
                  <p className="text-sm">
                    You can request deletion of your personal data under certain circumstances.
                  </p>
                </div>

                <div className="glass-effect rounded-lg p-6">
                  <Lock className="h-8 w-8 text-binance-yellow mb-3" />
                  <h3 className="text-xl font-semibold mb-2">Right to Restriction</h3>
                  <p className="text-sm">
                    You can request limitation on how we process your personal data.
                  </p>
                </div>

                <div className="glass-effect rounded-lg p-6">
                  <UserCheck className="h-8 w-8 text-binance-yellow mb-3" />
                  <h3 className="text-xl font-semibold mb-2">Right to Portability</h3>
                  <p className="text-sm">
                    You can receive your data in a structured, commonly used format.
                  </p>
                </div>

                <div className="glass-effect rounded-lg p-6">
                  <Shield className="h-8 w-8 text-binance-yellow mb-3" />
                  <h3 className="text-xl font-semibold mb-2">Right to Object</h3>
                  <p className="text-sm">
                    You can object to processing of your personal data in certain situations.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data We Collect</h2>
              <p className="mb-4">We collect and process the following types of personal data:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Identity information (name, email, phone number)</li>
                <li>Financial information (wallet addresses, transaction history)</li>
                <li>Technical data (IP address, browser type, device information)</li>
                <li>Usage data (how you interact with our platform)</li>
                <li>KYC verification documents (as required by regulations)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Legal Basis for Processing</h2>
              <p className="mb-4">We process your personal data based on:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Consent:</strong> When you explicitly agree to processing for specific purposes</li>
                <li><strong>Contract:</strong> When necessary to provide our services to you</li>
                <li><strong>Legal Obligation:</strong> When required by law (e.g., KYC requirements)</li>
                <li><strong>Legitimate Interests:</strong> For fraud prevention, security, and service improvement</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Security Measures</h2>
              <p className="mb-4">We implement robust security measures including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>End-to-end encryption for sensitive data</li>
                <li>Two-factor authentication (2FA) and biometric authentication</li>
                <li>Regular security audits and penetration testing</li>
                <li>Secure data centers with 24/7 monitoring</li>
                <li>Employee training on data protection practices</li>
                <li>Incident response and breach notification procedures</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Retention</h2>
              <p>
                We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, 
                comply with legal obligations, resolve disputes, and enforce our agreements. When data is no longer needed, 
                it is securely deleted or anonymized.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">International Data Transfers</h2>
              <p>
                When transferring data outside the EU/EEA, we ensure adequate safeguards are in place, such as:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>Standard Contractual Clauses approved by the European Commission</li>
                <li>Adequacy decisions recognizing equivalent data protection standards</li>
                <li>Binding Corporate Rules for intra-group transfers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Exercising Your Rights</h2>
              <p className="mb-4">
                To exercise any of your GDPR rights, please contact our Data Protection Officer at:
              </p>
              <div className="glass-effect rounded-lg p-6">
                <p className="mb-2">
                  <strong>Email:</strong>{" "}
                  <a href="mailto:dpo@aurumvest.com" className="text-binance-yellow hover:underline">
                    dpo@aurumvest.com
                  </a>
                </p>
                <p>
                  <strong>Response Time:</strong> We will respond to your request within 30 days
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Complaints</h2>
              <p>
                If you believe we have not handled your personal data in accordance with GDPR, you have the right 
                to lodge a complaint with your local supervisory authority.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Updates to This Policy</h2>
              <p>
                We may update this GDPR compliance statement from time to time. Any changes will be posted on this page 
                with an updated revision date.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GDPR;