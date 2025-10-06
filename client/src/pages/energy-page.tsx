import { useState } from "react";
import { format } from "date-fns";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDate } from "@/contexts/DateContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Plus, X, Activity } from "lucide-react";
import { EnergyLog, generateId, getDateString, filterByDate } from "@/lib/dataStore";
import { Badge } from "@/components/ui/badge";

export default function EnergyPage() {
  const { selectedDate } = useDate();
  const [energyLogs, setEnergyLogs] = useLocalStorage<EnergyLog[]>("energyLogs", []);
  const [newActivity, setNewActivity] = useState("");
  const [impact, setImpact] = useState<"positive" | "neutral" | "negative">("neutral");

  const todayLogs = filterByDate(energyLogs, selectedDate);
  const positiveLogs = todayLogs.filter(l => l.impact === "positive").length;
  const negativeLogs = todayLogs.filter(l => l.impact === "negative").length;
  const neutralLogs = todayLogs.filter(l => l.impact === "neutral").length;

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (newActivity.trim()) {
      const log: EnergyLog = {
        id: generateId(),
        date: getDateString(selectedDate),
        activity: newActivity.trim(),
        impact,
      };
      setEnergyLogs([...energyLogs, log]);
      setNewActivity("");
      setImpact("neutral");
    }
  };

  const handleDeleteLog = (id: string) => {
    setEnergyLogs(energyLogs.filter(l => l.id !== id));
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Zap className="h-8 w-8 text-chart-4" />
          Energy & Eyesight Dashboard
        </h1>
        <p className="text-muted-foreground">Track activities affecting your energy and eyesight</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayLogs.length}</div>
          </CardContent>
        </Card>

        <Card className="border-chart-2/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Impact</CardTitle>
            <Zap className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{positiveLogs}</div>
          </CardContent>
        </Card>

        <Card className="border-chart-4/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Neutral Impact</CardTitle>
            <Zap className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-4">{neutralLogs}</div>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negative Impact</CardTitle>
            <Zap className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{negativeLogs}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddLog} className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Activity (e.g., 2 hours screen time)"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                className="flex-1"
                data-testid="input-energy-activity"
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
              Add Activity Log
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Activity Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {todayLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-3 p-3 rounded-md hover-elevate border"
                data-testid={`energy-log-${log.id}`}
              >
                <Badge variant="outline" className={`${getImpactColor(log.impact)} capitalize`}>
                  {log.impact}
                </Badge>
                <span className="flex-1 text-sm">{log.activity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteLog(log.id)}
                  data-testid={`button-delete-energy-${log.id}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {todayLogs.length === 0 && (
              <div className="text-center py-12">
                <Zap className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No activity logs yet. Start tracking your energy levels!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
