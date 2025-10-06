import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useDate } from "@/contexts/DateContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, BookOpen, Award, Plus, X, TrendingUp } from "lucide-react";
import { generateId, getDateString, filterByDate } from "@/lib/dataStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface TechnologyItem {
  id: string;
  date: string;
  title: string;
}

interface TopicItem {
  id: string;
  date: string;
  topic: string;
}

interface CertificationItem {
  id: string;
  date: string;
  title: string;
}

export default function DataSciencePage() {
  const { selectedDate } = useDate();
  
  const [technologies, setTechnologies] = useLocalStorage<TechnologyItem[]>("dsTechnologies", []);
  const [topics, setTopics] = useLocalStorage<TopicItem[]>("dsTopics", []);
  const [certifications, setCertifications] = useLocalStorage<CertificationItem[]>("dsCertifications", []);
  
  const [newTechnology, setNewTechnology] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newCertification, setNewCertification] = useState("");

  const dateStr = getDateString(selectedDate);
  
  const todayTopics = filterByDate(topics, selectedDate);
  const allTechnologies = technologies;
  const allCertifications = certifications;

  const handleAddTechnology = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTechnology.trim()) {
      setTechnologies([...technologies, {
        id: generateId(),
        date: dateStr,
        title: newTechnology.trim(),
      }]);
      setNewTechnology("");
    }
  };

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTopic.trim()) {
      setTopics([...topics, {
        id: generateId(),
        date: dateStr,
        topic: newTopic.trim(),
      }]);
      setNewTopic("");
    }
  };

  const handleAddCertification = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCertification.trim()) {
      setCertifications([...certifications, {
        id: generateId(),
        date: dateStr,
        title: newCertification.trim(),
      }]);
      setNewCertification("");
    }
  };

  const deleteTechnology = (id: string) => {
    setTechnologies(technologies.filter(t => t.id !== id));
  };

  const deleteTopic = (id: string) => {
    setTopics(topics.filter(t => t.id !== id));
  };

  const deleteCertification = (id: string) => {
    setCertifications(certifications.filter(t => t.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Brain className="h-8 w-8 text-chart-1" />
          Data Science Dashboard
        </h1>
        <p className="text-muted-foreground">Track your data science learning journey, technologies, and achievements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Technologies Learned</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allTechnologies.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Topics</CardTitle>
            <BookOpen className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{todayTopics.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
            <Award className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-1">{allCertifications.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="technologies" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="technologies">
            <TrendingUp className="h-4 w-4 mr-2" />
            Technologies
          </TabsTrigger>
          <TabsTrigger value="topics">
            <BookOpen className="h-4 w-4 mr-2" />
            Daily Topics
          </TabsTrigger>
          <TabsTrigger value="certifications">
            <Award className="h-4 w-4 mr-2" />
            Certifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="technologies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Add Technology
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTechnology} className="flex gap-2">
                <Input
                  placeholder="Enter technology (e.g., Python, TensorFlow, Pandas)..."
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
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
              <CardTitle>Technologies I've Learned ({allTechnologies.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {allTechnologies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {allTechnologies.map((tech) => (
                    <Badge key={tech.id} variant="secondary" className="text-sm px-3 py-2 flex items-center gap-2">
                      {tech.title}
                      <button
                        onClick={() => deleteTechnology(tech.id)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No technologies yet. Add your first technology to get started!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Add Daily Topic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTopic} className="flex gap-2">
                <Input
                  placeholder="Enter topic completed today..."
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
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
              <CardTitle>Today's Topics ({todayTopics.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {todayTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="flex items-center justify-between p-3 rounded-md hover-elevate border"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-4 w-4 text-chart-2" />
                      <span>{topic.topic}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteTopic(topic.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {todayTopics.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No topics completed today. Add your first topic!</p>
                  </div>
                )}
              </div>
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
              <CardTitle>My Certifications ({allCertifications.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {allCertifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="flex items-center justify-between p-4 rounded-md hover-elevate border bg-gradient-to-r from-chart-1/10 to-chart-2/10"
                  >
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-chart-1" />
                      <div>
                        <p className="font-medium">{cert.title}</p>
                        <p className="text-xs text-muted-foreground">Added on {cert.date}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteCertification(cert.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {allCertifications.length === 0 && (
                  <div className="text-center py-12">
                    <Award className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No certifications yet. Add your first certification to get started!</p>
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
