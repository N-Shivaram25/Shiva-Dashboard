import { useState } from "react";
import { format } from "date-fns";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDate } from "@/contexts/DateContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Film, Plus, X, PlayCircle } from "lucide-react";
import { Entertainment, generateId, getDateString, filterByDate } from "@/lib/dataStore";
import { Progress } from "@/components/ui/progress";

export default function EntertainmentPage() {
  const { selectedDate } = useDate();
  const [entertainment, setEntertainment] = useLocalStorage<Entertainment[]>("entertainment", []);
  const [newActivity, setNewActivity] = useState("");

  const todayEntertainment = filterByDate(entertainment, selectedDate);
  const completedEntertainment = todayEntertainment.filter(e => e.completed);
  const completionRate = todayEntertainment.length > 0 ? (completedEntertainment.length / todayEntertainment.length) * 100 : 0;

  const handleAddEntertainment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newActivity.trim()) {
      const ent: Entertainment = {
        id: generateId(),
        date: getDateString(selectedDate),
        activity: newActivity.trim(),
        completed: false,
      };
      setEntertainment([...entertainment, ent]);
      setNewActivity("");
    }
  };

  const handleToggleEntertainment = (id: string) => {
    setEntertainment(entertainment.map(e => e.id === id ? { ...e, completed: !e.completed } : e));
  };

  const handleDeleteEntertainment = (id: string) => {
    setEntertainment(entertainment.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Film className="h-8 w-8 text-chart-5" />
          Entertainment Dashboard
        </h1>
        <p className="text-muted-foreground">Plan and track your leisure activities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planned Activities</CardTitle>
            <PlayCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayEntertainment.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Film className="h-4 w-4 text-chart-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-5">{completedEntertainment.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Film className="h-4 w-4 text-chart-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(completionRate)}%</div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Entertainment Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddEntertainment} className="flex gap-2">
            <Input
              placeholder="Activity (e.g., watch movie, read book, play game)"
              value={newActivity}
              onChange={(e) => setNewActivity(e.target.value)}
              data-testid="input-new-entertainment"
            />
            <Button type="submit" data-testid="button-add-entertainment">
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Entertainment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {todayEntertainment.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-md hover-elevate border"
                data-testid={`entertainment-item-${item.id}`}
              >
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => handleToggleEntertainment(item.id)}
                  data-testid={`checkbox-entertainment-${item.id}`}
                />
                <span
                  className={`flex-1 ${item.completed ? "line-through text-muted-foreground" : ""}`}
                  data-testid={`text-entertainment-${item.id}`}
                >
                  {item.activity}
                </span>
                {item.completed && (
                  <span className="text-xs text-chart-5 font-medium">✓ Done</span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteEntertainment(item.id)}
                  data-testid={`button-delete-entertainment-${item.id}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {todayEntertainment.length === 0 && (
              <div className="text-center py-12">
                <Film className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No entertainment activities planned. Add some fun to your day!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
