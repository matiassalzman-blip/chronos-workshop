"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { EntryForm } from "@/components/chronos/EntryForm";
import { useChronosSession } from "@/hooks/useChronosSession";
import { EntryInput, useEntries } from "@/hooks/useEntries";
import { getMonthRange, getWeekRange, isWithinRange } from "@/lib/chronos/date";
import { clients, projects } from "@/lib/chronos/fixtures";
import { Entry } from "@/lib/chronos/types";

function projectLabel(projectId: string): string {
  const project = projects.find((p) => p.id === projectId);
  if (!project) return "Unknown project";
  if (project.clientId === null) return project.name;
  return `${clients.find((client) => client.id === project.clientId)?.name} — ${project.name}`;
}

export default function EntriesPage() {
  const router = useRouter();
  const { currentUser } = useChronosSession();
  const { entries, addEntry, updateEntry, deleteEntry } = useEntries(
    currentUser?.id ?? null
  );

  const [formOpen, setFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | undefined>(
    undefined
  );
  const [deletingEntry, setDeletingEntry] = useState<Entry | null>(null);

  useEffect(() => {
    if (!currentUser) router.replace("/login");
  }, [currentUser, router]);

  if (!currentUser) return null;

  const weekRange = getWeekRange(new Date());
  const weekTotal = entries
    .filter((entry) => isWithinRange(entry.date, weekRange))
    .reduce((sum, entry) => sum + entry.hours, 0);

  const monthRange = getMonthRange(new Date());
  const monthTotal = entries
    .filter((entry) => isWithinRange(entry.date, monthRange))
    .reduce((sum, entry) => sum + entry.hours, 0);

  const openAddForm = () => {
    setEditingEntry(undefined);
    setFormOpen(true);
  };

  const openEditForm = (entry: Entry) => {
    setEditingEntry(entry);
    setFormOpen(true);
  };

  const handleSubmit = (input: EntryInput) => {
    if (editingEntry) {
      updateEntry(editingEntry.id, input);
    } else {
      addEntry(input);
    }
    setFormOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingEntry) deleteEntry(deletingEntry.id);
    setDeletingEntry(null);
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>My Entries</h1>
          <p className="text-sm text-muted-foreground">
            This week:{" "}
            <span className="font-medium text-foreground">{weekTotal}</span>{" "}
            hours logged
          </p>
          <p className="text-sm text-muted-foreground">
            This month:{" "}
            <span className="font-medium text-foreground">{monthTotal}</span>{" "}
            hours logged
          </p>
        </div>
        <Button onClick={openAddForm}>
          <PlusIcon />
          Add entry
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-sm text-muted-foreground">
            No entries yet. Add a row, fill it in, and you&apos;re done — should
            take about 10 seconds.
          </p>
          <Button onClick={openAddForm}>
            <PlusIcon />
            Add entry
          </Button>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Billable</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{projectLabel(entry.projectId)}</TableCell>
                <TableCell>{entry.hours}</TableCell>
                <TableCell>
                  <Badge variant={entry.billable ? "default" : "secondary"}>
                    {entry.billable ? "Billable" : "Non-billable"}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-64 truncate">
                  {entry.description}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {entry.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => openEditForm(entry)}
                    >
                      <PencilIcon />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setDeletingEntry(entry)}
                    >
                      <TrashIcon />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingEntry ? "Edit entry" : "Add entry"}
            </DialogTitle>
          </DialogHeader>
          <EntryForm
            entry={editingEntry}
            onSubmit={handleSubmit}
            onCancel={() => setFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletingEntry}
        onOpenChange={(open) => !open && setDeletingEntry(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete entry?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this entry. This can&apos;t be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
