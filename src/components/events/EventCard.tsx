import { useState } from "react";
import {
  Globe,
  Pencil,
  Trash2,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
} from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EditEventModal from "./EditEventModal";
import DeleteEventModal from "./DeleteEventModal";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

export interface EventCardProps {
  id?: number;
  eventName: string;
  description: string;
  location: string;
  date: string;
  tags: string[];
  timeAgo?: string;
  isPublic?: boolean;
  creator?: string;
  created_by?: number;
  startsAt?: string;
  endsAt?: string;
}

export default function EventCard({
  id = 1,
  eventName = "test event",
  description = "test test test test test",
  location = "kathmandu",
  date = "Fri, Aug 21, 2026 • 5:30 PM",
  tags = ["test", "new"],
  timeAgo = "2 days ago",
  isPublic = true,
  creator = "You",
  created_by,
  startsAt,
  endsAt,
}: EventCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const navigate = useNavigate();
  const router = useRouter();
  const { user } = useAuth();

  const isCreator = user?.id === String(created_by);

  const onDeleteConfirm = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/events/${id}`, {
        withCredentials: true,
      });
      toast.success("Event deleted successfully");
      router.invalidate();
      window.dispatchEvent(new Event("event-updated"));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete event");
    }
  };

  return (
    <>
      <Card
        className="bg-card w-full max-w-sm cursor-pointer overflow-hidden rounded-xl border border-gray-300 p-0 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl"
        onClick={() => navigate({ to: `/event/${id}` as any })}
      >
        <div className="relative flex h-48 w-full items-center justify-center bg-gradient-to-br from-[#2f8bf8] to-[#1e5eb0]">
          {isPublic ? (
            <Badge
              variant="secondary"
              className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full border-none bg-white px-2.5 py-1 text-xs font-semibold text-[#1e8b4e] shadow-sm hover:bg-gray-50"
            >
              <Globe className="h-3.5 w-3.5" />
              Public
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full border-none bg-white px-2.5 py-1 text-xs font-semibold text-[#1e8b4e] shadow-sm hover:bg-gray-50"
            >
              <Globe className="h-3.5 w-3.5" />
              Private
            </Badge>
          )}

          {isCreator && (
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <Button
                size="icon"
                variant="secondary"
                className="text-muted-foreground h-8 w-8 rounded-full bg-white shadow-sm hover:bg-gray-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit event</span>
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="text-muted-foreground h-8 w-8 rounded-full bg-white shadow-sm hover:bg-gray-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete event</span>
              </Button>
            </div>
          )}

          <CalendarIcon className="h-16 w-16 stroke-[1.5] text-white/70" />
        </div>

        <CardContent className="p-4 pb-2">
          {/* Time Ago */}
          <div className="mb-2 flex items-center gap-1.5 text-sm font-medium text-blue-500">
            <Clock className="h-4 w-4" />
            <span>{timeAgo}</span>
          </div>

          {/* Event Title */}
          <h2 className="text-foreground mb-2 text-xl leading-tight font-bold">
            {eventName}
          </h2>

          {/* Location */}
          <div className="text-muted-foreground mb-4 flex items-center gap-1.5 text-sm">
            <MapPin className="h-4 w-4" />
            <span className="capitalize">{location}</span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
            {description}
          </p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-secondary/60 text-secondary-foreground hover:bg-secondary/80 rounded-full border-none px-3 py-1 text-xs font-medium shadow-none"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="text-muted-foreground bg-card flex items-center justify-between border-t border-gray-200 p-4">
          <div className="text-muted-foreground/80 text-xs font-medium">
            {date}
          </div>

          <div className="flex items-center gap-1.5 text-sm font-medium text-blue-500 hover:underline">
            <Users className="h-4 w-4" />
            <span>{creator}</span>
          </div>
        </CardFooter>
      </Card>

      <EditEventModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        eventData={{
          eventId: id,
          eventName,
          description,
          location,
          date,
          tags,
          isPublic,
          startsAt,
          endsAt,
        }}
      />
      <DeleteEventModal
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        eventName={eventName}
        onConfirm={onDeleteConfirm}
      />
    </>
  );
}
