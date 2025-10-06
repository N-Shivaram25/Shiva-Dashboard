import { useState } from "react";
import { format } from "date-fns";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDate } from "@/contexts/DateContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Plus, X, Activity } from "lucide-react";
import { WellnessLog, generateId, getDateString, filterByDate } from "@/lib/dataStore";

export default function WellnessPage() {
  const { selectedDate } = useDate();
  const [wellnessLogs, setWellnessLogs] = useLocalStorage<WellnessLog[]>("wellnessLogs", []);
  const [newActivity, setNewActivity] = useState("");

  const todayLogs = filterByDate(wellnessLogs, selectedDate);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (newActivity.trim()) {
      const log: WellnessLog = {
        id: generateId(),
        date: getDateString(selectedDate),
        activity: newActivity.trim(),
      };
      setWellnessLogs([...wellnessLogs, log]);
      setNewActivity("");
    }
  };

  const handleDeleteLog = (id: string) => {
    setWellnessLogs(wellnessLogs.filter(l => l.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Heart className="h-8 w-8 text-chart-3" />
          Wellness Dashboard
        </h1>
        <p className="text-muted-foreground">Track your health and wellness activities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayLogs.length}</div>
            <p className="text-xs text-muted-foreground mt-1">wellness activities today</p>
          </CardContent>
        </Card>

        <Card className="border-chart-3/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wellness Score</CardTitle>
            <Heart className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-3">{Math.min(100, todayLogs.length * 20)}%</div>
            <p className="text-xs text-muted-foreground mt-1">based on daily activities</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Wellness Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddLog} className="flex gap-2">
            <Input
              placeholder="Activity (e.g., 30 minutes yoga, 8 glasses of water)"
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              data-testid="input-wellness-activity"
            />
            <Button type="submit" data-testid="button-add-wellness">
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Wellness Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {todayLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center gap-3 p-3 rounded-md hover-elevate border border-chart-3/20 bg-chart-3/5"
                data-testid={`wellness-log-${log.id}`}
              >
                <Heart className="h-4 w-4 text-chart-3 flex-shrink-0" />
                <span className="flex-1 text-sm">{log.activity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteLog(log.id)}
                  data-testid={`button-delete-wellness-${log.id}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {todayLogs.length === 0 && (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No wellness activities yet. Start taking care of yourself!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
