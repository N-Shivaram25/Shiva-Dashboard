import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Home,
  Target,
  CheckSquare,
  Cloud,
  Zap,
  Heart,
  MessageCircle,
  Film,
  Brain,
  FileText,
} from "lucide-react";

const menuItems = [
  { title: "Overview", url: "/", icon: Home },
  { title: "Goals", url: "/goals", icon: Target },
  { title: "Tasks", url: "/tasks", icon: CheckSquare },
  { title: "Thoughts", url: "/thoughts", icon: Cloud },
  { title: "Energy", url: "/energy", icon: Zap },
  { title: "Wellness", url: "/wellness", icon: Heart },
  { title: "Communication", url: "/communication", icon: MessageCircle },
  { title: "Entertainment", url: "/entertainment", icon: Film },
  { title: "Data Science", url: "/data-science", icon: Brain },
  { title: "Docs", url: "/docs", icon: FileText },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Daily Tracker</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase()}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
