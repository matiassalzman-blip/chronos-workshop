"use client";

import { useRouter } from "next/navigation";

import { Link } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useChronosSession } from "@/hooks/useChronosSession";
import appRoutes from "@/routes/appRoutes";

const Header = () => {
  const router = useRouter();
  const { currentUser, logout } = useChronosSession();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

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
            <Button variant="link" size="sm" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
