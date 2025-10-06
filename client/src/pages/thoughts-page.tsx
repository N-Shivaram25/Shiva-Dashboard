import { useState } from "react";
import { format } from "date-fns";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDate } from "@/contexts/DateContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Cloud, Plus, X, TrendingUp, SmilePlus } from "lucide-react";
import { NegativeThought, PositiveThought, generateId, getDateString, filterByDate } from "@/lib/dataStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ThoughtsPage() {
  const { selectedDate } = useDate();
  const [negativeThoughts, setNegativeThoughts] = useLocalStorage<NegativeThought[]>("negativeThoughts", []);
  const [positiveThoughts, setPositiveThoughts] = useLocalStorage<PositiveThought[]>("positiveThoughts", []);
  const [newNegativeThought, setNewNegativeThought] = useState("");
  const [newPositiveThought, setNewPositiveThought] = useState("");

  const todayNegative = filterByDate(negativeThoughts, selectedDate);
  const todayPositive = filterByDate(positiveThoughts, selectedDate);
  const totalThoughts = todayNegative.length + todayPositive.length;
  const positivePercentage = totalThoughts > 0 ? (todayPositive.length / totalThoughts) * 100 : 0;
  const negativePercentage = totalThoughts > 0 ? (todayNegative.length / totalThoughts) * 100 : 0;

  const handleAddNegativeThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNegativeThought.trim()) {
      const thought: NegativeThought = {
        id: generateId(),
        date: getDateString(selectedDate),
        thought: newNegativeThought.trim(),
      };
      setNegativeThoughts([...negativeThoughts, thought]);
      setNewNegativeThought("");
    }
  };

  const handleAddPositiveThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPositiveThought.trim()) {
      const thought: PositiveThought = {
        id: generateId(),
        date: getDateString(selectedDate),
        thought: newPositiveThought.trim(),
      };
      setPositiveThoughts([...positiveThoughts, thought]);
      setNewPositiveThought("");
    }
  };

  const handleDeleteNegativeThought = (id: string) => {
    setNegativeThoughts(negativeThoughts.filter(t => t.id !== id));
  };

  const handleDeletePositiveThought = (id: string) => {
    setPositiveThoughts(positiveThoughts.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Cloud className="h-8 w-8 text-chart-4" />
          Thoughts Dashboard
        </h1>
        <p className="text-muted-foreground">Track your positive and negative thoughts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Thoughts</CardTitle>
            <Cloud className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalThoughts}</div>
          </CardContent>
        </Card>

        <Card className="border-chart-3/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Thoughts</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-3">{todayPositive.length}</div>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-chart-3 transition-all duration-1000 ease-out"
                  style={{ width: `${positivePercentage}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-chart-3">
                {Math.round(positivePercentage)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-chart-4/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negative Thoughts</CardTitle>
            <Cloud className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-4">{todayNegative.length}</div>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-chart-4 transition-all duration-1000 ease-out"
                  style={{ width: `${negativePercentage}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-chart-4">
                {Math.round(negativePercentage)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mental Health Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative h-8 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-chart-3 transition-all duration-1000 ease-out"
                style={{ width: `${positivePercentage}%` }}
              />
              <div
                className="absolute right-0 top-0 h-full bg-chart-4 transition-all duration-1000 ease-out"
                style={{ width: `${negativePercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-chart-3 font-medium">
                {Math.round(positivePercentage)}% Positive
              </span>
              <span className="text-chart-4 font-medium">
                {Math.round(negativePercentage)}% Negative
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="positive" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="positive" data-testid="tab-positive">
            <SmilePlus className="h-4 w-4 mr-2" />
            Positive Thoughts
          </TabsTrigger>
          <TabsTrigger value="negative" data-testid="tab-negative">
            <Cloud className="h-4 w-4 mr-2" />
            Negative Thoughts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="positive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Positive Thought</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddPositiveThought} className="space-y-2">
                <Textarea
                  placeholder="Write down something positive..."
                  value={newPositiveThought}
                  onChange={(e) => setNewPositiveThought(e.target.value)}
                  rows={3}
                  data-testid="input-positive-thought"
                />
                <Button type="submit" data-testid="button-add-positive">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Positive Thought
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Positive Thoughts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {todayPositive.map((thought) => (
                  <div
                    key={thought.id}
                    className="p-3 rounded-md bg-chart-3/10 border border-chart-3/20 relative"
                    data-testid={`positive-thought-${thought.id}`}
                  >
                    <p className="text-sm pr-8">{thought.thought}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => handleDeletePositiveThought(thought.id)}
                      data-testid={`button-delete-positive-${thought.id}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {todayPositive.length === 0 && (
                  <div className="text-center py-8">
                    <SmilePlus className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No positive thoughts yet. Add one to brighten your day!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="negative" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Negative Thought</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddNegativeThought} className="space-y-2">
                <Textarea
                  placeholder="Write down negative thoughts to acknowledge and release them..."
                  value={newNegativeThought}
                  onChange={(e) => setNewNegativeThought(e.target.value)}
                  rows={3}
                  data-testid="input-negative-thought"
                />
                <Button type="submit" data-testid="button-add-negative">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Negative Thought
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Negative Thoughts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {todayNegative.map((thought) => (
                  <div
                    key={thought.id}
                    className="p-3 rounded-md bg-chart-4/10 border border-chart-4/20 relative"
                    data-testid={`negative-thought-${thought.id}`}
                  >
                    <p className="text-sm pr-8">{thought.thought}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => handleDeleteNegativeThought(thought.id)}
                      data-testid={`button-delete-negative-${thought.id}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {todayNegative.length === 0 && (
                  <div className="text-center py-8">
                    <Cloud className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No negative thoughts recorded today.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
