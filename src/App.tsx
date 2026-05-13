import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AIChatbot } from "@/components/AIChatbot";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Privacy from "./pages/Privacy.tsx";
import Blog from "./pages/Blog.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import DiagnosticQuiz from "./pages/DiagnosticQuiz.tsx";
import Auth from "./pages/Auth.tsx";
import FlowsightAdsLanding from "./pages/FlowsightAdsLanding";

import FlowsightAdsDashboard from "./pages/FlowsightAdsDashboard";
import ResetPassword from "./pages/ResetPassword";
import AuthCallback from "./pages/AuthCallback";
import { useEffect } from "react";
import { supabase } from "./lib/supabaseClient";

import { HubLayout } from "./pages/hub/HubLayout";
import { HubOverview } from "./pages/hub/HubOverview";
import { HubPipeline } from "./pages/hub/HubPipeline";
import { HubCustomers } from "./pages/hub/HubCustomers";
import { HubPlaceholder } from "./pages/hub/HubPlaceholder";

const queryClient = new QueryClient();
const ADS_AUTH_INTENT_KEY = "flowsight_ads_auth_intent";

const redirectToAdsDashboardIfNeeded = (session: any) => {
  if (!session) return;
  if (sessionStorage.getItem(ADS_AUTH_INTENT_KEY) !== "true") return;
  if (window.location.pathname === "/flowsight-ads/dashboard") return;

  sessionStorage.removeItem(ADS_AUTH_INTENT_KEY);
  window.location.replace("/flowsight-ads/dashboard");
};

const App = () => {
  useEffect(() => {
    // Escuchar cambios de autenticación para redirecciones globales (como Ads)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          redirectToAdsDashboardIfNeeded(session);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <ErrorBoundary>
                <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/privacidad" element={<Privacy />} />
                <Route path="/diagnostico" element={<DiagnosticQuiz />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/flowsight-ads" element={<FlowsightAdsLanding />} />
                <Route path="/flowsight-ads/dashboard" element={<FlowsightAdsDashboard />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                
                {/* FLOWSIGHTS HUB ROUTES */}
                <Route path="/hub" element={<HubLayout><HubOverview /></HubLayout>} />
                <Route path="/hub/customers" element={<HubLayout><HubCustomers /></HubLayout>} />
                <Route path="/hub/pipeline" element={<HubLayout><HubPipeline /></HubLayout>} />
                <Route path="/hub/services" element={<HubLayout><HubPlaceholder title="Services & Experiences" /></HubLayout>} />
                <Route path="/hub/calendar" element={<HubLayout><HubPlaceholder title="Operations Calendar" /></HubLayout>} />
                <Route path="/hub/itineraries" element={<HubLayout><HubPlaceholder title="Itinerary Builder" /></HubLayout>} />
                <Route path="/hub/communications" element={<HubLayout><HubPlaceholder title="Communication Center" /></HubLayout>} />
                <Route path="/hub/analytics" element={<HubLayout><HubPlaceholder title="Analytics & Reports" /></HubLayout>} />
                <Route path="/hub/ai" element={<HubLayout><HubPlaceholder title="FlowSights AI Assistant" /></HubLayout>} />
                <Route path="/hub/settings" element={<HubLayout><HubPlaceholder title="Hub Settings" /></HubLayout>} />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              {/* AI Chatbot disponible globalmente en todas las páginas */}
              <AIChatbot />
            </ErrorBoundary>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
  );
};

export default App;

// Trigger new deployment after VITE_ env vars added
