import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";
import ThemeToggle from "@/components/ThemeToggle";
import TodayPage from "@/pages/today";
import ProgressPage from "@/pages/progress";
import HistoryPage from "@/pages/history";

function Router() {
  return (
    <Switch>
      <Route path="/" component={TodayPage} />
      <Route path="/progress" component={ProgressPage} />
      <Route path="/history" component={HistoryPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
            <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold text-foreground">One Index Card</h1>
                <p className="text-xs text-muted-foreground">Win the day</p>
              </div>
              <ThemeToggle />
            </div>
          </header>
          
          <main className="pt-16">
            <Router />
          </main>
          
          <BottomNav />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
