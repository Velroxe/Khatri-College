"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Home, Settings, X, LogOut, BookOpen,} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
  onLinkClick?: () => void;
  isMobile?: boolean; // to show cross button in mobile sidebar
}

const navLinks = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Logout", href: "/logout", icon: LogOut },
];

export function DashboardSidebar({ className, onLinkClick, isMobile }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col w-64 border-r bg-card text-foreground z-50",
        className
      )}
    >
      {/* Header (only for mobile view) */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b">
          <div className="font-semibold text-lg">Menu</div>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-md"
            onClick={onLinkClick}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      {!isMobile && <div className="p-4 font-semibold text-lg border-b">Menu</div>}

      <nav className="flex-1 p-2 space-y-1">
        {navLinks.map(({ name, href, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={name}
              href={href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition",
                active && "bg-accent"
              )}
            >
              <Icon className="h-4 w-4" />
              {name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
