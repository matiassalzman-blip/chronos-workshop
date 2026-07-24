"use client";

import { Link } from "@/components/shared";
import { useChronosSession } from "@/hooks/useChronosSession";
import appRoutes from "@/routes/appRoutes";

const Header = () => {
  const { currentUser } = useChronosSession();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

  return (
    <header className="border-b border-border bg-background">
      <div className="flex items-center justify-between px-6 py-3">
        <Link href={appRoutes.rootPath()} className="flex items-center">
          <span className="font-heading text-base font-semibold text-foreground">
            Chronos
          </span>
        </Link>

        {currentUser && (
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
              {currentUser.initials}
            </span>
            <span className="text-sm font-medium text-foreground">
              {currentUser.name}
            </span>
            <span
              className="text-xs text-muted-foreground"
              suppressHydrationWarning
            >
              {today}
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
