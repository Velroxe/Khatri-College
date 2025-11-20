"use client";

import React from "react";
import { ScholarsTable } from "./components/ScholarsTable";

export default function ScholarsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Scholars</h1>
      </div>

      {/* TABLE (handles add/edit/delete inside it) */}
      <ScholarsTable />
    </div>
  );
}
