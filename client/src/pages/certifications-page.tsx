import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Award, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { CertificationDocument } from "@shared/schema";

export default function CertificationsPage() {
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [certName, setCertName] = useState("");
  const [certFile, setCertFile] = useState<File | null>(null);
  const { toast } = useToast();

  const { data: certifications, isLoading } = useQuery<CertificationDocument[]>({
    queryKey: ["/api/certification-documents"],
  });

  const uploadCertMutation = useMutation({
    mutationFn: async (data: { name: string; file: File }) => {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("name", data.name);
      
      const response = await fetch("/api/certification-documents", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/certification-documents"] });
      setIsAddingCert(false);
      setCertName("");
      setCertFile(null);
      toast({ title: "Certification added successfully" });
    },
  });

  const deleteCertMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/certification-documents/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/certification-documents"] });
      toast({ title: "Certification deleted successfully" });
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
    if (certName && certFile) {
      uploadCertMutation.mutate({ name: certName, file: certFile });
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
                Certifications
              </h1>
              <p className="text-slate-600 dark:text-slate-400" data-testid="text-page-description">
                Store and manage your professional certifications
              </p>
            </div>
            
            <Dialog open={isAddingCert} onOpenChange={setIsAddingCert}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-certification">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Certification
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Certification</DialogTitle>
                  <DialogDescription>Upload your certification document</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="cert-name">Certification Name</Label>
                    <Input
                      id="cert-name"
                      value={certName}
                      onChange={(e) => setCertName(e.target.value)}
                      placeholder="e.g., AWS Certified Solutions Architect"
                      data-testid="input-certification-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cert-file">Upload Certificate</Label>
                    <Input
                      id="cert-file"
                      type="file"
                      onChange={(e) => setCertFile(e.target.files?.[0] || null)}
                      data-testid="input-certification-file"
                    />
                  </div>
                  <Button
                    onClick={handleSubmit}
                    disabled={!certName || !certFile || uploadCertMutation.isPending}
                    className="w-full"
                    data-testid="button-submit-certification"
                  >
                    {uploadCertMutation.isPending ? "Uploading..." : "Add Certification"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications?.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-center py-12">
                <Award className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                <p className="text-slate-600 dark:text-slate-400">No certifications added yet</p>
              </CardContent>
            </Card>
          ) : (
            certifications?.map((cert) => (
              <Card key={cert.id} className="hover:shadow-lg transition-shadow" data-testid={`card-certification-${cert.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg" data-testid={`text-certification-name-${cert.id}`}>
                          {cert.name}
                        </CardTitle>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1" data-testid={`text-certification-filename-${cert.id}`}>
                          {cert.fileName}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleDownload(cert.fileData, cert.fileName, cert.mimeType)}
                      data-testid={`button-download-${cert.id}`}
                    >
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteCertMutation.mutate(cert.id)}
                      data-testid={`button-delete-${cert.id}`}
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
