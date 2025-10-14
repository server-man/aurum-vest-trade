import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Lazy load pages for better code splitting and performance
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const About = lazy(() => import("./pages/About"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const Cookies = lazy(() => import("./pages/Cookies"));
const GDPR = lazy(() => import("./pages/GDPR"));
const SOC2 = lazy(() => import("./pages/SOC2"));
const Admin = lazy(() => import("./pages/Admin"));
const ContentBot = lazy(() => import("./pages/admin/ContentBot"));
const Logo = lazy(() => import("./pages/Logo"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy load dashboard pages
const DashboardOverview = lazy(() => import("./pages/dashboard/DashboardOverview"));
const Signals = lazy(() => import("./pages/dashboard/Signals"));
const Wallet = lazy(() => import("./pages/dashboard/Wallet"));
const TradingBotsPage = lazy(() => import("./pages/dashboard/TradingBotsPage"));
const Profile = lazy(() => import("./pages/dashboard/Profile"));
const Support = lazy(() => import("./pages/dashboard/Support"));
const MemeCoins = lazy(() => import("./pages/dashboard/MemeCoins"));
const Airdrop = lazy(() => import("./pages/dashboard/Airdrop"));
const Investo = lazy(() => import("./pages/dashboard/Investo"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Optimized QueryClient configuration with memory leak prevention
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<PageLoader />}>
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
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
