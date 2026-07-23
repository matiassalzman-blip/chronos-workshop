import { Link } from "@/components/shared";

const HomePage = () => {
  return (
    <div className="loop-main-content">
      {/* Breadcrumb */}
      <nav className="loop-breadcrumb dark:text-gray-400">
        <Link
          href="/"
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-500 dark:text-gray-400">Dashboard</span>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Welcome
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Feel free to remove all the content in this page (app/page.tsx) to
          start working on your prototype.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Welcome Card */}
        <div className="loop-card">
          <div className="loop-card-content">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Welcome to Dualboot Prototype Starter
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              This is a Next.js application styled with Tailwind CSS and
              shadcn/ui, set up for fast, high-fidelity UI prototyping.
            </p>
            <div className="flex space-x-4">
              <button className="loop-button-primary">Get Started</button>
              <button className="loop-button-secondary">Learn More</button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="loop-card">
          <div className="loop-card-content">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                href="/projects"
                className="block rounded-md p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center">
                  <div className="mr-3 h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="dark:text-gray-300">View Projects</span>
                </div>
              </Link>
              <Link
                href="/team"
                className="block rounded-md p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center">
                  <div className="mr-3 h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="dark:text-gray-300">Team Members</span>
                </div>
              </Link>
              <Link
                href="/analytics"
                className="block rounded-md p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center">
                  <div className="mr-3 h-2 w-2 rounded-full bg-yellow-500"></div>
                  <span className="dark:text-gray-300">View Analytics</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="loop-card">
          <div className="loop-card-content">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Technologies Used
            </h3>
            <div className="space-y-4">
              <div className="tech-card">
                <span className="font-medium dark:text-gray-300">
                  Next.js 16
                </span>
                <span className="float-right text-sm text-gray-500 dark:text-gray-400">
                  React Framework
                </span>
              </div>
              <div className="tech-card">
                <span className="font-medium dark:text-gray-300">
                  TypeScript
                </span>
                <span className="float-right text-sm text-gray-500 dark:text-gray-400">
                  Type Safety
                </span>
              </div>
              <div className="tech-card">
                <span className="font-medium dark:text-gray-300">
                  Tailwind CSS
                </span>
                <span className="float-right text-sm text-gray-500 dark:text-gray-400">
                  Styling
                </span>
              </div>
              <div className="tech-card">
                <span className="font-medium dark:text-gray-300">
                  shadcn/ui
                </span>
                <span className="float-right text-sm text-gray-500 dark:text-gray-400">
                  Components
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* External Links */}
        <div className="loop-card">
          <div className="loop-card-content">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              External Resources
            </h3>
            <div className="space-y-3">
              <a
                href="https://github.com/dualbootpartners/latam-nextjs-seed"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-md border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium dark:text-gray-300">
                    Check Repository
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    GitHub
                  </span>
                </div>
              </a>
              <a
                href="https://www.npmjs.com/package/@dualbootpartners/latam-nextjs-cli"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-md border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium dark:text-gray-300">
                    Check CLI
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    NPM
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
