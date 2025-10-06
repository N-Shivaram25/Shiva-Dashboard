import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EnergyLog {
  id: string;
  activity: string;
  impact: "positive" | "neutral" | "negative";
}

interface EnergySectionProps {
  logs: EnergyLog[];
  onAddLog: (activity: string, impact: "positive" | "neutral" | "negative") => void;
  onDeleteLog: (id: string) => void;
}

export function EnergySection({ logs, onAddLog, onDeleteLog }: EnergySectionProps) {
  const [newActivity, setNewActivity] = useState("");
  const [impact, setImpact] = useState<"positive" | "neutral" | "negative">("neutral");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newActivity.trim()) {
      onAddLog(newActivity.trim(), impact);
      setNewActivity("");
      setImpact("neutral");
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive":
        return "bg-chart-2/20 text-chart-2 border-chart-2/40";
      case "negative":
        return "bg-destructive/20 text-destructive border-destructive/40";
      default:
        return "bg-chart-4/20 text-chart-4 border-chart-4/40";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-chart-4" />
          <CardTitle>Energy & Eyesight</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Activity (e.g., 2 hours screen time)"
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              className="flex-1"
              data-testid="input-new-energy-activity"
            />
            <Select value={impact} onValueChange={(v) => setImpact(v as any)}>
              <SelectTrigger className="w-[140px]" data-testid="select-energy-impact">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="negative">Negative</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" data-testid="button-add-energy-log">
            <Plus className="h-4 w-4 mr-2" />
            Add Log
          </Button>
        </form>

        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-2 p-2 rounded-md hover-elevate"
              data-testid={`energy-log-${log.id}`}
            >
              <Badge variant="outline" className={`${getImpactColor(log.impact)} capitalize`}>
                {log.impact}
              </Badge>
              <span className="flex-1 text-sm" data-testid={`text-energy-${log.id}`}>
                {log.activity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteLog(log.id)}
                data-testid={`button-delete-energy-${log.id}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No energy logs yet. Track activities affecting your eyesight!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
