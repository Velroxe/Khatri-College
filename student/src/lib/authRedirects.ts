"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND || "";

export function useRedirectIfAuthenticated() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/student/me`, {
          credentials: "include",
        });
        const data = await res.json();

        if (data?.loggedIn) {
          router.replace("/dashboard");
        }
      } catch (err) {
        console.error("RedirectIfAuthenticated error:", err);
      } finally {
        setChecked(true);
      }
    };

    // Run after hydration
    const timer = setTimeout(verify, 100);
    return () => clearTimeout(timer);
  }, [router]);

  return checked;
}

export function useRequireAuth() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/student/me`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!data?.loggedIn) {
          router.replace("/login");
        }
      } catch (err) {
        console.error("RequireAuth error:", err);
        router.replace("/login");
      } finally {
        setChecked(true);
      }
    };

    const timer = setTimeout(verify, 100);
    return () => clearTimeout(timer);
  }, [router]);

  return checked;
}
