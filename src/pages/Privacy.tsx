
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-binance-black text-white">
      <Navbar />
      
      <section className="pt-32 pb-20 relative">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-binance-yellow/5 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Privacy Policy</h1>
            <div className="bg-binance-darkGray/50 rounded-xl p-6 md:p-8 space-y-6">
              <p className="text-gray-300">
                Last Updated: June 1, 2023
              </p>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 text-white">1. Introduction</h2>
                <p className="text-gray-300">
                  At CryptoVest ("we", "our", or "us"), we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and use our services, regardless of where you visit it from, and tell you about your privacy rights and how the law protects you.
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 text-white">2. The Data We Collect About You</h2>
                <p className="text-gray-300">
                  Personal data means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-300">
                  <li>Identity Data includes first name, last name, username or similar identifier.</li>
                  <li>Contact Data includes email address and telephone numbers.</li>
                  <li>Financial Data includes cryptocurrency wallet addresses only.</li>
                  <li>Transaction Data includes details about trading activities and bot performance through our platform.</li>
                  <li>Technical Data includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                  <li>Profile Data includes your username and password, trades made by you, your interests, preferences, feedback, and survey responses.</li>
                  <li>Usage Data includes information about how you use our website and services.</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 text-white">3. How We Use Your Personal Data</h2>
                <p className="text-gray-300">
                  We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-300">
                  <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                  <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                  <li>Where we need to comply with a legal obligation.</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 text-white">4. Data Security</h2>
                <p className="text-gray-300">
                  We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 text-white">5. Data Retention</h2>
                <p className="text-gray-300">
                  We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements.
                </p>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 text-white">6. Your Legal Rights</h2>
                <p className="text-gray-300">
                  Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-300">
                  <li>Request access to your personal data.</li>
                  <li>Request correction of your personal data.</li>
                  <li>Request erasure of your personal data.</li>
                  <li>Object to processing of your personal data.</li>
                  <li>Request restriction of processing your personal data.</li>
                  <li>Request transfer of your personal data.</li>
                  <li>Right to withdraw consent.</li>
                </ul>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-3 text-white">7. Contact Us</h2>
                <p className="text-gray-300">
                  If you have any questions about this privacy policy or our privacy practices, please contact us at:
                </p>
                <div className="mt-2 text-binance-yellow">
                  privacy@cryptovest.com
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

export default Privacy;
