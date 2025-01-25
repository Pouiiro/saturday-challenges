import { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

type Context = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<Context>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div
        className="bg-gradient-to-br from-blue-100 via-white to-blue-50 
             dark:from-gray-800 dark:via-gray-900 dark:to-black dark:text-white 
             min-h-screen transition-colors duration-500"
      >
        <Outlet />
      </div>

      <TanStackRouterDevtools />
    </>
  );
}
