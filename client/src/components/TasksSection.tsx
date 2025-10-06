import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckSquare, Plus, X } from "lucide-react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TasksSectionProps {
  tasks: Task[];
  onAddTask: (title: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function TasksSection({ tasks, onAddTask, onToggleTask, onDeleteTask }: TasksSectionProps) {
  const [newTask, setNewTask] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddTask(newTask.trim());
      setNewTask("");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-chart-2" />
          <CardTitle>Works to Complete</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Add a task to complete..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            data-testid="input-new-task"
          />
          <Button type="submit" size="icon" data-testid="button-add-task">
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-2 p-2 rounded-md hover-elevate"
              data-testid={`task-item-${task.id}`}
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => onToggleTask(task.id)}
                data-testid={`checkbox-task-${task.id}`}
              />
              <span
                className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}
                data-testid={`text-task-${task.id}`}
              >
                {task.title}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteTask(task.id)}
                data-testid={`button-delete-task-${task.id}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {tasks.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No tasks yet. Add one to get started!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
