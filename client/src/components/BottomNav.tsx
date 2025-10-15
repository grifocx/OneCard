import { Home, TrendingUp, History } from "lucide-react";
import { useLocation } from "wouter";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Today", path: "/", icon: <Home className="w-5 h-5" /> },
  { label: "Progress", path: "/progress", icon: <TrendingUp className="w-5 h-5" /> },
  { label: "History", path: "/history", icon: <History className="w-5 h-5" /> },
];

export default function BottomNav() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex items-center justify-around max-w-3xl mx-auto">
        {navItems.map((item) => {
          const isActive = location === item.path;
          return (
            <button
              key={item.path}
              onClick={() => setLocation(item.path)}
              data-testid={`nav-${item.label.toLowerCase()}`}
              className={`
                flex flex-col items-center gap-1 py-3 px-6 flex-1 transition-colors
                hover-elevate active-elevate-2
                ${isActive ? 'text-primary' : 'text-muted-foreground'}
              `}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
