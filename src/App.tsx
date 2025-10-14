import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Cookies from "./pages/Cookies";
import GDPR from "./pages/GDPR";
import SOC2 from "./pages/SOC2";
import Admin from "./pages/Admin";
import ContentBot from "./pages/admin/ContentBot";
import Logo from "./pages/Logo";
import NotFound from "./pages/NotFound";
import AdminRoute from "./components/AdminRoute";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import Signals from "./pages/dashboard/Signals";
import Wallet from "./pages/dashboard/Wallet";
import TradingBotsPage from "./pages/dashboard/TradingBotsPage";
import Profile from "./pages/dashboard/Profile";
import Support from "./pages/dashboard/Support";
import MemeCoins from "./pages/dashboard/MemeCoins";
import Airdrop from "./pages/dashboard/Airdrop";
import Investo from "./pages/dashboard/Investo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/gdpr" element={<GDPR />} />
          <Route path="/soc2" element={<SOC2 />} />
          <Route path="/logo" element={<Logo />} />
          <Route
            path="/admin" 
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            } 
          />
          <Route
            path="/admin/content" 
            element={
              <AdminRoute>
                <ContentBot />
              </AdminRoute>
            } 
          />
            
            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
              <Route index element={<DashboardOverview />} />
              <Route path="overview" element={<DashboardOverview />} />
              <Route path="signals" element={<Signals />} />
              <Route path="wallet" element={<Wallet />} />
              <Route path="bots" element={<TradingBotsPage />} />
              <Route path="profile" element={<Profile />} />
              <Route path="support" element={<Support />} />
              <Route path="meme-coins" element={<MemeCoins />} />
              <Route path="airdrop" element={<Airdrop />} />
              <Route path="investo" element={<Investo />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
