"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useChronosSession } from "@/hooks/useChronosSession";
import { users } from "@/lib/chronos/fixtures";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { currentUser, login } = useChronosSession();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) router.replace("/");
  }, [currentUser, router]);

  if (currentUser) return null;

  const handleContinue = () => {
    if (!selectedId) return;
    login(selectedId);
    router.replace("/");
  };

  return (
    <div className="flex min-h-full items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Chronos</CardTitle>
          <CardDescription>Who&apos;s logging time today?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {users.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => setSelectedId(user.id)}
                className={cn(
                  "flex items-center gap-3 rounded-lg border border-input px-3 py-2 text-left transition-colors hover:bg-muted",
                  selectedId === user.id && "border-ring bg-accent"
                )}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                  {user.initials}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {user.name}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            disabled={!selectedId}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
