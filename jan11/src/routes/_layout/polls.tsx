import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { Card } from "@/components/ui/card";
import { usePollStore } from "@/stores/poll";
import { useEffect } from "react";
import { EditIcon, ListIcon, TrashIcon } from "lucide-react";

export const Route = createFileRoute("/_layout/polls")({
  component: RouteComponent,
});

function RouteComponent() {
  const polls = usePollStore((state) => state.polls);
  const addPoll = usePollStore((state) => state.addPoll);
  const generatePoll = usePollStore((state) => state.generatePoll);
  const removePoll = usePollStore((state) => state.removePoll);
  const navigate = useNavigate();

  useEffect(() => {
    if (polls.length === 0) {
      for (let i = 0; i < 5; i++) {
        const newPoll = generatePoll();
        addPoll(newPoll);
      }
    }
  }, [polls.length, addPoll, generatePoll]);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
        <span className="inline-flex items-center space-x-2">
          <ListIcon className="h-8 w-8 text-blue-600" />
          <span>Your Polls</span>
        </span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {polls.map((poll) => (
          <Card
            key={poll.id}
            className="transition-transform transform  hover:shadow-xl p-4 bg-white rounded-lg shadow-md"
            onDoubleClick={() =>
              navigate({ to: "/$poll", params: { poll: poll.id } })
            }
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {poll.question}
            </h2>
            <p className="mt-2 text-gray-600 space-y-2">{poll.description}</p>
            <p className="mt-2 text-sm text-gray-500">State: {poll.state}</p>

            <Link
              to="/$poll"
              params={{ poll: poll.id }}
              className="mt-3 inline-block text-blue-600 hover:text-blue-800 font-medium"
            >
              <EditIcon className="w-5 h-5" />
            </Link>
            <button
              onClick={() => removePoll(poll.id)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
