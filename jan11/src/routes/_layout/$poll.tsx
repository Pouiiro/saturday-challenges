import { usePollStore } from "@/stores/poll";
import {
  createFileRoute,
  Outlet,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export const Route = createFileRoute("/_layout/$poll")({
  component: RouteComponent,
});

const pollSchema = z.object({
  question: z.string().min(6, "Question must be at least 5 characters long"),
  description: z
    .string()
    .min(11, "Description must be at least 10 characters long"),
  options: z
    .array(
      z.object({
        label: z.string(),
        votes: z.number().nullable().optional(),
      }),
    )
    .min(2, "At least two options are required"),
  allowMultiple: z.boolean(),
});

type FormValues = z.infer<typeof pollSchema>;

function RouteComponent() {
  const { poll: id } = Route.useParams();
  const getPoll = usePollStore((state) => state.getPoll);
  const poll = getPoll(id);
  const updatePoll = usePollStore((state) => state.updatePoll);
  const publishPoll = usePollStore((state) => state.publishPoll);
  const unpublishPoll = usePollStore((state) => state.archivePoll);
  const markAsDone = usePollStore((state) => state.markPollAsDone);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const form = useForm<FormValues>({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      question: poll.question,
      description: poll.description,
      options: poll.options,
      allowMultiple: poll.allowMultiple,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid, isSubmitting },
    control,
  } = form;

  const { fields, append, remove } = useFieldArray<FormValues>({
    name: "options",
    control,
  });

  const onSubmit = (data: FormValues) => {
    updatePoll(id, {
      ...data,
      options: data.options.map((option) => ({
        ...option,
        votes: option.votes || 0,
      })),
    });
    setIsEditing(false);
  };

  const handlePublish = () => {
    if (poll.state === "unpublished") {
      publishPoll(id);
      navigate({ to: "/polls" });
    }
  };

  const handleUnpublish = () => {
    if (poll.state === "pending") {
      unpublishPoll(id);
      navigate({ to: "/polls" });
    }
  };

  const handleDone = () => {
    markAsDone(id);
    navigate({ to: "/polls" });
  };

  return (
    <div className="p-5 flex justify-center items-center min-h-screen">
      {pathname.includes("result") ? (
        <Outlet />
      ) : (
        <div className="w-full max-w-xl bg-white shadow-lg p-6 rounded-lg">
          {!isEditing ? (
            <div>
              <h3 className="text-3xl font-semibold">{poll.question}</h3>
              <p className="mt-1 text-gray-700">{poll.description}</p>
              <ul className="mt-3 space-y-2 mb-3">
                {poll.options.map((option, index) => (
                  <li key={index} className="text-gray-599">
                    [{index + 1}]- {option.label}
                  </li>
                ))}
              </ul>
              <p className="mt-1 text-sm text-gray-500">State: {poll.state}</p>
              <div className="mt-3 flex space-x-4">
                <Button onClick={() => navigate({ to: "/polls" })}>
                  Go back
                </Button>
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Edit
                </Button>
                {poll.state === "unpublished" && (
                  <Button
                    onClick={handlePublish}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    Publish
                  </Button>
                )}
                {poll.state === "pending" ||
                  (poll.state === "finished" && (
                    <Button
                      onClick={handleUnpublish}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Unpublish
                    </Button>
                  ))}
                {poll.state !== "finished" && (
                  <Button
                    onClick={handleDone}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    Mark as done
                  </Button>
                )}
                <Button
                  onClick={() =>
                    navigate({ to: "/$poll/result", params: { poll: id } })
                  }
                  className="bg-orange-600 text-white hover:bg-orange-700"
                >
                  View result
                </Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label
                    htmlFor="question"
                    className="block text-lg font-medium"
                  >
                    Question
                  </label>
                  <Input
                    id="question"
                    {...register("question")}
                    placeholder="Enter your poll question"
                    className="mt-1"
                  />
                  {errors.question && (
                    <p className="text-red-500 text-sm">
                      {errors.question.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-lg font-medium"
                  >
                    Description
                  </label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Describe your poll"
                    className="mt-1"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-lg font-medium">Options</label>
                  <div className="space-y-1">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-center space-x-1"
                      >
                        <Input
                          {...register(`options.${index}.label`)}
                          defaultValue={field.label}
                          placeholder={`Option ${index + 2}`}
                          className="mt-1"
                        />
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                  {errors.options && (
                    <p className="text-red-500 text-sm">
                      {errors.options.message}
                    </p>
                  )}
                  <Button
                    type="button"
                    onClick={() => append({ label: "", votes: 0 })}
                    className="mt-3 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Add New Option
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="allowMultiple"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allow Multiple Selections: </FormLabel>
                        <FormControl>
                          <Checkbox {...field} value={field.value.toString()} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-3 flex space-x-4">
                  <Button
                    type="submit"
                    disabled={!isValid || isSubmitting || !isDirty}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="bg-gray-600 text-white hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      )}
    </div>
  );
}

export default RouteComponent;
