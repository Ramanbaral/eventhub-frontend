import { zodResolver } from "@hookform/resolvers/zod";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Globe,
  Lock,
  MapPin,
  Plus,
  Tag,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";

import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const eventSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Event title is required.")
      .max(150, "Title cannot exceed 150 characters"),
    description: z.string().min(1, "Event description is required."),
    location: z
      .string()
      .min(1, "Event location is required.")
      .max(255, "Location cannot exceed 255 characters"),
    startsAt: z.string().min(1, "Start date and time is required."),
    endsAt: z.string().min(1, "End date and time is required."),
    visibility: z.enum(["private", "public"]).default("private"),
    tags: z.array(z.string()),
  })
  .refine((data) => new Date(data.endsAt) >= new Date(data.startsAt), {
    message: "Event end date cannot be earlier than the start date",
    path: ["endsAt"],
  });

type EventFormValues = z.input<typeof eventSchema>;
type EventValues = z.output<typeof eventSchema>;

export const Route = createFileRoute("/event/create")({
  component: CreateEvent,
});

function CreateEvent() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login" });
    }
  }, [authLoading, user, navigate]);

  const [tagInput, setTagInput] = useState("");
  const form = useForm<EventFormValues, unknown, EventValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      startsAt: "",
      endsAt: "",
      visibility: "private",
      tags: [],
    },
  });

  function addTag() {
    const tag = tagInput.trim();
    if (!tag || form.getValues("tags").includes(tag)) return;
    form.setValue("tags", [...form.getValues("tags"), tag], {
      shouldDirty: true,
    });
    setTagInput("");
  }

  async function onSubmit(values: EventValues) {
    try {
      const payload = {
        title: values.title,
        description: values.description,
        location: values.location,
        event_start_date: values.startsAt,
        event_end_date: values.endsAt,
        event_type: values.visibility,
        tags: values.tags,
      };

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/events`, payload, {
        withCredentials: true,
      });

      toast.success("Event created successfully!");
      form.reset();
      window.dispatchEvent(new Event("event-updated"));
      navigate({ to: "/" });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Failed to create event.");
      } else {
        toast.error("An unexpected error occurred.");
      }
      console.error("Event creation error:", error);
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-4 text-slate-950 md:px-8 md:py-8">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-950"
        >
          <ArrowLeft className="size-4" />
          Back to Events
        </Link>

        <header className="mb-4 flex items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Create New Event
            </h1>
            <p className="mt-2 text-slate-500">
              Fill in the details below to create and share your event.
            </p>
          </div>
        </header>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="p-6">
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
                noValidate
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Event Title <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Summer Music Festival"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <textarea
                          className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 min-h-28 w-full resize-y rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-3"
                          placeholder="Tell people what to expect..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                          <Input
                            className="pl-10"
                            placeholder="e.g. Kathmandu, Nepal"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="startsAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Starts At <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2" />
                            <DatePicker
                              selected={
                                field.value
                                  ? parse(
                                      field.value,
                                      "yyyy-MM-dd'T'HH:mm",
                                      new Date()
                                    )
                                  : null
                              }
                              onChange={(date: Date | null) => {
                                field.onChange(
                                  date ? format(date, "yyyy-MM-dd'T'HH:mm") : ""
                                );
                              }}
                              showTimeSelect
                              timeFormat="h:mm aa"
                              timeIntervals={15}
                              dateFormat="MMM d, yyyy h:mm aa"
                              placeholderText="Select start date & time"
                              className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent py-1 pr-3 pl-10 text-sm outline-none focus-visible:ring-3"
                              wrapperClassName="w-full"
                              autoComplete="off"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endsAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Ends At <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Calendar className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2" />
                            <DatePicker
                              selected={
                                field.value
                                  ? parse(
                                      field.value,
                                      "yyyy-MM-dd'T'HH:mm",
                                      new Date()
                                    )
                                  : null
                              }
                              onChange={(date: Date | null) => {
                                field.onChange(
                                  date ? format(date, "yyyy-MM-dd'T'HH:mm") : ""
                                );
                              }}
                              showTimeSelect
                              timeFormat="h:mm aa"
                              timeIntervals={15}
                              dateFormat="MMM d, yyyy h:mm aa"
                              placeholderText="Select end date & time"
                              className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border bg-transparent py-1 pr-3 pl-10 text-sm outline-none focus-visible:ring-3"
                              wrapperClassName="w-full"
                              autoComplete="off"
                              minDate={
                                form.getValues("startsAt")
                                  ? parse(
                                      form.getValues("startsAt"),
                                      "yyyy-MM-dd'T'HH:mm",
                                      new Date()
                                    )
                                  : undefined
                              }
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="visibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visibility</FormLabel>
                      <FormControl>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {(
                            [
                              ["private", Lock, "Private"],
                              ["public", Globe, "Public"],
                            ] as const
                          ).map(([value, Icon, title]) => (
                            <label
                              key={value}
                              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${field.value === value ? "border-blue-500 bg-blue-50/50" : "border-slate-200 hover:bg-slate-50"}`}
                            >
                              <input
                                className="sr-only"
                                type="radio"
                                value={value}
                                checked={field.value === value}
                                onChange={() => field.onChange(value)}
                              />
                              <Icon
                                className={`size-5 ${field.value === value ? "text-blue-600" : "text-slate-500"}`}
                              />
                              <span>
                                <span className="block font-medium">
                                  {title}
                                </span>
                              </span>
                            </label>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          {field.value.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {field.value.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="bg-slate-100 text-slate-700"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Tag className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                              <Input
                                className="pl-10"
                                placeholder="Add a new tag..."
                                value={tagInput}
                                onChange={(event) =>
                                  setTagInput(event.target.value)
                                }
                                onKeyDown={(event) => {
                                  if (event.key === "Enter") {
                                    event.preventDefault();
                                    addTag();
                                  }
                                }}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={addTag}
                            >
                              <Plus /> Add
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CardFooter className="border-t/75 bg-background -mx-6 -mb-6 grid grid-cols-1 gap-3 px-6 py-4 sm:grid-cols-2">
                  <Link to="/" className="w-full">
                    <Button
                      type="button"
                      variant="destructive"
                      className="min-h-12 w-full rounded-lg p-4 text-base"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="flex min-h-12 w-full items-center justify-center rounded-lg p-4 text-base"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Event"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
