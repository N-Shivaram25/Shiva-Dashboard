import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Cloud, Plus, X } from "lucide-react";

interface NegativeThought {
  id: string;
  thought: string;
}

interface NegativeThoughtsSectionProps {
  thoughts: NegativeThought[];
  onAddThought: (thought: string) => void;
  onDeleteThought: (id: string) => void;
}

export function NegativeThoughtsSection({ thoughts, onAddThought, onDeleteThought }: NegativeThoughtsSectionProps) {
  const [newThought, setNewThought] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newThought.trim()) {
      onAddThought(newThought.trim());
      setNewThought("");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Cloud className="h-5 w-5 text-chart-4" />
          <CardTitle>Negative Thoughts</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            placeholder="Write down negative thoughts to acknowledge and release them..."
            value={newThought}
            onChange={(e) => setNewThought(e.target.value)}
            className="resize-none"
            rows={3}
            data-testid="input-new-thought"
          />
          <Button type="submit" data-testid="button-add-thought">
            <Plus className="h-4 w-4 mr-2" />
            Add Thought
          </Button>
        </form>

        <div className="space-y-2">
          {thoughts.map((thought) => (
            <div
              key={thought.id}
              className="p-3 rounded-md bg-muted/50 relative"
              data-testid={`thought-item-${thought.id}`}
            >
              <p className="text-sm pr-8" data-testid={`text-thought-${thought.id}`}>
                {thought.thought}
              </p>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => onDeleteThought(thought.id)}
                data-testid={`button-delete-thought-${thought.id}`}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {thoughts.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No thoughts recorded today.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
