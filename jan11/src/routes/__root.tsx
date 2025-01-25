import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div
        className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 
             dark:from-gray-800 dark:via-gray-900 dark:to-black 
             transition-all duration-500"
      >
        <Outlet />
      </div>

      <TanStackRouterDevtools />
    </>
  );
}
