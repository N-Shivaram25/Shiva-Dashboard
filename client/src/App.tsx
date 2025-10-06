import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DateSelector } from "@/components/DateSelector";
import { DateProvider, useDate } from "@/contexts/DateContext";

import Overview from "@/pages/overview";
import GoalsPage from "@/pages/goals-page";
import TasksPage from "@/pages/tasks-page";
import ThoughtsPage from "@/pages/thoughts-page";
import EnergyPage from "@/pages/energy-page";
import WellnessPage from "@/pages/wellness-page";
import CommunicationPage from "@/pages/communication-page";
import EntertainmentPage from "@/pages/entertainment-page";
import DataSciencePage from "@/pages/data-science-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Overview} />
      <Route path="/goals" component={GoalsPage} />
      <Route path="/tasks" component={TasksPage} />
      <Route path="/thoughts" component={ThoughtsPage} />
      <Route path="/energy" component={EnergyPage} />
      <Route path="/wellness" component={WellnessPage} />
      <Route path="/communication" component={CommunicationPage} />
      <Route path="/entertainment" component={EntertainmentPage} />
      <Route path="/data-science" component={DataSciencePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { selectedDate, setSelectedDate } = useDate();
  
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between px-6 py-4 border-b bg-background sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h2 className="text-lg font-semibold">Daily Wellness Tracker</h2>
            </div>
            <div className="flex items-center gap-4">
              <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Router />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DateProvider>
          <AppContent />
          <Toaster />
        </DateProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
