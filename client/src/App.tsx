import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/theme-toggle";
import Home from "@/pages/home";
import Quiz from "@/pages/quiz";
import Results from "@/pages/results";
import Symptoms from "@/pages/symptoms";
import NotFound from "@/pages/not-found";
import { Leaf } from "lucide-react";
import { Link } from "wouter";

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer" data-testid="link-logo">
            <Leaf className="w-6 h-6 text-primary" />
            <span className="font-serif font-bold text-xl">AIyuv</span>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/quiz" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-quiz">
            Dosha Quiz
          </Link>
          <Link href="/symptoms" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-symptoms">
            Symptom Checker
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
      <Route path="/quiz" component={Quiz} />
      <Route path="/results" component={Results} />
      <Route path="/symptoms" component={Symptoms} />
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
          <main className="pt-16">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
