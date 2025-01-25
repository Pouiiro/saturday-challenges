import { AnimatedOutlet } from "@/components/common/animatedOutlet";
import { SideMenu } from "@/components/common/sidebar";
import { useStore } from "@/stores/richie";
import { createFileRoute, useMatch, useMatches } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { LampCeiling } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const darkMode = useStore((state) => state.darkMode);
  const matches = useMatches();
  const match = useMatch({ strict: false });
  const nextMatchIndex = matches.findIndex((d) => d.id === match.id) + 1;
  const nextMatch = matches[nextMatchIndex];
  const toggleDarkMode = useStore((state) => state.toggleDarkMode);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="flex">
      <div
        className={`absolute top-12 left-1/2 transform -translate-x-1/2 rounded-full w-64 h-64 transition-all duration-500 z-0 ${
          darkMode
            ? "bg-yellow-300/20 blur-3xl scale-100"
            : "bg-transparent scale-0"
        }`}
      />
      <div
        className="fixed top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        style={{
          zIndex: 999,
        }}
      >
        <div className="w-0.5 h-5 bg-gray-400 dark:bg-gray-600" />
        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-center  rounded-full dark:bg-transparent transition-all duration-300"
          aria-label="Toggle dark mode"
        >
          <LampCeiling
            size={38}
            className={`transition-colors duration-300 -mt-2 ${
              darkMode ? "text-yellow-400" : "text-gray-400"
            }`}
          />
        </button>
      </div>
      <SideMenu />
      <div>
        <AnimatePresence mode="popLayout">
          <AnimatedOutlet key={nextMatch.id} />
        </AnimatePresence>
      </div>
    </div>
  );
}
