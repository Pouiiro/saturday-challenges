import { Checkbox } from "@/components/ui/checkbox";
import { Poll, usePollStore } from "@/stores/poll";
import { Button } from "@/components/ui/button";

type Props = {
  poll: Poll;
};

export const PollComponent = ({ poll }: Props) => {
  const removePoll = usePollStore((selector) => selector.removePoll);

  return (
    <div className="flex flex-col items-center justify-center gap-5 w-96 h-96 rounded border-solid border-violet-700 border-2">
      <h1>{poll.question}</h1>
      <div>
        <ul>
          {poll.options.map((option) => {
            return (
              <li key={option}>
                <Checkbox id={option} value={option} />
                <label
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor={option}
                >
                  {" " + option}
                </label>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <Button onClick={() => removePoll(poll.id)}>Remove</Button>
      </div>
    </div>
  );
};
