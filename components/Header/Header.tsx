"use client";
import { Link } from "@/components/shared";
import appRoutes from "@/routes/appRoutes";
import Image from "next/image";

const Header = () => {
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
