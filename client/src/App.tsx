import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/theme-toggle";
import Home from "@/pages/home";
import UserSelection from "@/pages/user-selection";
import HealthCheck from "@/pages/health-check";
import HealthCheckResults from "@/pages/health-check-results";
import BodyType from "@/pages/body-type";
import HealthDashboard from "@/pages/health-dashboard";
import AdminDashboard from "@/pages/admin";
import ConsultDoctor from "@/pages/consult";
import Medicines from "@/pages/medicines";
import NotFound from "@/pages/not-found";
import { Leaf } from "lucide-react";
import { SymptomFlowProvider } from "@/context/SymptomFlowContext";
import SymptomSelection from "@/pages/symptom-selection";
import SymptomAssessment from "@/pages/symptom-assessment";
import SymptomResults from "@/pages/symptom-results";
import SymptomIntake from "@/pages/symptom-intake";
import PatientEnter from "@/pages/patient-enter";

// ========================
// APP ROUTING
// Reference: Spec - Modular Architecture
// Modern UI with Whiteish-Green Theme
// ========================

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2.5 cursor-pointer group" data-testid="link-logo">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif font-bold text-xl text-foreground">AIyuv</span>
          </div>
        </Link>
        
        {/* Navigation */}
        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/portal" component={UserSelection} />
      <Route path="/patient" component={PatientEnter} />
      <Route path="/home" component={Home} />
      <Route path="/health-dashboard" component={HealthDashboard} />
      <Route path="/health-check" component={HealthCheck} />
      <Route path="/health-check/results" component={HealthCheckResults} />
      <Route path="/body-type" component={BodyType} />
      {/* New Symptom Analysis flow */}
      <Route path="/symptom-intake" component={SymptomIntake} />
      <Route path="/symptoms" component={SymptomSelection} />
      <Route path="/assessment" component={SymptomAssessment} />
      <Route path="/results" component={SymptomResults} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/consult" component={ConsultDoctor} />
      <Route path="/medicines" component={Medicines} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SymptomFlowProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-16">
              <Router />
            </main>
          </div>
        </SymptomFlowProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
