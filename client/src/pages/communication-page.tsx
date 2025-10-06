import { useState } from "react";
import { format } from "date-fns";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDate } from "@/contexts/DateContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageCircle, Plus, X, Mail } from "lucide-react";
import { Communication, generateId, getDateString, filterByDate } from "@/lib/dataStore";
import { Progress } from "@/components/ui/progress";

export default function CommunicationPage() {
  const { selectedDate } = useDate();
  const [communications, setCommunications] = useLocalStorage<Communication[]>("communications", []);
  const [newTask, setNewTask] = useState("");

  const todayCommunications = filterByDate(communications, selectedDate);
  const completedCommunications = todayCommunications.filter(c => c.completed);
  const completionRate = todayCommunications.length > 0 ? (completedCommunications.length / todayCommunications.length) * 100 : 0;

  const handleAddCommunication = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      const comm: Communication = {
        id: generateId(),
        date: getDateString(selectedDate),
        task: newTask.trim(),
        completed: false,
      };
      setCommunications([...communications, comm]);
      setNewTask("");
    }
  };

  const handleToggleCommunication = (id: string) => {
    setCommunications(communications.map(c => c.id === id ? { ...c, completed: !c.completed } : c));
  };

  const handleDeleteCommunication = (id: string) => {
    setCommunications(communications.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessageCircle className="h-8 w-8 text-primary" />
          Communication Dashboard
        </h1>
        <p className="text-muted-foreground">Manage your daily communication tasks</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayCommunications.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <MessageCircle className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{completedCommunications.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <MessageCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(completionRate)}%</div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add Communication Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCommunication} className="flex gap-2">
            <Input
              placeholder="Communication task (e.g., call mom, email client)"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              data-testid="input-new-communication"
            />
            <Button type="submit" data-testid="button-add-communication">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Communication Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {todayCommunications.map((comm) => (
              <div
                key={comm.id}
                className="flex items-center gap-3 p-3 rounded-md hover-elevate border"
                data-testid={`communication-item-${comm.id}`}
              >
                <Checkbox
                  checked={comm.completed}
                  onCheckedChange={() => handleToggleCommunication(comm.id)}
                  data-testid={`checkbox-communication-${comm.id}`}
                />
                <span
                  className={`flex-1 ${comm.completed ? "line-through text-muted-foreground" : ""}`}
                  data-testid={`text-communication-${comm.id}`}
                >
                  {comm.task}
                </span>
                {comm.completed && (
                  <span className="text-xs text-chart-2 font-medium">✓ Done</span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteCommunication(comm.id)}
                  data-testid={`button-delete-communication-${comm.id}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {todayCommunications.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No communication tasks yet. Add one to stay connected!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
