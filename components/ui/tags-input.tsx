"use client";

import { KeyboardEvent, useState } from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagsInputProps {
  id?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  max?: number;
  "aria-invalid"?: boolean;
}

export function TagsInput({
  id,
  value,
  onChange,
  placeholder,
  max = 8,
  "aria-invalid": ariaInvalid
}: TagsInputProps) {
  const [draft, setDraft] = useState("");
  const atMax = value.length >= max;

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag || atMax || value.includes(tag)) return;
    onChange([...value, tag]);
    setDraft("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(draft);
    } else if (event.key === "Backspace" && draft === "" && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-lg border border-input bg-transparent px-2.5 py-1.5 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        ariaInvalid &&
          "border-destructive ring-3 ring-destructive/20 dark:ring-destructive/40"
      )}
    >
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((tag) => (
            <Badge key={tag} variant="outline" data-icon="inline-end">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove tag ${tag}`}
                className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <X />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <input
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={atMax}
        placeholder={atMax ? undefined : placeholder}
        aria-invalid={ariaInvalid}
        className="h-6 w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm"
      />
      {atMax && (
        <p className="text-xs text-muted-foreground">Max {max} tags.</p>
      )}
    </div>
  );
}
