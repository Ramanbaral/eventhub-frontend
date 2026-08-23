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
import { createFileRoute, Link } from "@tanstack/react-router";

export interface EventDetailPageProps {
  // Hero Data
  title?: string;
  timeAgo?: string;
  isPublic?: boolean;

  // Date & Time Data
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;

  // Content Data
  description?: string;
  location?: string;
  tags?: string[];

  // User/Context Data
  isCreator?: boolean;

  // Actions
  onBack?: () => void;
  onShare?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const Route = createFileRoute("/event/$eventId")({
  component: EventDetailPage,
});

export default function EventDetailPage({
  title = "test event",
  timeAgo = "2 days ago",
  isPublic = true,
  startDate = "Fri, Aug 21, 2026",
  startTime = "Starts at 5:30 PM",
  endDate = "Fri, Aug 21, 2026",
  endTime = "Ends at 8:30 PM",
  description = "test test test test test",
  location = "kathmandu",
  tags = ["test", "new"],
  isCreator = true,
  onBack,
  onShare,
  onEdit,
  onDelete,
}: EventDetailPageProps) {
  const { eventId } = Route.useParams();

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
              {title}
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
            <Button
              variant="outline"
              className="border-border/10 rounded-full px-5 shadow-sm"
              onClick={onEdit}
            >
              <Pencil className="mr-2 h-4 w-4 text-slate-500" />
              Edit
            </Button>
            {/* TODO: Add a Add to Calendar button here  */}
            <Button
              variant="outline"
              className="rounded-full border-red-200 px-5 text-red-600 shadow-sm hover:bg-red-50 hover:text-red-700"
              onClick={onDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
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
                  {description}
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
                    {location}
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
    </div>
  );
}
