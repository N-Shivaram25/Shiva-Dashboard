import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Briefcase, Award, Link as LinkIcon } from "lucide-react";

export default function DocsPage() {
  const documentSections = [
    {
      title: "College Documents",
      description: "Manage your academic records, certificates, and important documents",
      icon: FileText,
      href: "/docs/college",
      color: "bg-blue-500/10 hover:bg-blue-500/20",
      iconColor: "text-blue-500",
    },
    {
      title: "Internships",
      description: "Track internship details, offer letters, and completion certificates",
      icon: Briefcase,
      href: "/docs/internships",
      color: "bg-purple-500/10 hover:bg-purple-500/20",
      iconColor: "text-purple-500",
    },
    {
      title: "Certifications",
      description: "Store and organize your professional certifications and achievements",
      icon: Award,
      href: "/docs/certifications",
      color: "bg-green-500/10 hover:bg-green-500/20",
      iconColor: "text-green-500",
    },
    {
      title: "Links",
      description: "Save important links and resources for quick access",
      icon: LinkIcon,
      href: "/docs/links",
      color: "bg-orange-500/10 hover:bg-orange-500/20",
      iconColor: "text-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3" data-testid="text-page-title">
            Document Management
          </h1>
          <p className="text-slate-600 dark:text-slate-400" data-testid="text-page-description">
            Organize and manage all your important documents in one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {documentSections.map((section) => (
            <Link key={section.title} href={section.href} data-testid={`link-${section.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <Card className={`transition-all duration-300 cursor-pointer border-2 ${section.color} hover:shadow-lg hover:scale-[1.02]`}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-white dark:bg-slate-800 ${section.iconColor}`}>
                      <section.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2" data-testid={`text-${section.title.toLowerCase().replace(/\s+/g, '-')}-title`}>
                        {section.title}
                      </CardTitle>
                      <CardDescription data-testid={`text-${section.title.toLowerCase().replace(/\s+/g, '-')}-description`}>
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
