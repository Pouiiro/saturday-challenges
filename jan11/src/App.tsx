import { useState } from "react";
import { PollComponent } from "@/components/poll";
import { usePollStore } from "@/stores/poll";
import { PollModal } from "@/components/pollModal";
import { Button } from "@/components/ui/button";

function App() {
  const polls = usePollStore((selector) => selector.polls);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-screen h-screen">
      <div className="p-10 flex justify-center items-center gap-5">
        <Button onClick={() => setIsOpen(true)}>Open poll modal</Button>
      </div>

      <div className="flex justify-center items-center h-1/2">
        {polls.map((poll) => {
          return <PollComponent key={poll.id} poll={poll} />;
        })}
      </div>

      {isOpen ? <PollModal operation="add" setIsOpen={setIsOpen} /> : null}
    </div>
  );
}

export default App;
