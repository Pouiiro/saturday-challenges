import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/investments")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex justify-center items-center text-4xl h-screen w-[calc(100vw-15rem)] text-green-600">
      Coming soon...
    </div>
  );
}
