import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useRouter, useParams } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Image as ImageIcon,
  Calendar as CalendarIcon,
  Clock,
  Lock,
  Globe,
  Tag,
  Plus,
  X,
} from "lucide-react";

const eventSchema = z
  .object({
    title: z
      .string()
      .min(1, "Event Title is required")
      .max(150, "Title cannot exceed 150 characters"),
    description: z.string().min(1, "Description is required"),
    location: z
      .string()
      .min(1, "Location is required")
      .max(255, "Location cannot exceed 255 characters"),
    startsAt: z.string().min(1, "Start time is required"),
    endsAt: z.string().min(1, "End time is required"),
    visibility: z.enum(["private", "public"]),
    tags: z.array(z.string()),
  })
  .refine(
    (data) => {
      if (data.startsAt && data.endsAt) {
        return new Date(data.endsAt) >= new Date(data.startsAt);
      }
      return true;
    },
    {
      message: "Event end date cannot be earlier than the start date",
      path: ["endsAt"],
    }
  );

type EventFormValues = z.infer<typeof eventSchema>;

export default function EditEventModal({ open, onOpenChange, eventData }: any) {
  const router = useRouter();
  const params = useParams({ strict: false });
  const eventId = params.eventId || eventData?.eventId;

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: eventData?.eventName || "",
      description: eventData?.description || "",
      location: eventData?.location || "",
      startsAt: eventData?.startsAt || "",
      endsAt: eventData?.endsAt || "",
      visibility: eventData?.isPublic ? "public" : "private",
      tags: eventData?.tags || [],
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;
  const visibility = watch("visibility");
  const tags = watch("tags");

  const [tagInput, setTagInput] = useState("");

  const onSubmit = async (data: EventFormValues) => {
    try {
      const initialTags = eventData?.tags || [];
      const currentTags = data.tags;

      const add_tags = currentTags.filter(
        (tag: string) => !initialTags.includes(tag)
      );
      const remove_tags = initialTags.filter(
        (tag: string) => !currentTags.includes(tag)
      );

      const payload: any = {
        title: data.title,
        description: data.description,
        location: data.location,
        event_start_date: data.startsAt,
        event_end_date: data.endsAt,
        event_type: data.visibility,
      };

      if (add_tags.length > 0) payload.add_tags = add_tags;
      if (remove_tags.length > 0) payload.remove_tags = remove_tags;

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/events/${eventId}`,
        payload,
        {
          withCredentials: true,
        }
      );

      toast.success("Event updated successfully!");
      onOpenChange(false);
      router.invalidate();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update event");
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue("tags", [...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove)
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[90vw] gap-0 overflow-hidden rounded-2xl p-0 font-sans sm:max-w-[800px]">
        <DialogHeader className="relative z-10 border-b border-slate-100 bg-white p-6 pb-4">
          <DialogTitle className="text-xl font-bold">Edit Event</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-160px)] w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
            {/* Event Title */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Event Title <span className="text-red-500">*</span>
              </Label>
              <Input
                {...form.register("title")}
                placeholder="test event"
                className="h-11 rounded-xl border-slate-200 shadow-sm"
              />
              {errors.title && (
                <p className="text-xs text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Description
              </Label>
              <Textarea
                {...form.register("description")}
                placeholder="test test test test test"
                className="min-h-[100px] resize-none rounded-xl border-slate-200 shadow-sm"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Location
              </Label>
              <div className="relative">
                <MapPin className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  {...form.register("location")}
                  placeholder="kathmandu"
                  className="h-11 rounded-xl border-slate-200 pl-10 shadow-sm"
                />
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Starts At <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <CalendarIcon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="datetime-local"
                    {...form.register("startsAt")}
                    className="h-11 rounded-xl border-slate-200 pl-10 shadow-sm"
                  />
                </div>
                {errors.startsAt && (
                  <p className="text-xs text-red-500">
                    {errors.startsAt.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  Ends At
                </Label>
                <div className="relative">
                  <Clock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="datetime-local"
                    {...form.register("endsAt")}
                    className="h-11 rounded-xl border-slate-200 pl-10 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Visibility */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700">
                Visibility
              </Label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div
                  className={`cursor-pointer rounded-xl border-[1.5px] p-4 transition-all ${
                    visibility === "private"
                      ? "border-[#1a73e8] bg-blue-50/30 shadow-sm"
                      : "border-slate-200 shadow-sm hover:border-slate-300"
                  }`}
                  onClick={() => setValue("visibility", "private")}
                >
                  <div className="flex gap-3">
                    <Lock
                      className={`mt-0.5 h-5 w-5 ${
                        visibility === "private"
                          ? "text-slate-900"
                          : "text-slate-400"
                      }`}
                    />
                    <div>
                      <div
                        className={`font-semibold ${
                          visibility === "private"
                            ? "text-slate-900"
                            : "text-slate-700"
                        }`}
                      >
                        Private
                      </div>
                      <div className="text-sm text-slate-500">
                        Only you can see it
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`cursor-pointer rounded-xl border-[1.5px] p-4 transition-all ${
                    visibility === "public"
                      ? "border-[#1a73e8] bg-blue-50/30 shadow-sm"
                      : "border-slate-200 shadow-sm hover:border-slate-300"
                  }`}
                  onClick={() => setValue("visibility", "public")}
                >
                  <div className="flex gap-3">
                    <Globe
                      className={`mt-0.5 h-5 w-5 ${
                        visibility === "public"
                          ? "text-[#1a73e8]"
                          : "text-slate-400"
                      }`}
                    />
                    <div>
                      <div
                        className={`font-semibold ${
                          visibility === "public"
                            ? "text-slate-900"
                            : "text-slate-700"
                        }`}
                      >
                        Public
                      </div>
                      <div className="text-sm text-slate-500">
                        Visible to everyone
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700">Tags</Label>

              {tags.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="gap-1.5 rounded-full border-none bg-[#1a73e8] px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      <Tag className="h-3 w-3 opacity-80" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-white/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Tag className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    placeholder="Add a new tag..."
                    className="h-11 rounded-xl border-slate-200 pl-10 shadow-sm"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTag}
                  className="h-11 rounded-xl border-slate-200 px-6 font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  <Plus className="mr-2 h-4 w-4 text-slate-500" />
                  Add
                </Button>
              </div>
              <div className="text-xs text-slate-400">
                {tags.length} tags selected
              </div>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="relative z-10 flex w-full flex-col gap-3 border-t border-slate-100 bg-white p-6 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11 w-full rounded-xl border-slate-200 font-medium shadow-sm sm:w-1/2"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="h-11 w-full rounded-xl bg-[#1a73e8] font-medium text-white shadow-sm hover:bg-blue-700 sm:w-1/2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
