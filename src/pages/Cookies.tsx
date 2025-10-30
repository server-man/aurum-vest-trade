import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Cookies = () => {
  return (
    <div className="min-h-screen bg-binance-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 md:px-8 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Cookie <span className="text-gradient">Policy</span>
          </h1>
          <p className="text-gray-400 mb-8">Last Updated: January 2025</p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">What Are Cookies</h2>
              <p className="mb-4">
                Cookies are small text files that are placed on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and 
                understanding how you use our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">How We Use Cookies</h2>
              <p className="mb-4">We use cookies for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Essential Cookies:</strong> Required for the platform to function properly, including authentication and security features</li>
                <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our platform by collecting anonymous usage data</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences such as language, currency, and theme settings</li>
                <li><strong>Analytics Cookies:</strong> Help us improve our services by analyzing user behavior and platform performance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Types of Cookies We Use</h2>
              
              <div className="space-y-4">
                <div className="glass-effect rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-binance-yellow mb-2">Session Cookies</h3>
                  <p>Temporary cookies that expire when you close your browser. Used for authentication and security.</p>
                </div>

                <div className="glass-effect rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-binance-yellow mb-2">Persistent Cookies</h3>
                  <p>Remain on your device for a set period. Used to remember your preferences and settings.</p>
                </div>

                <div className="glass-effect rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-binance-yellow mb-2">Third-Party Cookies</h3>
                  <p>Set by external services we use, such as analytics providers and payment processors.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Managing Cookies</h2>
              <p className="mb-4">
                You can control and manage cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>View what cookies are stored on your device</li>
                <li>Delete all or specific cookies</li>
                <li>Block third-party cookies</li>
                <li>Block cookies from specific sites</li>
                <li>Accept or reject all cookies by default</li>
              </ul>
              <p className="mt-4">
                Please note that disabling certain cookies may affect the functionality of our platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Cookie Consent</h2>
              <p>
                By using our platform, you consent to our use of cookies as described in this policy. 
                You can withdraw your consent at any time by adjusting your browser settings or contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Updates to This Policy</h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices 
                or for legal, regulatory, or operational reasons. We encourage you to review this page 
                periodically for the latest information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <p>
                If you have questions about our use of cookies, please contact us at:{" "}
                <a href="mailto:privacy@aurumvest.xyz" className="text-binance-yellow hover:underline">
                  privacy@aurumvest.xyz
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cookies;
