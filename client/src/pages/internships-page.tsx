import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, FileText, Upload, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { InternshipDocument, InternshipFile } from "@shared/schema";

export default function InternshipsPage() {
  const [isAddingInternship, setIsAddingInternship] = useState(false);
  const [newInternshipName, setNewInternshipName] = useState("");
  const [selectedInternship, setSelectedInternship] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: internships, isLoading } = useQuery<InternshipDocument[]>({
    queryKey: ["/api/internship-documents"],
  });

  const { data: files } = useQuery<InternshipFile[]>({
    queryKey: ["/api/internship-files", selectedInternship],
    enabled: !!selectedInternship,
  });

  const createInternshipMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await apiRequest("POST", "/api/internship-documents", { internshipName: name });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/internship-documents"] });
      setIsAddingInternship(false);
      setNewInternshipName("");
      toast({ title: "Internship added successfully" });
    },
  });

  const deleteInternshipMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/internship-documents/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/internship-documents"] });
      setSelectedInternship(null);
      toast({ title: "Internship deleted successfully" });
    },
  });

  const uploadFileMutation = useMutation({
    mutationFn: async (data: { internshipId: string; fileType: string; file: File }) => {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("internshipId", data.internshipId);
      formData.append("fileType", data.fileType);
      
      const response = await fetch("/api/internship-files", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/internship-files"] });
      toast({ title: "File uploaded successfully" });
    },
  });

  const deleteFileMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/internship-files/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/internship-files"] });
      toast({ title: "File deleted successfully" });
    },
  });

  const handleFileUpload = async (internshipId: string, fileType: string, file: File) => {
    await uploadFileMutation.mutateAsync({ internshipId, fileType, file });
  };

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

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const selectedInternshipData = internships?.find(i => i.id === selectedInternship);

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
                Internships
              </h1>
              <p className="text-slate-600 dark:text-slate-400" data-testid="text-page-description">
                Manage your internship documents and certificates
              </p>
            </div>
            
            <Dialog open={isAddingInternship} onOpenChange={setIsAddingInternship}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-internship">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Internship
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Internship</DialogTitle>
                  <DialogDescription>Enter the name of your internship</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="internship-name">Internship Name</Label>
                    <Input
                      id="internship-name"
                      value={newInternshipName}
                      onChange={(e) => setNewInternshipName(e.target.value)}
                      placeholder="e.g., Software Engineering Intern at Google"
                      data-testid="input-internship-name"
                    />
                  </div>
                  <Button
                    onClick={() => createInternshipMutation.mutate(newInternshipName)}
                    disabled={!newInternshipName || createInternshipMutation.isPending}
                    className="w-full"
                    data-testid="button-submit-internship"
                  >
                    {createInternshipMutation.isPending ? "Adding..." : "Add Internship"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Internships List</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {internships?.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No internships added yet</p>
                ) : (
                  internships?.map((internship) => (
                    <div
                      key={internship.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedInternship === internship.id
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      onClick={() => setSelectedInternship(internship.id)}
                      data-testid={`card-internship-${internship.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium" data-testid={`text-internship-name-${internship.id}`}>
                          {internship.internshipName}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {selectedInternshipData ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle data-testid="text-selected-internship-name">{selectedInternshipData.internshipName}</CardTitle>
                      <CardDescription>Upload and manage internship documents</CardDescription>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => selectedInternship && deleteInternshipMutation.mutate(selectedInternship)}
                      data-testid="button-delete-internship"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {["offer_letter", "completion_certificate", "other"].map((fileType) => (
                    <div key={fileType} className="space-y-2">
                      <Label>
                        {fileType === "offer_letter" ? "Offer Letter" : fileType === "completion_certificate" ? "Completion Certificate" : "Other Files"}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && selectedInternship) handleFileUpload(selectedInternship, fileType, file);
                          }}
                          data-testid={`input-upload-${fileType}`}
                        />
                      </div>
                      <div className="space-y-2">
                        {files?.filter(f => f.fileType === fileType).map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span className="text-sm" data-testid={`text-filename-${file.id}`}>{file.fileName}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownload(file.fileData, file.fileName, file.mimeType)}
                                data-testid={`button-download-${file.id}`}
                              >
                                Download
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteFileMutation.mutate(file.id)}
                                data-testid={`button-delete-file-${file.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-600 dark:text-slate-400">Select an internship to view and manage documents</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
