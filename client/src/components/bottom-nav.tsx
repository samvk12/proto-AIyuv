import { useLocation, Link } from "wouter";
import { Home, Activity, MessageSquare, User } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/quiz", label: "Assess", icon: Activity },
  { path: "/symptoms", label: "AI Chat", icon: MessageSquare },
  { path: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="bottom-nav md:hidden">
      <div className="flex justify-around items-center py-1 px-2">
        {navItems.map((item) => {
          const isActive = location === item.path || 
            (item.path === "/" && location === "/") ||
            (item.path === "/quiz" && (location === "/quiz" || location === "/results"));
          
          return (
            <Link key={item.path} href={item.path}>
              <button
                className={`nav-item ${isActive ? "active" : ""}`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
