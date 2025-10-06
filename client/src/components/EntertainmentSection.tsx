import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Film, Plus, X } from "lucide-react";

interface Entertainment {
  id: string;
  activity: string;
  completed: boolean;
}

interface EntertainmentSectionProps {
  entertainment: Entertainment[];
  onAddEntertainment: (activity: string) => void;
  onToggleEntertainment: (id: string) => void;
  onDeleteEntertainment: (id: string) => void;
}

export function EntertainmentSection({ entertainment, onAddEntertainment, onToggleEntertainment, onDeleteEntertainment }: EntertainmentSectionProps) {
  const [newActivity, setNewActivity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newActivity.trim()) {
      onAddEntertainment(newActivity.trim());
      setNewActivity("");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Film className="h-5 w-5 text-chart-5" />
          <CardTitle>Entertainment</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            placeholder="Add entertainment activity..."
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            data-testid="input-new-entertainment"
          />
          <Button type="submit" size="icon" data-testid="button-add-entertainment">
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        <div className="space-y-2">
          {entertainment.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 p-2 rounded-md hover-elevate"
              data-testid={`entertainment-item-${item.id}`}
            >
              <Checkbox
                checked={item.completed}
                onCheckedChange={() => onToggleEntertainment(item.id)}
                data-testid={`checkbox-entertainment-${item.id}`}
              />
              <span
                className={`flex-1 ${item.completed ? "line-through text-muted-foreground" : ""}`}
                data-testid={`text-entertainment-${item.id}`}
              >
                {item.activity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteEntertainment(item.id)}
                data-testid={`button-delete-entertainment-${item.id}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {entertainment.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No entertainment activities planned.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
