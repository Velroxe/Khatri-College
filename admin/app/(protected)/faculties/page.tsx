"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddOrEditFacultyModal } from "./components/AddOrEditFacultyModal";
import { FacultiesTable } from "./components/FacultiesTable";

export default function FacultiesPage() {
  const [openModal, setOpenModal] = useState(false);

  // Used to force FacultiesTable to re-render from backend
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="p-6 space-y-6">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Faculties</h1>

        <Button onClick={() => setOpenModal(true)}>Add Faculty</Button>
      </div>

      {/* --- TABLE SECTION --- */}
      <FacultiesTable key={refreshKey} />

      {/* --- ADD / EDIT MODAL (no faculty passed = Add mode) --- */}
      <AddOrEditFacultyModal
        open={openModal}
        onOpenChange={setOpenModal}
        faculty={null}
        onSaved={triggerRefresh}
      />
    </div>
  );
}
