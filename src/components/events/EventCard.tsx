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

export interface EventCardProps {
  eventName: string;
  description: string;
  location: string;
  date: string;
  tags: string[];
  timeAgo?: string;
  isPublic?: boolean;
  creator?: string;
}

export default function EventCard({
  eventName = "test event",
  description = "test test test test test",
  location = "kathmandu",
  date = "Fri, Aug 21, 2026 • 5:30 PM",
  tags = ["test", "new"],
  timeAgo = "2 days ago",
  isPublic = true,
  creator = "You",
}: EventCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <Card className="bg-card w-full max-w-sm overflow-hidden rounded-xl border border-gray-300 p-0 shadow-xl">
        <div className="relative flex h-48 w-full items-center justify-center bg-gradient-to-br from-[#2f8bf8] to-[#1e5eb0]">
          {isPublic && (
            <Badge
              variant="secondary"
              className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full border-none bg-white px-2.5 py-1 text-xs font-semibold text-[#1e8b4e] shadow-sm hover:bg-gray-50"
            >
              <Globe className="h-3.5 w-3.5" />
              Public
            </Badge>
          )}

          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="text-muted-foreground h-8 w-8 rounded-full bg-white shadow-sm hover:bg-gray-50"
              onClick={() => setIsEditOpen(true)}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit event</span>
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="text-muted-foreground h-8 w-8 rounded-full bg-white shadow-sm hover:bg-gray-50"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete event</span>
            </Button>
          </div>

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
          <p className="text-muted-foreground mb-4 text-sm">{description}</p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-secondary/60 hover:bg-secondary/80 text-secondary-foreground rounded-full border-none px-3 py-1 text-xs font-medium shadow-none"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-card text-muted-foreground flex items-center justify-between border-t-gray-200 p-4">
          <div className="text-muted-foreground/80 text-xs font-medium">
            {date}
          </div>

          <div className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-blue-500 hover:underline">
            <Users className="h-4 w-4" />
            <span>{creator}</span>
          </div>
        </CardFooter>
      </Card>
      <EditEventModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        eventData={{ eventName, description, location, date, tags, isPublic }}
      />
    </>
  );
}
