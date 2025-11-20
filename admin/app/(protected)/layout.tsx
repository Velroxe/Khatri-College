"use client";

import { DashboardNavbar } from "@/components/layout/DashboardNavbar";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { useRequireAuth } from "@/lib/auth-redirects";
import { useState } from "react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const checked = useRequireAuth();
  
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCloseMenu = () => setMenuOpen(false);
  
  if (!checked) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground relative">
      {/* Sidebar for desktop */}
      <DashboardSidebar className="hidden md:flex" />

      {/* Main area */}
      <div className="flex-1 flex flex-col relative">
        <DashboardNavbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        {/* Mobile Overlay & Sidebar */}
        {menuOpen && (
          <>
            {/* Transparent overlay (behind hamburger, clickable to close) */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={handleCloseMenu}
            />

            {/* Sidebar on mobile */}
            <DashboardSidebar
              className="fixed left-0 top-0 bottom-0 w-64 bg-card shadow-lg z-50 md:hidden"
              onLinkClick={handleCloseMenu}
              isMobile
            />
          </>
        )}

        {/* Page content */}
        <main className="flex-1 p-4 max-w-dvw overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
