import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="max-w-3xl w-full p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-blue-600 text-center mb-6">
          About Pollarize
        </h1>
        <p className="text-lg text-gray-700 leading-7 mb-4">
          Welcome to <span className="font-semibold">Pollarize</span>!
        </p>
        <p className="text-gray-600 mb-6">
          At <span className="font-semibold">Pollarize</span>, we believe in the
          power of opinions and collective decision-making. Whether you're
          trying to settle a debate, gather feedback, or make important group
          decisions, Pollarize is here to simplify the process.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          What is Pollarize?
        </h2>
        <p className="text-gray-600 mb-6">
          <span className="font-semibold">Pollarize</span> is your go-to
          platform for creating, sharing, and analyzing polls with ease. It’s
          designed to help you connect with your audience, friends, or team, and
          get the insights you need—all in one place.
        </p>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Why Choose Pollarize?
        </h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
          <li>
            <span className="font-semibold">Intuitive Design:</span> Easily
            create and manage polls in just a few clicks.
          </li>
          <li>
            <span className="font-semibold">Real-Time Results:</span> Get
            instant feedback and insights as responses roll in.
          </li>
          <li>
            <span className="font-semibold">Customizable Options:</span> Tailor
            your polls to allow single or multiple selections, set descriptions,
            and much more.
          </li>
          <li>
            <span className="font-semibold">Seamless Sharing:</span> Share your
            polls with anyone via a unique link.
          </li>
        </ul>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Our Mission
        </h2>
        <p className="text-gray-600">
          To empower individuals, teams, and communities by making polling
          simple, efficient, and accessible to everyone.
        </p>
        <p className="text-gray-600 mt-4">
          Whether you're a team leader, an event organizer, or just someone
          curious about others' opinions, Pollarize is built for you.
        </p>
        <p className="text-lg font-semibold text-gray-800 mt-6 text-center">
          Start creating polls that matter today!
        </p>
      </div>
    </div>
  );
}
