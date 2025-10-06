import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Plus, X } from "lucide-react";

interface WellnessLog {
  id: string;
  activity: string;
}

interface WellnessSectionProps {
  logs: WellnessLog[];
  onAddLog: (activity: string) => void;
  onDeleteLog: (id: string) => void;
}

export function WellnessSection({ logs, onAddLog, onDeleteLog }: WellnessSectionProps) {
  const [newActivity, setNewActivity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newActivity.trim()) {
      onAddLog(newActivity.trim());
      setNewActivity("");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-chart-3" />
          <CardTitle>Wellness</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Add wellness activity (e.g., meditation, exercise)..."
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            data-testid="input-new-wellness"
          />
          <Button type="submit" size="icon" data-testid="button-add-wellness">
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-2 p-2 rounded-md hover-elevate"
              data-testid={`wellness-log-${log.id}`}
            >
              <span className="flex-1 text-sm" data-testid={`text-wellness-${log.id}`}>
                {log.activity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteLog(log.id)}
                data-testid={`button-delete-wellness-${log.id}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No wellness activities yet. Add one to track your health!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
