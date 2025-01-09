import { Dispatch, SetStateAction, useMemo } from "react";
import { usePollStore } from "@/stores/poll";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
} & (
  | {
      operation: "edit";
      id: string;
    }
  | { operation: "add"; id?: never }
);

export const PollModal = ({ operation, id, setIsOpen }: Props) => {
  const getPoll = usePollStore((selector) => selector.getPoll);
  const generatePoll = usePollStore((selector) => selector.generatePoll);
  const addPoll = usePollStore((selector) => selector.addPoll);

  const initialPollValues = useMemo(() => {
    if (operation === "edit") return getPoll(id);
    return generatePoll();
  }, [operation, getPoll]);

  return (
    <Dialog open onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Operation: {operation}</DialogTitle>
          <pre>
            <DialogDescription>
              {JSON.stringify(initialPollValues, null, 2)}
            </DialogDescription>
          </pre>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={() => {
              addPoll(initialPollValues);
              setIsOpen(false);
            }}
          >
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
