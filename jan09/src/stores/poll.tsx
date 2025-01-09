import { create } from "zustand";
import { v7 as uuidv7 } from "uuid";

export type Poll = {
  id: string;
  question: string;
  options: Array<string>;
  state: "finished" | "pending" | "unpublished";
};

type PollStore = {
  polls: Array<Poll>;
  getPoll: (id: string) => Poll;
  addPoll: (poll: Poll) => void;
  updatePoll: (id: string, data: Partial<Poll>) => void;
  removePoll: (id: string) => void;
  markPollAsDone: (id: string) => void;
  publishPoll: (id: string) => void;
  generatePoll: () => Poll;
};

export const usePollStore = create<PollStore>((set, get) => ({
  polls: [],
  generatePoll: () => ({
    state: "unpublished",
    question: "Woof or Meow?",
    options: ["Woof", "Meow", "Neither"],
    id: uuidv7(),
  }),
  getPoll: (id) => {
    const poll = get().polls.find((poll) => poll.id === id);
    if (!poll) {
      throw new Error(`Poll with id: ${id}: was not found`);
    }

    return poll;
  },
  addPoll: (poll) => set((prev) => ({ ...prev, polls: [...prev.polls, poll] })),
  updatePoll: (id, data) => {
    const currentPoll = get().polls.find((poll) => id === poll.id);
    if (!currentPoll) throw new Error(`Poll with id: ${id}, was not found!`);
    const updatedPoll = { ...currentPoll, ...data };
    set((prev) => ({
      ...prev,
      polls: prev.polls.map((poll) => (poll.id === id ? updatedPoll : poll)),
    }));
  },
  removePoll: (id) =>
    set((prev) => ({
      ...prev,
      polls: prev.polls.filter((poll) => poll.id !== id),
    })),
  markPollAsDone: (id) =>
    set((prev) => ({
      ...prev,
      polls: prev.polls.map((poll) =>
        poll.id === id ? { ...poll, state: "finished" } : poll,
      ),
    })),
  publishPoll: (id) =>
    set((prev) => ({
      ...prev,
      polls: prev.polls.map((poll) =>
        poll.id === id ? { ...poll, state: "pending" } : poll,
      ),
    })),
}));
