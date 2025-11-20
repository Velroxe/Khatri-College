"use client"

import { useRouter } from 'next/navigation';
import React from 'react'

const Logout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    localStorage.clear();
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/api/auth/admin/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.replace("/login");
  }

  handleLogout();

  return (
    <div>Logging out....</div>
  )
}

export default Logout