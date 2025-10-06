import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageCircle, Plus, X } from "lucide-react";

interface Communication {
  id: string;
  task: string;
  completed: boolean;
}

interface CommunicationSectionProps {
  communications: Communication[];
  onAddCommunication: (task: string) => void;
  onToggleCommunication: (id: string) => void;
  onDeleteCommunication: (id: string) => void;
}

export function CommunicationSection({ communications, onAddCommunication, onToggleCommunication, onDeleteCommunication }: CommunicationSectionProps) {
  const [newTask, setNewTask] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddCommunication(newTask.trim());
      setNewTask("");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <CardTitle>Communication</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Add communication task (e.g., call mom)..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            data-testid="input-new-communication"
          />
          <Button type="submit" size="icon" data-testid="button-add-communication">
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        <div className="space-y-2">
          {communications.map((comm) => (
            <div
              key={comm.id}
              className="flex items-center gap-2 p-2 rounded-md hover-elevate"
              data-testid={`communication-item-${comm.id}`}
            >
              <Checkbox
                checked={comm.completed}
                onCheckedChange={() => onToggleCommunication(comm.id)}
                data-testid={`checkbox-communication-${comm.id}`}
              />
              <span
                className={`flex-1 ${comm.completed ? "line-through text-muted-foreground" : ""}`}
                data-testid={`text-communication-${comm.id}`}
              >
                {comm.task}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteCommunication(comm.id)}
                data-testid={`button-delete-communication-${comm.id}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {communications.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No communication tasks yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
