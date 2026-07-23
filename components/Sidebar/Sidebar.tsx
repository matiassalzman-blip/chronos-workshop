"use client";
import { Link } from "@/components/shared";
import appRoutes from "@/routes/appRoutes";
import {
  ChartBarIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  HomeIcon,
  UsersIcon
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const navItems = [
    {
      icon: HomeIcon,
      label: "Dashboard",
      href: appRoutes.rootPath(),
      active: true
    },
    { icon: DocumentTextIcon, label: "Documents", href: "#", active: false },
    { icon: UsersIcon, label: "Team", href: "#", active: false },
    { icon: ChartBarIcon, label: "Analytics", href: "#", active: false },
    { icon: Cog6ToothIcon, label: "Settings", href: "#", active: false }
  ];

  return (
    <aside className="loop-sidebar dark:border-gray-800 dark:bg-gray-900">
      <div className="p-6">
        <nav className="space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                href={item.href}
                className={`loop-nav-item ${item.active ? "active" : ""}`}
              >
                <Icon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="absolute right-0 bottom-0 left-0 border-t border-gray-200 p-6 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              SC
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              Seed Creator
            </p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              creator@dualboot.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
