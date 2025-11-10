import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Tigers from "./pages/Tigers";
import Elephants from "./pages/Elephants";
import MapView from "./pages/MapView";
import Analytics from "./pages/Analytics";
import Conflicts from "./pages/Conflicts";
import Settings from "./pages/Settings";
import StripeIdentification from "./pages/StripeIdentification";
import TigerProfile from "./pages/TigerProfile";
import ElephantProfile from "./pages/ElephantProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Debug: confirm App component mounted in browser
    // Remove these logs after debugging
    // eslint-disable-next-line no-console
    console.log("[debug] App component mounted");
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tigers" element={<Tigers />} />
              <Route path="/elephants" element={<Elephants />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/conflicts" element={<Conflicts />} />
              <Route path="/stripe-identification" element={<StripeIdentification />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/tigers/:id" element={<TigerProfile />} />
              <Route path="/elephants/:id" element={<ElephantProfile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
