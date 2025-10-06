import { useState } from "react";
import { format } from "date-fns";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDate } from "@/contexts/DateContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Target, Plus, X, TrendingUp } from "lucide-react";
import { Goal, generateId, getDateString, filterByDate } from "@/lib/dataStore";
import { Progress } from "@/components/ui/progress";

export default function GoalsPage() {
  const { selectedDate } = useDate();
  const [goals, setGoals] = useLocalStorage<Goal[]>("goals", []);
  const [newGoal, setNewGoal] = useState("");

  const todayGoals = filterByDate(goals, selectedDate);
  const completedGoals = todayGoals.filter(g => g.completed);
  const completionRate = todayGoals.length > 0 ? (completedGoals.length / todayGoals.length) * 100 : 0;

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.trim()) {
      const goal: Goal = {
        id: generateId(),
        date: getDateString(selectedDate),
        title: newGoal.trim(),
        completed: false,
      };
      setGoals([...goals, goal]);
      setNewGoal("");
    }
  };

  const handleToggleGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Target className="h-8 w-8 text-primary" />
          Goals Dashboard
        </h1>
        <p className="text-muted-foreground">Track and achieve your daily goals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayGoals.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{completedGoals.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(completionRate)}%</div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddGoal} className="flex gap-2">
            <Input
              placeholder="Enter your goal..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              data-testid="input-new-goal"
            />
            <Button type="submit" data-testid="button-add-goal">
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {todayGoals.map((goal) => (
              <div
                key={goal.id}
                className="flex items-center gap-3 p-3 rounded-md hover-elevate border"
                data-testid={`goal-item-${goal.id}`}
              >
                <Checkbox
                  checked={goal.completed}
                  onCheckedChange={() => handleToggleGoal(goal.id)}
                  data-testid={`checkbox-goal-${goal.id}`}
                />
                <span
                  className={`flex-1 ${goal.completed ? "line-through text-muted-foreground" : ""}`}
                  data-testid={`text-goal-${goal.id}`}
                >
                  {goal.title}
                </span>
                {goal.completed && (
                  <span className="text-xs text-chart-2 font-medium">✓ Done</span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteGoal(goal.id)}
                  data-testid={`button-delete-goal-${goal.id}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {todayGoals.length === 0 && (
              <div className="text-center py-12">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No goals yet. Add your first goal to get started!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
