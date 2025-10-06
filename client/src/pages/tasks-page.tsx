import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDate } from "@/contexts/DateContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckSquare, Plus, X, Briefcase, Award, FolderGit2, Code2, TrendingUp } from "lucide-react";
import { generateId, getDateString, filterByDate } from "@/lib/dataStore";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TaskItem {
  id: string;
  date: string;
  title: string;
  completed: boolean;
}

interface StreakItem {
  id: string;
  date: string;
  count: number;
}

export default function TasksPage() {
  const { selectedDate } = useDate();
  
  const [internships, setInternships] = useLocalStorage<TaskItem[]>("internships", []);
  const [certifications, setCertifications] = useLocalStorage<TaskItem[]>("certifications", []);
  const [projects, setProjects] = useLocalStorage<TaskItem[]>("projects", []);
  const [dsaStreaks, setDsaStreaks] = useLocalStorage<StreakItem[]>("dsaStreaks", []);
  
  const [newInternship, setNewInternship] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newProject, setNewProject] = useState("");

  const dateStr = getDateString(selectedDate);
  
  const todayInternships = filterByDate(internships, selectedDate);
  const todayCertifications = filterByDate(certifications, selectedDate);
  const todayProjects = filterByDate(projects, selectedDate);
  
  const todayStreakEntry = dsaStreaks.find(s => s.date === dateStr);
  const todayStreakCount = todayStreakEntry ? todayStreakEntry.count : 0;
  
  const completedInternships = todayInternships.filter(t => t.completed).length;
  const completedCertifications = todayCertifications.filter(t => t.completed).length;
  const completedProjects = todayProjects.filter(t => t.completed).length;
  
  const totalTasks = todayInternships.length + todayCertifications.length + todayProjects.length;
  const totalCompleted = completedInternships + completedCertifications + completedProjects;
  const completionRate = totalTasks > 0 ? (totalCompleted / totalTasks) * 100 : 0;

  const handleAddInternship = (e: React.FormEvent) => {
    e.preventDefault();
    if (newInternship.trim()) {
      setInternships([...internships, {
        id: generateId(),
        date: dateStr,
        title: newInternship.trim(),
        completed: false,
      }]);
      setNewInternship("");
    }
  };

  const handleAddCertification = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCertification.trim()) {
      setCertifications([...certifications, {
        id: generateId(),
        date: dateStr,
        title: newCertification.trim(),
        completed: false,
      }]);
      setNewCertification("");
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProject.trim()) {
      setProjects([...projects, {
        id: generateId(),
        date: dateStr,
        title: newProject.trim(),
        completed: false,
      }]);
      setNewProject("");
    }
  };

  const handleIncrementStreak = () => {
    if (todayStreakEntry) {
      setDsaStreaks(dsaStreaks.map(s => 
        s.date === dateStr ? { ...s, count: s.count + 1 } : s
      ));
    } else {
      setDsaStreaks([...dsaStreaks, { id: generateId(), date: dateStr, count: 1 }]);
    }
  };

  const toggleInternship = (id: string) => {
    setInternships(internships.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const toggleCertification = (id: string) => {
    setCertifications(certifications.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const toggleProject = (id: string) => {
    setProjects(projects.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteInternship = (id: string) => {
    setInternships(internships.filter(t => t.id !== id));
  };

  const deleteCertification = (id: string) => {
    setCertifications(certifications.filter(t => t.id !== id));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(t => t.id !== id));
  };

  const renderTaskList = (
    tasks: TaskItem[],
    onToggle: (id: string) => void,
    onDelete: (id: string) => void,
    emptyMessage: string
  ) => (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-3 p-3 rounded-md hover-elevate border"
        >
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggle(task.id)}
          />
          <span className={`flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
            {task.title}
          </span>
          {task.completed && (
            <span className="text-xs text-chart-2 font-medium">✓ Done</span>
          )}
          <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      {tasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CheckSquare className="h-8 w-8 text-chart-2" />
          Tasks Dashboard
        </h1>
        <p className="text-muted-foreground">Track your internships, certifications, projects, and DSA progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckSquare className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{totalCompleted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(completionRate)}%</div>
            <Progress value={completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DSA Streak</CardTitle>
            <Code2 className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-1">{todayStreakCount}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="internships" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="internships">
            <Briefcase className="h-4 w-4 mr-2" />
            Internships
          </TabsTrigger>
          <TabsTrigger value="certifications">
            <Award className="h-4 w-4 mr-2" />
            Certifications
          </TabsTrigger>
          <TabsTrigger value="projects">
            <FolderGit2 className="h-4 w-4 mr-2" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="dsa">
            <Code2 className="h-4 w-4 mr-2" />
            DSA Streak
          </TabsTrigger>
        </TabsList>

        <TabsContent value="internships" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Add Internship
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddInternship} className="flex gap-2">
                <Input
                  placeholder="Enter internship details..."
                  value={newInternship}
                  onChange={(e) => setNewInternship(e.target.value)}
                />
                <Button type="submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Internships ({todayInternships.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTaskList(
                todayInternships,
                toggleInternship,
                deleteInternship,
                "No internships yet. Add one to get started!"
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Add Certification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCertification} className="flex gap-2">
                <Input
                  placeholder="Enter certification details..."
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                />
                <Button type="submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Certifications ({todayCertifications.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTaskList(
                todayCertifications,
                toggleCertification,
                deleteCertification,
                "No certifications yet. Add one to get started!"
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderGit2 className="h-5 w-5" />
                Add Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddProject} className="flex gap-2">
                <Input
                  placeholder="Enter project details..."
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                />
                <Button type="submit">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projects ({todayProjects.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTaskList(
                todayProjects,
                toggleProject,
                deleteProject,
                "No projects yet. Add one to get started!"
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dsa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                DSA LeetCode Problems Streak
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-6 border rounded-lg bg-gradient-to-r from-chart-1/10 to-chart-2/10">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Today's Streak</p>
                  <p className="text-5xl font-bold text-chart-1">{todayStreakCount}</p>
                  <p className="text-sm text-muted-foreground mt-1">problems solved</p>
                </div>
                <Button 
                  size="lg" 
                  onClick={handleIncrementStreak}
                  className="h-16 w-16 rounded-full"
                >
                  <Plus className="h-8 w-8" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Click the + button each time you solve a LeetCode problem today!
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
