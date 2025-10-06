import { useState } from "react";
import { format } from "date-fns";
import { DateSelector } from "@/components/DateSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { GoalsSection } from "@/components/GoalsSection";
import { TasksSection } from "@/components/TasksSection";
import { NegativeThoughtsSection } from "@/components/NegativeThoughtsSection";
import { EnergySection } from "@/components/EnergySection";
import { WellnessSection } from "@/components/WellnessSection";
import { CommunicationSection } from "@/components/CommunicationSection";
import { EntertainmentSection } from "@/components/EntertainmentSection";

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [goals, setGoals] = useState<Array<{ id: string; title: string; completed: boolean }>>([]);
  const [tasks, setTasks] = useState<Array<{ id: string; title: string; completed: boolean }>>([]);
  const [thoughts, setThoughts] = useState<Array<{ id: string; thought: string }>>([]);
  const [energyLogs, setEnergyLogs] = useState<Array<{ id: string; activity: string; impact: "positive" | "neutral" | "negative" }>>([]);
  const [wellnessLogs, setWellnessLogs] = useState<Array<{ id: string; activity: string }>>([]);
  const [communications, setCommunications] = useState<Array<{ id: string; task: string; completed: boolean }>>([]);
  const [entertainment, setEntertainment] = useState<Array<{ id: string; activity: string; completed: boolean }>>([]);

  const handleAddGoal = (title: string) => {
    setGoals([...goals, { id: Date.now().toString(), title, completed: false }]);
  };

  const handleToggleGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const handleAddTask = (title: string) => {
    setTasks([...tasks, { id: Date.now().toString(), title, completed: false }]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleAddThought = (thought: string) => {
    setThoughts([...thoughts, { id: Date.now().toString(), thought }]);
  };

  const handleDeleteThought = (id: string) => {
    setThoughts(thoughts.filter(t => t.id !== id));
  };

  const handleAddEnergyLog = (activity: string, impact: "positive" | "neutral" | "negative") => {
    setEnergyLogs([...energyLogs, { id: Date.now().toString(), activity, impact }]);
  };

  const handleDeleteEnergyLog = (id: string) => {
    setEnergyLogs(energyLogs.filter(l => l.id !== id));
  };

  const handleAddWellnessLog = (activity: string) => {
    setWellnessLogs([...wellnessLogs, { id: Date.now().toString(), activity }]);
  };

  const handleDeleteWellnessLog = (id: string) => {
    setWellnessLogs(wellnessLogs.filter(l => l.id !== id));
  };

  const handleAddCommunication = (task: string) => {
    setCommunications([...communications, { id: Date.now().toString(), task, completed: false }]);
  };

  const handleToggleCommunication = (id: string) => {
    setCommunications(communications.map(c => c.id === id ? { ...c, completed: !c.completed } : c));
  };

  const handleDeleteCommunication = (id: string) => {
    setCommunications(communications.filter(c => c.id !== id));
  };

  const handleAddEntertainment = (activity: string) => {
    setEntertainment([...entertainment, { id: Date.now().toString(), activity, completed: false }]);
  };

  const handleToggleEntertainment = (id: string) => {
    setEntertainment(entertainment.map(e => e.id === id ? { ...e, completed: !e.completed } : e));
  };

  const handleDeleteEntertainment = (id: string) => {
    setEntertainment(entertainment.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Daily Tracker</h1>
          <div className="flex items-center gap-4">
            <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GoalsSection
            goals={goals}
            onAddGoal={handleAddGoal}
            onToggleGoal={handleToggleGoal}
            onDeleteGoal={handleDeleteGoal}
          />
          
          <TasksSection
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
          
          <NegativeThoughtsSection
            thoughts={thoughts}
            onAddThought={handleAddThought}
            onDeleteThought={handleDeleteThought}
          />
          
          <EnergySection
            logs={energyLogs}
            onAddLog={handleAddEnergyLog}
            onDeleteLog={handleDeleteEnergyLog}
          />
          
          <WellnessSection
            logs={wellnessLogs}
            onAddLog={handleAddWellnessLog}
            onDeleteLog={handleDeleteWellnessLog}
          />
          
          <CommunicationSection
            communications={communications}
            onAddCommunication={handleAddCommunication}
            onToggleCommunication={handleToggleCommunication}
            onDeleteCommunication={handleDeleteCommunication}
          />
          
          <EntertainmentSection
            entertainment={entertainment}
            onAddEntertainment={handleAddEntertainment}
            onToggleEntertainment={handleToggleEntertainment}
            onDeleteEntertainment={handleDeleteEntertainment}
          />
        </div>
      </main>
    </div>
  );
}
