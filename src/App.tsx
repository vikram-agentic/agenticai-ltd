import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import CaseStudies from "./pages/CaseStudies";
import Resources from "./pages/Resources";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import WhatIsAgenticAI from "./pages/WhatIsAgenticAI";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import ROICalculator from "./pages/ROICalculator";
import Portfolio from "./pages/Portfolio";
import SupportOptions from "./pages/SupportOptions";

// Service Pages
import CustomAIDevelopment from "./pages/services/CustomAIDevelopment";
import AIAgentAutomation from "./pages/services/AIAgentAutomation";
import SpecializedAISolutions from "./pages/services/SpecializedAISolutions";
import IndustrySpecificAI from "./pages/services/IndustrySpecificAI";
import AIConsultingSupport from "./pages/services/AIConsultingSupport";

// Case Study Pages
import FinancialServices from "./pages/case-studies/FinancialServices";
import Healthcare from "./pages/case-studies/Healthcare";
import RetailEcommerce from "./pages/case-studies/RetailEcommerce";
import Manufacturing from "./pages/case-studies/Manufacturing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/custom-ai-development" element={<CustomAIDevelopment />} />
          <Route path="/services/ai-agent-automation" element={<AIAgentAutomation />} />
          <Route path="/services/specialized-ai-solutions" element={<SpecializedAISolutions />} />
          <Route path="/services/industry-specific-ai" element={<IndustrySpecificAI />} />
          <Route path="/services/ai-consulting-support" element={<AIConsultingSupport />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/case-studies/financial-services" element={<FinancialServices />} />
          <Route path="/case-studies/healthcare" element={<Healthcare />} />
          <Route path="/case-studies/retail-ecommerce" element={<RetailEcommerce />} />
          <Route path="/case-studies/manufacturing" element={<Manufacturing />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/what-is-agentic-ai" element={<WhatIsAgenticAI />} />
          <Route path="/admin-agentic" element={<AdminDashboard />} />
          <Route path="/roi-calculator" element={<ROICalculator />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/support-options" element={<SupportOptions />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
