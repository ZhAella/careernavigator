import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import NeuralAnalysis from "@/pages/NeuralAnalysis";
import GlobalMap from "@/pages/GlobalMap";
import Constellation from "@/pages/Constellation";
import AIMentor from "@/pages/AIMentor";
import Navigation from "@/components/Navigation";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/upload" component={Home} />
        <Route path="/questionnaire" component={Home} />
        <Route path="/dashboard" component={() => <Dashboard />} />
        <Route path="/dashboard/:userId" component={Dashboard} />
        <Route path="/neural/:userId" component={NeuralAnalysis} />
        <Route path="/global-map" component={GlobalMap} />
        <Route path="/constellation/:userId" component={Constellation} />
        <Route path="/ai-mentor/:userId" component={AIMentor} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
