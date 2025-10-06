import { format } from "date-fns";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDate } from "@/contexts/DateContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, CheckSquare, Cloud, Zap, Heart, MessageCircle, Film, TrendingUp } from "lucide-react";
import { Goal, Task, NegativeThought, PositiveThought, EnergyLog, WellnessLog, Communication, Entertainment, filterByDate } from "@/lib/dataStore";

export default function Overview() {
  const { selectedDate } = useDate();
  const dateStr = format(selectedDate, "yyyy-MM-dd");

  const [goals] = useLocalStorage<Goal[]>("goals", []);
  const [tasks] = useLocalStorage<Task[]>("tasks", []);
  const [negativeThoughts] = useLocalStorage<NegativeThought[]>("negativeThoughts", []);
  const [positiveThoughts] = useLocalStorage<PositiveThought[]>("positiveThoughts", []);
  const [energyLogs] = useLocalStorage<EnergyLog[]>("energyLogs", []);
  const [wellnessLogs] = useLocalStorage<WellnessLog[]>("wellnessLogs", []);
  const [communications] = useLocalStorage<Communication[]>("communications", []);
  const [entertainment] = useLocalStorage<Entertainment[]>("entertainment", []);

  const todayGoals = filterByDate(goals, selectedDate);
  const todayTasks = filterByDate(tasks, selectedDate);
  const todayNegativeThoughts = filterByDate(negativeThoughts, selectedDate);
  const todayPositiveThoughts = filterByDate(positiveThoughts, selectedDate);
  const todayEnergy = filterByDate(energyLogs, selectedDate);
  const todayWellness = filterByDate(wellnessLogs, selectedDate);
  const todayCommunications = filterByDate(communications, selectedDate);
  const todayEntertainment = filterByDate(entertainment, selectedDate);

  const completedGoals = todayGoals.filter(g => g.completed).length;
  const completedTasks = todayTasks.filter(t => t.completed).length;
  const completedCommunications = todayCommunications.filter(c => c.completed).length;
  const completedEntertainment = todayEntertainment.filter(e => e.completed).length;

  const stats = [
    { title: "Goals", count: todayGoals.length, completed: completedGoals, icon: Target, color: "text-primary" },
    { title: "Tasks", count: todayTasks.length, completed: completedTasks, icon: CheckSquare, color: "text-chart-2" },
    { title: "Negative Thoughts", count: todayNegativeThoughts.length, icon: Cloud, color: "text-chart-4" },
    { title: "Positive Thoughts", count: todayPositiveThoughts.length, icon: TrendingUp, color: "text-chart-3" },
    { title: "Energy Logs", count: todayEnergy.length, icon: Zap, color: "text-chart-4" },
    { title: "Wellness", count: todayWellness.length, icon: Heart, color: "text-chart-3" },
    { title: "Communication", count: todayCommunications.length, completed: completedCommunications, icon: MessageCircle, color: "text-primary" },
    { title: "Entertainment", count: todayEntertainment.length, completed: completedEntertainment, icon: Film, color: "text-chart-5" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Daily Overview</h1>
        <p className="text-muted-foreground">Track your progress across all areas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.count}</div>
              {stat.completed !== undefined && (
                <p className="text-xs text-muted-foreground">
                  {stat.completed} completed
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Goals</span>
                <span className="text-sm text-muted-foreground">
                  {completedGoals}/{todayGoals.length}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${todayGoals.length > 0 ? (completedGoals / todayGoals.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Tasks</span>
                <span className="text-sm text-muted-foreground">
                  {completedTasks}/{todayTasks.length}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-chart-2 transition-all duration-500"
                  style={{ width: `${todayTasks.length > 0 ? (completedTasks / todayTasks.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Communication</span>
                <span className="text-sm text-muted-foreground">
                  {completedCommunications}/{todayCommunications.length}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${todayCommunications.length > 0 ? (completedCommunications / todayCommunications.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mental Health Balance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Positive Thoughts</span>
                <span className="text-sm text-chart-3 font-semibold">
                  {todayPositiveThoughts.length}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-chart-3 transition-all duration-500"
                  style={{ width: `${Math.min(100, todayPositiveThoughts.length * 20)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Negative Thoughts</span>
                <span className="text-sm text-chart-4 font-semibold">
                  {todayNegativeThoughts.length}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-chart-4 transition-all duration-500"
                  style={{ width: `${Math.min(100, todayNegativeThoughts.length * 20)}%` }}
                />
              </div>
            </div>

            <div className="pt-2">
              <div className="text-center p-3 rounded-md bg-muted/50">
                <p className="text-sm text-muted-foreground">Positivity Ratio</p>
                <p className="text-2xl font-bold">
                  {todayPositiveThoughts.length + todayNegativeThoughts.length > 0
                    ? `${Math.round((todayPositiveThoughts.length / (todayPositiveThoughts.length + todayNegativeThoughts.length)) * 100)}%`
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
