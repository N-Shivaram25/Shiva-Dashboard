import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, ExternalLink, Link as LinkIcon, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { DocumentLink } from "@shared/schema";

export default function LinksPage() {
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [linkData, setLinkData] = useState({ title: "", url: "", description: "" });
  const { toast } = useToast();

  const { data: links, isLoading } = useQuery<DocumentLink[]>({
    queryKey: ["/api/document-links"],
  });

  const createLinkMutation = useMutation({
    mutationFn: async (data: { title: string; url: string; description?: string }) => {
      const res = await apiRequest("POST", "/api/document-links", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/document-links"] });
      setIsAddingLink(false);
      setLinkData({ title: "", url: "", description: "" });
      toast({ title: "Link added successfully" });
    },
  });

  const deleteLinkMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/document-links/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/document-links"] });
      toast({ title: "Link deleted successfully" });
    },
  });

  const handleSubmit = () => {
    if (linkData.title && linkData.url) {
      createLinkMutation.mutate(linkData);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/docs">
            <Button variant="ghost" className="mb-4" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Documents
            </Button>
          </Link>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2" data-testid="text-page-title">
                Important Links
              </h1>
              <p className="text-slate-600 dark:text-slate-400" data-testid="text-page-description">
                Save and organize important links and resources
              </p>
            </div>
            
            <Dialog open={isAddingLink} onOpenChange={setIsAddingLink}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-link">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Link</DialogTitle>
                  <DialogDescription>Save an important link or resource</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="link-title">Title</Label>
                    <Input
                      id="link-title"
                      value={linkData.title}
                      onChange={(e) => setLinkData({ ...linkData, title: e.target.value })}
                      placeholder="e.g., College Portal Login"
                      data-testid="input-link-title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="link-url">URL</Label>
                    <Input
                      id="link-url"
                      value={linkData.url}
                      onChange={(e) => setLinkData({ ...linkData, url: e.target.value })}
                      placeholder="https://example.com"
                      data-testid="input-link-url"
                    />
                  </div>
                  <div>
                    <Label htmlFor="link-description">Description (Optional)</Label>
                    <Textarea
                      id="link-description"
                      value={linkData.description}
                      onChange={(e) => setLinkData({ ...linkData, description: e.target.value })}
                      placeholder="Add a brief description..."
                      data-testid="input-link-description"
                    />
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={!linkData.title || !linkData.url || createLinkMutation.isPending}
                    className="w-full"
                    data-testid="button-submit-link"
                  >
                    {createLinkMutation.isPending ? "Adding..." : "Add Link"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {links?.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center py-12">
                <LinkIcon className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                <p className="text-slate-600 dark:text-slate-400">No links added yet</p>
              </CardContent>
            </Card>
          ) : (
            links?.map((link) => (
              <Card key={link.id} className="hover:shadow-lg transition-shadow" data-testid={`card-link-${link.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2" data-testid={`text-link-title-${link.id}`}>
                        {link.title}
                      </CardTitle>
                      {link.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3" data-testid={`text-link-description-${link.id}`}>
                          {link.description}
                        </p>
                      )}
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                        data-testid={`link-url-${link.id}`}
                      >
                        {link.url}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => window.open(link.url, '_blank')}
                      data-testid={`button-open-${link.id}`}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteLinkMutation.mutate(link.id)}
                      data-testid={`button-delete-${link.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
