"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toISODate } from "@/lib/chronos/date";
import { clients, projects } from "@/lib/chronos/fixtures";
import { Entry } from "@/lib/chronos/types";
import { EntryInput } from "@/hooks/useEntries";

const MAX_HOURS = 24;
const HOURS_STEP = 0.25;

interface FormState {
  date: string;
  projectId: string;
  hours: string;
  description: string;
  billable: boolean;
  billableTouched: boolean;
  tags: string;
}

function toFormState(entry?: Entry): FormState {
  if (!entry) {
    return {
      date: toISODate(new Date()),
      projectId: "",
      hours: "",
      description: "",
      billable: false,
      billableTouched: false,
      tags: ""
    };
  }

  return {
    date: entry.date,
    projectId: entry.projectId,
    hours: String(entry.hours),
    description: entry.description,
    billable: entry.billable,
    billableTouched: true,
    tags: entry.tags.join(", ")
  };
}

function isClientProject(projectId: string): boolean {
  return (
    projects.find((project) => project.id === projectId)?.clientId !== null
  );
}

interface EntryFormProps {
  entry?: Entry;
  onSubmit: (input: EntryInput) => void;
  onCancel: () => void;
}

export function EntryForm({ entry, onSubmit, onCancel }: EntryFormProps) {
  const [form, setForm] = useState<FormState>(() => toFormState(entry));
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const handleProjectChange = (projectId: string) => {
    setForm((prev) => ({
      ...prev,
      projectId,
      billable: prev.billableTouched
        ? prev.billable
        : isClientProject(projectId)
    }));
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.date) nextErrors.date = "Date is required.";
    if (!form.projectId) nextErrors.projectId = "Pick a project.";

    const hours = Number(form.hours);
    if (!form.hours.trim()) {
      nextErrors.hours = "Hours is required.";
    } else if (Number.isNaN(hours) || hours <= 0) {
      nextErrors.hours = "Enter a positive number of hours.";
    } else if (Math.round(hours / HOURS_STEP) !== hours / HOURS_STEP) {
      nextErrors.hours = "Hours must be in 0.25 increments.";
    } else if (hours > MAX_HOURS) {
      nextErrors.hours = `Hours can't exceed ${MAX_HOURS} for a single entry.`;
    }

    if (form.description.trim().length < 3) {
      nextErrors.description = "Description must be at least 3 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    onSubmit({
      date: form.date,
      projectId: form.projectId,
      hours: Number(form.hours),
      description: form.description.trim(),
      billable: form.billable,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="entry-date">Date</Label>
          <Input
            id="entry-date"
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, date: e.target.value }))
            }
            aria-invalid={!!errors.date}
          />
          {errors.date && (
            <p className="text-xs text-destructive">{errors.date}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="entry-hours">Hours</Label>
          <Input
            id="entry-hours"
            type="number"
            step={HOURS_STEP}
            min={HOURS_STEP}
            placeholder="0.00"
            value={form.hours}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, hours: e.target.value }))
            }
            aria-invalid={!!errors.hours}
          />
          {errors.hours && (
            <p className="text-xs text-destructive">{errors.hours}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="entry-project">Project</Label>
        <Select value={form.projectId} onValueChange={handleProjectChange}>
          <SelectTrigger
            id="entry-project"
            className="w-full"
            aria-invalid={!!errors.projectId}
          >
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Client projects</SelectLabel>
              {projects
                .filter((project) => project.clientId !== null)
                .map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {
                      clients.find((client) => client.id === project.clientId)
                        ?.name
                    }{" "}
                    — {project.name}
                  </SelectItem>
                ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Internal</SelectLabel>
              {projects
                .filter((project) => project.clientId === null)
                .map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.projectId && (
          <p className="text-xs text-destructive">{errors.projectId}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="entry-description">Description</Label>
        <Textarea
          id="entry-description"
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, description: e.target.value }))
          }
          aria-invalid={!!errors.description}
          placeholder="What did you work on?"
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="entry-tags">Tags</Label>
        <Input
          id="entry-tags"
          value={form.tags}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, tags: e.target.value }))
          }
          placeholder="design, client-call"
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-input px-3 py-2">
        <Label htmlFor="entry-billable" className="cursor-pointer">
          Billable
        </Label>
        <Switch
          id="entry-billable"
          checked={form.billable}
          onCheckedChange={(checked) =>
            setForm((prev) => ({
              ...prev,
              billable: checked,
              billableTouched: true
            }))
          }
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{entry ? "Save changes" : "Add entry"}</Button>
      </DialogFooter>
    </form>
  );
}
