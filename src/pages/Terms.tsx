import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-binance-black text-white">
      <Navbar />
      
      <section className="pt-32 pb-20 relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-binance-yellow/5 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Terms and Conditions</h1>
            <div className="bg-binance-darkGray/50 rounded-xl p-6 md:p-8 space-y-6">
              <p className="text-gray-300">
                Last Updated: June 1, 2023
              </p>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 text-white">1. Introduction</h2>
                <p className="text-gray-300">
                  Welcome to Aurum Vest ("Company", "we", "our", "us"). These Terms of Service ("Terms", "Terms of Service") govern your use of our website and services operated by Aurum Vest.
                </p>
                <p className="text-gray-300 mt-2">
                  By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 text-white">2. Accounts</h2>
                <p className="text-gray-300">
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                </p>
                <p className="text-gray-300 mt-2">
                  You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 text-white">3. Trading Bots and Automated Trading</h2>
                <p className="text-gray-300">
                  Our platform provides automated cryptocurrency trading bots. By using our trading bots, you acknowledge the following:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-300">
                  <li>Cryptocurrency trading involves significant risk, including the potential loss of your investment.</li>
                  <li>Past performance of our trading bots is not indicative of future results.</li>
                  <li>We do not guarantee any specific outcomes or profits from using our trading bots.</li>
                  <li>You are solely responsible for managing your trading strategies and risk management.</li>
                  <li>Technical issues, market volatility, or other factors may affect the performance of our trading bots.</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 text-white">4. API Keys and Security</h2>
                <p className="text-gray-300">
                  To use certain features of our Service, you may need to provide API keys from cryptocurrency exchanges. By providing API keys, you:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-300">
                  <li>Confirm that you have the right to use these API keys.</li>
                  <li>Understand that we store these keys using industry-standard encryption.</li>
                  <li>Acknowledge that we are not responsible for any breaches or security issues on the exchanges you connect to.</li>
                  <li>Agree to configure your API keys with appropriate permissions (e.g., trading only, no withdrawal permissions).</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 text-white">5. Subscription and Fees</h2>
                <p className="text-gray-300">
                  Some aspects of the Service may be offered on a subscription basis. By subscribing to our service:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-300">
                  <li>You agree to pay all fees associated with your subscription plan.</li>
                  <li>Subscriptions will automatically renew unless cancelled before the renewal date.</li>
                  <li>Refunds may be provided in accordance with our refund policy.</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 text-white">6. Limitation of Liability</h2>
                <p className="text-gray-300">
                  In no event shall Aurum Vest,nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-300">
                  <li>Your use or inability to use the Service.</li>
                  <li>Any trading decisions made based on our trading bots or platform.</li>
                  <li>Unauthorized access to or use of our servers and/or any personal information stored therein.</li>
                  <li>Interruption or cessation of transmission to or from our Service.</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 text-white">7. Governing Law</h2>
                <p className="text-gray-300">
                  These Terms shall be governed by and construed in accordance with the laws of [Your Country], without regard to its conflict of law provisions.
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 text-white">8. Changes to Terms</h2>
                <p className="text-gray-300">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of changes by posting the updated terms on this page. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 text-white">9. Contact Us</h2>
                <p className="text-gray-300">
                  If you have any questions about these Terms, please contact us at:
                </p>
                <div className="mt-2 text-binance-yellow">
                  legal@aurumvest.xyz
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Terms;
