import { Switch, Route, Link } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/theme-toggle";
import Home from "@/pages/home";
import HealthCheck from "@/pages/health-check";
import HealthCheckResults from "@/pages/health-check-results";
import BodyType from "@/pages/body-type";
import AdminDashboard from "@/pages/admin";
import NotFound from "@/pages/not-found";
import { Leaf } from "lucide-react";

// ========================
// APP ROUTING
// Reference: Spec - Modular Architecture
// ========================

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer" data-testid="link-logo">
            <Leaf className="w-5 h-5 text-primary" />
            <span className="font-serif font-bold text-lg">AIyuv</span>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/health-check"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-testid="link-health-check"
          >
            Health Check
          </Link>
          <Link
            href="/body-type"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-testid="link-body-type"
          >
            Body Types
          </Link>
        </nav>
        
        <ThemeToggle />
      </div>
    </header>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/health-check" component={HealthCheck} />
      <Route path="/health-check/results" component={HealthCheckResults} />
      <Route path="/body-type" component={BodyType} />
      <Route path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-14">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
