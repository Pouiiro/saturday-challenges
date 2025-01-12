import { usePollStore } from "@/stores/poll";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/$poll/result")({
  component: ResultComponent,
});

function ResultComponent() {
  const { poll: id } = Route.useParams();
  const getPoll = usePollStore((state) => state.getPoll);
  const poll = getPoll(id);

  const totalVotes = poll.options.reduce(
    (sum, option) => sum + option.votes,
    0,
  );

  return (
    <div className="p-5 flex justify-center items-center min-h-screen ">
      <div className="w-96 max-w-2xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Poll Results
        </h1>
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {poll.question}
          </h2>
          <p className="text-gray-600 mt-1">{poll.description}</p>
        </div>
        <div className="space-y-4">
          {poll.options.map((option, index) => {
            const percentage = totalVotes
              ? Math.round((option.votes / totalVotes) * 100)
              : 0;

            return (
              <div key={index}>
                <div className="flex justify-between text-gray-700 mb-1">
                  <span className="font-medium">{option.label}</span>
                  <span>{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {option.votes} {option.votes === 1 ? "vote" : "votes"}
                </p>
              </div>
            );
          })}
        </div>
        <p className="text-center text-gray-600 mt-6">
          Total Votes: <span className="font-semibold">{totalVotes}</span>
        </p>
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Back to Poll
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultComponent;
