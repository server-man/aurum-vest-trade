import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Phone, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-binance-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 md:px-8 pt-24 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Contact <span className="text-gradient">Support</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Have questions? We're here to help 24/7
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="glass-effect rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-binance-darkGray border-binance-darkGray text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-binance-darkGray border-binance-darkGray text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="bg-binance-darkGray border-binance-darkGray text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="bg-binance-darkGray border-binance-darkGray text-white"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-binance-yellow text-binance-black hover:brightness-110"
                >
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="glass-effect rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-binance-yellow mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Email Support</h3>
                    <p className="text-gray-400 mb-2">
                      Get in touch via email for non-urgent inquiries
                    </p>
                    <a href="mailto:support@aurumvest.com" className="text-binance-yellow hover:underline">
                      support@aurumvest.xyz
                    </a>
                  </div>
                </div>
              </div>

              <div className="glass-effect rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <MessageSquare className="h-6 w-6 text-binance-yellow mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
                    <p className="text-gray-400 mb-2">
                      Chat with our support team in real-time
                    </p>
                    <p className="text-binance-yellow">Available 24/7</p>
                  </div>
                </div>
              </div>

              <div className="glass-effect rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-binance-yellow mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Phone Support</h3>
                    <p className="text-gray-400 mb-2">
                      Premium members get priority phone support
                    </p>
                    <p className="text-binance-yellow">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>

              <div className="glass-effect rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-binance-yellow mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Office Location</h3>
                    <p className="text-gray-400">
                      123 Crypto Street<br />
                      San Francisco, CA 94102<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
