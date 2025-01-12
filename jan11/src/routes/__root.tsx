import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <div className="bg-gradient-to-br from-blue-100 via-white to-blue-50 min-h-screen">
        <Outlet />
      </div>

      <TanStackRouterDevtools />
    </>
  );
}
