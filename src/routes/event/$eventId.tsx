import {
  ArrowLeft,
  Globe,
  Calendar,
  Clock,
  Share,
  Pencil,
  Trash2,
  User,
  MapPin,
  Tag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { format, formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import DeleteEventModal from "@/components/events/DeleteEventModal";
import EditEventModal from "@/components/events/EditEventModal";

export interface Event {
  id: number;
  title: string;
  description: string;
  event_start_date: string | Date;
  event_end_date: string | Date;
  location: string;
  event_type: "public" | "private";
  created_by: number;
  created_at: string | Date;
  updated_at: string | Date;
}

export const Route = createFileRoute("/event/$eventId")({
  component: EventDetailPage,
});

export default function EventDetailPage() {
  const { eventId } = Route.useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/events/${eventId}`,
          {
            withCredentials: true,
          }
        );
        setEvent(res.data);
      } catch (error: any) {
        if (error.response?.status === 404) {
          navigate({ to: "/404" as any });
        } else {
          console.error("Failed to fetch event:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    if (eventId) {
      fetchEvent();
    }
  }, [eventId, navigate]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const onBack = () => navigate({ to: "/" });
  const onShare = () => {
    /* implement share */
  };
  const onEdit = () => setIsEditModalOpen(true);
  const onDelete = () => setIsDeleteModalOpen(true);

  const onDeleteConfirm = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/events/${eventId}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Event deleted successfully");
      navigate({ to: "/" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete event");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen animate-pulse bg-[#f8fafc] p-4 font-sans text-slate-900 md:p-8 lg:px-12">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="h-10 w-32 rounded-md bg-slate-200/60"></div>
          <div className="h-[320px] w-full rounded-[2rem] bg-slate-200/60"></div>
          <div className="mt-4 h-12 w-full rounded-md bg-slate-200/60"></div>
          <div className="grid grid-cols-1 gap-6 pt-2 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <div className="h-48 rounded-2xl bg-slate-200/60"></div>
              <div className="h-48 rounded-2xl bg-slate-200/60"></div>
            </div>
            <div className="space-y-6">
              <div className="h-32 rounded-2xl bg-slate-200/60"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const isCreator = user?.id === String(event.created_by);
  const isPublic = event.event_type === "public";

  const timeAgo = formatDistanceToNow(new Date(event.created_at), {
    addSuffix: true,
  });
  const startDate = format(
    new Date(event.event_start_date),
    "EEE, MMM d, yyyy"
  );
  const startTime = `Starts at ${format(new Date(event.event_start_date), "h:mm a")}`;
  const endDate = format(new Date(event.event_end_date), "EEE, MMM d, yyyy");
  const endTime = `Ends at ${format(new Date(event.event_end_date), "h:mm a")}`;

  const tags: string[] = (event as any).tags || [];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 font-sans text-slate-900 md:p-8 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link to="/">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-2 -ml-4 text-slate-500 hover:bg-slate-200/50 hover:text-slate-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </Link>

        {/* Hero Banner */}
        <div className="relative flex h-[320px] w-full flex-col justify-between overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#2f8bf8] to-[#14488f] p-8 shadow-sm">
          {isPublic && (
            <Badge
              variant="secondary"
              className="flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-[#1e8b4e] hover:bg-slate-50"
            >
              <Globe className="h-4 w-4" />
              Public
            </Badge>
          )}

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Calendar className="h-32 w-32 stroke-[1] text-white/80" />
          </div>

          <div className="relative z-10 mt-auto text-white">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white/90">
              <Clock className="h-4 w-4" />
              {timeAgo}
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              {event.title}
            </h1>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 py-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-border/10 rounded-full px-5 shadow-sm"
              onClick={onShare}
            >
              <Share className="mr-2 h-4 w-4 text-slate-500" />
              Share
            </Button>
            {isCreator && (
              <>
                <Button
                  variant="outline"
                  className="border-border/10 rounded-full px-5 shadow-sm"
                  onClick={onEdit}
                >
                  <Pencil className="mr-2 h-4 w-4 text-slate-500" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-red-200 px-5 text-red-600 shadow-sm hover:bg-red-50 hover:text-red-700"
                  onClick={onDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </>
            )}
            {/* TODO: Add a Add to Calendar button here  */}
          </div>

          {isCreator && (
            <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
              <User className="h-4 w-4" />
              You created this event
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 pt-2 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="rounded-2xl border-slate-200/60 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                  <Calendar className="h-3.5 w-3.5" />
                  Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Start Date */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
                    <Calendar className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{startDate}</p>
                    <p className="text-sm text-slate-500">{startTime}</p>
                  </div>
                </div>
                {/* End Date */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-100">
                    <Clock className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{endDate}</p>
                    <p className="text-sm text-slate-500">{endTime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200/60 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                  <Tag className="h-3.5 w-3.5" />
                  About this event
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed whitespace-pre-wrap text-slate-700">
                  {event.description}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-2xl border-slate-200/60 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                  <MapPin className="h-3.5 w-3.5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-50">
                    <MapPin className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="font-medium text-slate-900 capitalize">
                    {event.location}
                  </p>
                </div>
              </CardContent>
            </Card>

            {tags && tags.length > 0 && (
              <Card className="rounded-2xl border-slate-200/60 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                    <Tag className="h-3.5 w-3.5" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 font-normal text-slate-600 hover:bg-slate-200"
                      >
                        <Tag className="h-3 w-3 text-slate-400" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <EditEventModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          eventData={{
            eventName: event.title,
            description: event.description,
            location: event.location,
            isPublic: event.event_type === "public",
            startsAt: format(
              new Date(event.event_start_date),
              "yyyy-MM-dd'T'HH:mm"
            ),
            endsAt: format(
              new Date(event.event_end_date),
              "yyyy-MM-dd'T'HH:mm"
            ),
            tags: (event as any).tags || [],
          }}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteEventModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          eventName={event.title}
          onConfirm={onDeleteConfirm}
        />
      )}
    </div>
  );
}
