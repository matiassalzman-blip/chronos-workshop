"use client";
import { Link } from "@/components/shared";
import appRoutes from "@/routes/appRoutes";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering theme-dependent content after mount
  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const isDarkMode = theme === "dark";

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo Section */}
        <Link
          href={appRoutes.rootPath()}
          className="flex items-center space-x-3"
        >
          <div className="relative h-8 w-auto">
            <Image
              src="/assets/images/logo.png"
              alt="Dualboot Partners Logo"
              width={197}
              height={56}
              className="h-full w-auto object-contain"
              priority
            />
          </div>
        </Link>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(isDarkMode ? "light" : "dark")}
            className="rounded-md p-2 text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            title={
              mounted
                ? isDarkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
                : "Toggle theme"
            }
          >
            {!mounted ? (
              <MoonIcon className="h-5 w-5" />
            ) : isDarkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>

          {/* User Avatar/Profile area (placeholder) */}
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                SC
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
