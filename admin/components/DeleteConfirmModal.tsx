"use client";

import { Button } from "@/components/ui/button";
import { CustomModal } from "@/components/CustomModal";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function DeleteConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  title,
  message,
}: Props) {
  return (
    <CustomModal open={open} onOpenChange={onOpenChange} title={title}>
      <p className="text-sm text-muted-foreground">{message}</p>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          Confirm Delete
        </Button>
      </div>
    </CustomModal>
  );
}
