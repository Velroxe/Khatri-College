"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface CustomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function CustomModal({
  open,
  onOpenChange,
  title,
  children,
  className,
}: CustomModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* 👇 Custom blurred overlay */}
      <DialogOverlay
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm transition-all"
        )}
      />
      <DialogContent
        className={cn(
          "max-w-lg w-[90%] max-h-[85vh] overflow-y-auto p-6 rounded-2xl shadow-xl",
          "bg-background border border-border",
          "animate-in fade-in-50 zoom-in-95",
          className
        )}
      >
        <DialogHeader className="flex flex-row items-center justify-between mb-2">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        </DialogHeader>

        {/* Scrollable modal content */}
        <div className="overflow-y-auto max-h-[65vh] pr-1">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
