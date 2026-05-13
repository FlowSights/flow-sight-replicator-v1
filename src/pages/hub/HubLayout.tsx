import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  KanbanSquare, 
  PackageSearch, 
  Calendar, 
  Map, 
  MessageSquare, 
  BarChart3, 
  Bot, 
  Settings 
} from "lucide-react";

interface HubLayoutProps {
  children: ReactNode;
}

export function HubLayout({ children }: HubLayoutProps) {
  const location = useLocation();

  const navigation = [
    { name: "Overview", href: "/hub", icon: LayoutDashboard },
    { name: "Customers", href: "/hub/customers", icon: Users },
    { name: "Booking Pipeline", href: "/hub/pipeline", icon: KanbanSquare },
    { name: "Services", href: "/hub/services", icon: PackageSearch },
    { name: "Calendar", href: "/hub/calendar", icon: Calendar },
    { name: "Itineraries", href: "/hub/itineraries", icon: Map },
    { name: "Communications", href: "/hub/communications", icon: MessageSquare },
    { name: "Analytics", href: "/hub/analytics", icon: BarChart3 },
    { name: "AI Assistant", href: "/hub/ai", icon: Bot },
    { name: "Settings", href: "/hub/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card/30 backdrop-blur-xl flex flex-col transition-all duration-300">
        <div className="h-16 flex items-center px-6 border-b border-border/50">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-black font-bold text-xs">FS</span>
            </div>
            <span className="font-bold text-lg tracking-tight">FlowSights <span className="text-emerald-500 font-black">Hub</span></span>
          </Link>
        </div>
        
        <div className="p-4 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">
          Operations
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 space-y-1 scrollbar-none">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-primary/10 text-primary font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" 
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-emerald-500" />
            <div className="flex flex-col">
              <span className="text-xs font-bold">Admin</span>
              <span className="text-[10px] text-muted-foreground">FlowSights Core</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#f8fafc] dark:bg-[#020202]">
        <div className="max-w-[1600px] mx-auto p-6 md:p-8 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
