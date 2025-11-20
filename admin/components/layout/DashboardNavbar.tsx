"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";

interface NavbarProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export function DashboardNavbar({ menuOpen, setMenuOpen }: NavbarProps) {
  return (
    <header className="flex items-center justify-between border-b bg-card px-4 py-3 shadow-sm sticky top-0 z-30">
      {/* Left: Heading */}
      <h1 className="text-xl font-semibold">Khatri College Admin</h1>

      {/* Right: Theme + Menu */}
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-md md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
