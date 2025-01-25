import { useUserStore } from "@/stores/user";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { getAuth } from "firebase/auth";

export const Route = createFileRoute("/_layout/")({
  component: RouteComponent,
  beforeLoad: () => {
    const user = useUserStore.getState().user;

    if (!user) {
      redirect({
        to: "/login",
        throw: true,
      });
    }
  },
});

function RouteComponent() {
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="text-center">
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 text-3xl font-extrabold text-blue-600">
              <span className="bg-blue-600 text-white p-2 rounded-full shadow-md">
                P
              </span>
              <span>Pollarize</span>
            </div>
          </div>

          <h1 className="text-5xl font-bold text-gray-800 leading-snug mb-6">
            Welcome to <span className="text-blue-500">Pollarize</span>
          </h1>

          <p className="text-gray-600 text-lg mb-8">
            Create, manage, and share polls effortlessly. Start engaging today!
          </p>

          <Link
            to={"/polls"}
            className="inline-block bg-blue-600 text-white text-lg font-medium px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>

        <div className="absolute bottom-0 right-10  w-72 h-72 bg-gradient-to-r from-blue-400 via-blue-300 to-blue-200 opacity-60 rounded-full blur-2xl animate-floating"></div>
        <div className="absolute top-0 left-10 w-96 h-96 bg-gradient-to-r from-pink-300 via-pink-400 to-pink-500 opacity-50 rounded-full blur-3xl animate-rotate"></div>
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-gradient-to-r from-green-200 to-green-400 opacity-40 rounded-full blur-2xl animate-floating-reverse"></div>
      </div>
    </div>
  );
}
