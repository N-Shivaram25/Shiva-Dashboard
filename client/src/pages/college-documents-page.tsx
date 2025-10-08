import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, FileText, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { CollegeDocument } from "@shared/schema";

export default function CollegeDocumentsPage() {
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const { toast } = useToast();

  const { data: documents, isLoading } = useQuery<CollegeDocument[]>({
    queryKey: ["/api/college-documents"],
  });

  const uploadDocMutation = useMutation({
    mutationFn: async (data: { category: string; file: File }) => {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("category", data.category);
      
      const response = await fetch("/api/college-documents", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/college-documents"] });
      setIsAddingDoc(false);
      setNewCategory("");
      setDocFile(null);
      toast({ title: "Document added successfully" });
    },
  });

  const deleteDocMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/college-documents/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/college-documents"] });
      toast({ title: "Document deleted successfully" });
    },
  });

  const handleDownload = (fileData: string, fileName: string, mimeType: string) => {
    const byteCharacters = atob(fileData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSubmit = () => {
    if (newCategory && docFile) {
      uploadDocMutation.mutate({ category: newCategory, file: docFile });
    }
  };

  const categories = Array.from(new Set(documents?.map(doc => doc.category) || []));
  const selectedDocs = selectedCategory 
    ? documents?.filter(doc => doc.category === selectedCategory) 
    : [];

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
                College Documents
              </h1>
              <p className="text-slate-600 dark:text-slate-400" data-testid="text-page-description">
                Manage your academic records and important documents
              </p>
            </div>
            
            <Dialog open={isAddingDoc} onOpenChange={setIsAddingDoc}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-document">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Document
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Document</DialogTitle>
                  <DialogDescription>Upload a document with a category</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="e.g., 10th Marks, Aadhaar Card, 12th Marks"
                      data-testid="input-category"
                    />
                  </div>
                  <div>
                    <Label htmlFor="doc-file">Upload Document</Label>
                    <Input
                      id="doc-file"
                      type="file"
                      onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                      data-testid="input-document-file"
                    />
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={!newCategory || !docFile || uploadDocMutation.isPending}
                    className="w-full"
                    data-testid="button-submit-document"
                  >
                    {uploadDocMutation.isPending ? "Uploading..." : "Add Document"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No categories yet</p>
                ) : (
                  categories.map((category) => (
                    <div
                      key={category}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedCategory === category
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      onClick={() => setSelectedCategory(category)}
                      data-testid={`button-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <span className="text-sm font-medium" data-testid={`text-category-${category.toLowerCase().replace(/\s+/g, '-')}`}>
                        {category}
                      </span>
                      <span className="ml-2 text-xs text-slate-500">
                        ({documents?.filter(doc => doc.category === category).length})
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {selectedCategory ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold" data-testid="text-selected-category">
                  {selectedCategory}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDocs?.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-lg transition-shadow" data-testid={`card-document-${doc.id}`}>
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-base" data-testid={`text-document-filename-${doc.id}`}>
                              {doc.fileName}
                            </CardTitle>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {new Date(doc.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleDownload(doc.fileData, doc.fileName, doc.mimeType)}
                            data-testid={`button-download-${doc.id}`}
                          >
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteDocMutation.mutate(doc.id)}
                            data-testid={`button-delete-${doc.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-600 dark:text-slate-400">Select a category to view documents</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
