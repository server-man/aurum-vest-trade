import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What is Aurum Vest?",
      answer: "Aurum Vest is an automated cryptocurrency trading platform that uses advanced bots to help you maximize your crypto investments with minimal effort. Our platform provides 24/7 trading, real-time analytics, and multiple trading strategies."
    },
    {
      question: "How do trading bots work?",
      answer: "Our trading bots use sophisticated algorithms and market analysis to execute trades automatically based on predefined strategies. They monitor market conditions 24/7 and make split-second decisions to capitalize on trading opportunities."
    },
    {
      question: "Is my investment safe?",
      answer: "Security is our top priority. We implement bank-level encryption, two-factor authentication (2FA), biometric authentication via passkeys, and secure PIN protection. Your funds are stored in secure wallets, and we never have direct access to your assets."
    },
    {
      question: "What are the fees?",
      answer: "We offer transparent pricing with no hidden fees. Trading fees vary by plan and exchange. Contact our support team for detailed pricing information tailored to your trading volume and requirements."
    },
    {
      question: "Can I withdraw my funds anytime?",
      answer: "Yes, you have full control over your funds. You can deposit and withdraw at any time. Withdrawal processing times depend on the blockchain network and typically take between a few minutes to a few hours."
    },
    {
      question: "What exchanges do you support?",
      answer: "We support major cryptocurrency exchanges including Binance, Coinbase Pro, Kraken, and more. The number of exchanges you can connect depends on your subscription plan."
    },
    {
      question: "Do I need trading experience?",
      answer: "No prior trading experience is required. Our platform is designed for both beginners and experienced traders. We provide pre-configured strategies and detailed guides to help you get started."
    },
    {
      question: "What is KYC verification?",
      answer: "KYC (Know Your Customer) is a verification process required by regulations. You'll need to submit a valid ID document and a selfie. This helps us maintain a secure platform and comply with financial regulations."
    },
    {
      question: "How does 2FA enhance security?",
      answer: "Two-Factor Authentication (2FA) adds an extra layer of security by requiring a second verification method (usually a code from an authenticator app) in addition to your password. This makes it much harder for unauthorized users to access your account."
    },
    {
      question: "What are trading signals?",
      answer: "Trading signals are market insights and recommendations provided by our analysis team. They include entry points, target prices, and stop-loss levels to help guide your trading decisions."
    },
    {
      question: "Can I customize trading strategies?",
      answer: "Yes, you can customize various parameters including risk level, trading pairs, stop-loss percentages, take-profit targets, and maximum active deals. Advanced users can create fully custom strategies."
    },
    {
      question: "What happens if a bot makes a losing trade?",
      answer: "All trading involves risk. Our bots use risk management features like stop-loss orders to limit potential losses. We recommend starting with lower risk levels and only investing what you can afford to lose."
    },
    {
      question: "How do I get support?",
      answer: "We offer 24/7 customer support through live chat, email (support@aurumvest.com), and our support ticket system. Premium plan users get priority support with faster response times."
    },
    {
      question: "Can I try before committing?",
      answer: "Yes, we offer a demo mode where you can test our platform with virtual funds. This allows you to familiarize yourself with the interface and test strategies without risking real money."
    }
  ];

  return (
    <div className="min-h-screen bg-binance-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 md:px-8 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Find answers to common questions about Aurum Vest
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="glass-effect rounded-lg border-none px-6"
              >
                <AccordionTrigger className="text-left hover:text-binance-yellow transition-colors py-6">
                  <span className="font-semibold text-lg">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-400 pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact CTA */}
          <div className="mt-16 text-center glass-effect rounded-xl p-8">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-gray-400 mb-6">
              Our support team is here to help you 24/7
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-binance-yellow text-binance-black font-semibold px-8 py-3 rounded-lg hover:brightness-110 transition-all"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;