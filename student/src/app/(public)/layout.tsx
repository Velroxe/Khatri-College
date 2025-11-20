"use client";

import { useRedirectIfAuthenticated } from "@/lib/authRedirects";


export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const checked = useRedirectIfAuthenticated();
  
  if (!checked) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>{children}</>
  );
}
