import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ContactDialogProvider } from "@/contexts/ContactDialogContext";
import ContactDialog from "@/components/ContactDialog";
import FloatingContactButton from "@/components/FloatingContactButton";
import AccessGate from "@/components/AccessGate";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAntiInspect } from "@/hooks/useAntiInspect";
import Index from "./pages/Index";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ThankYou from "./pages/ThankYou";
import Hub from "./pages/Hub";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppShell = () => {
  const { isDevToolsOpen } = useAntiInspect();

  if (!isDevToolsOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-xl px-6"
      role="alertdialog"
      aria-live="assertive"
    >
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-3xl font-bold gradient-text-iscout">
          Vai farmar aura não, amigão!
        </h2>
        <p className="text-muted-foreground text-sm">
          Detectamos as ferramentas de desenvolvedor abertas. Feche o painel
          para continuar navegando no iSCOUT.
        </p>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <ContactDialogProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ErrorBoundary>
              <AppShell />
              <AccessGate>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/obrigado" element={<ThankYou />} />
                  <Route path="/hub" element={<Hub />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <ContactDialog />
                <FloatingContactButton />
              </AccessGate>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </ContactDialogProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
