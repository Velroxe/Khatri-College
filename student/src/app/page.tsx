"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Home() {
  const host = process.env.NEXT_PUBLIC_BACKEND || "";

  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${host}/api/auth/student/me`, { credentials: "include" });
        const data = await res.json();

        if (data?.loggedIn) {
          router.replace("/dashboard");
        } else {
          router.replace("/login");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
}
