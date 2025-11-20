"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Admin } from "@/lib/types";

interface Props {
  admins: Admin[];
  currentAdmin: { name: string; email: string } | null;
  onEdit: (admin: Admin) => void;
  onDelete: (admin: Admin) => void;
}

export default function AdminTable({ admins, currentAdmin, onEdit, onDelete }: Props) {
  return (
    <div className="table-container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="w-[150px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {admins.length > 0 ? (
            admins.map((admin) => {
              const isCurrent =
                currentAdmin &&
                admin.email.toLowerCase() === currentAdmin.email.toLowerCase();
              return (
                <TableRow
                  key={admin.id}
                  className={isCurrent ? "bg-blue-50 dark:bg-blue-950/30" : ""}
                >
                  <TableCell className="font-medium flex items-center gap-2">
                    {admin.name}
                    {isCurrent && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-100">
                        You
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      className="cursor-pointer"
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(admin)}
                    >
                      Edit
                    </Button>
                    {!isCurrent && (
                      <Button
                        className="cursor-pointer"
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(admin)}
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-sm text-muted-foreground"
              >
                No admins found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
