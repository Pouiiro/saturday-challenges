import { Link } from "@tanstack/react-router";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-blue-600 font-bold text-2xl tracking-wide">
              Pollarize
            </span>
          </div>

          <div className="hidden md:flex space-x-6">
            <Link
              to="/"
              activeProps={{ className: "text-blue-600 font-semibold" }}
              className="hover:text-blue-600 transition"
            >
              Home
            </Link>
            <Link
              to="/polls"
              activeProps={{ className: "text-blue-600 font-semibold" }}
              className={"hover:text-blue-600 transition"}
            >
              Polls
            </Link>
            <Link
              to="/about"
              activeProps={{ className: "text-blue-600 font-semibold" }}
              className={"hover:text-blue-600 transition "}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
