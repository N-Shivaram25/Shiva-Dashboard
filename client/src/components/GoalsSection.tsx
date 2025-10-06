import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Target, Plus, X } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  completed: boolean;
}

interface GoalsSectionProps {
  goals: Goal[];
  onAddGoal: (title: string) => void;
  onToggleGoal: (id: string) => void;
  onDeleteGoal: (id: string) => void;
}

export function GoalsSection({ goals, onAddGoal, onToggleGoal, onDeleteGoal }: GoalsSectionProps) {
  const [newGoal, setNewGoal] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.trim()) {
      onAddGoal(newGoal.trim());
      setNewGoal("");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <CardTitle>Goals</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Add a new goal..."
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            data-testid="input-new-goal"
          />
          <Button type="submit" size="icon" data-testid="button-add-goal">
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        <div className="space-y-2">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="flex items-center gap-2 p-2 rounded-md hover-elevate"
              data-testid={`goal-item-${goal.id}`}
            >
              <Checkbox
                checked={goal.completed}
                onCheckedChange={() => onToggleGoal(goal.id)}
                data-testid={`checkbox-goal-${goal.id}`}
              />
              <span
                className={`flex-1 ${goal.completed ? "line-through text-muted-foreground" : ""}`}
                data-testid={`text-goal-${goal.id}`}
              >
                {goal.title}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteGoal(goal.id)}
                data-testid={`button-delete-goal-${goal.id}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {goals.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No goals yet. Add one to get started!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
