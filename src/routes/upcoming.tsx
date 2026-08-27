import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import { format, formatDistanceToNow } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import SearchBar from "@/components/events/SearchBar";
import FilterBox from "@/components/events/EventFilter";
import EmptyState from "@/components/events/EmptyState";
import EventGrid from "@/components/events/EventGrid";
import type {
  PaginatedResponse,
  PaginationMeta,
} from "@/types/pagination.type";

export const Route = createFileRoute("/upcoming")({
  component: UpcomingEventsPage,
});

function EventCardSkeleton() {
  return (
    <div className="bg-card w-full max-w-sm animate-pulse overflow-hidden rounded-xl border border-gray-300 p-0 shadow-xl">
      <div className="h-48 w-full bg-gray-200"></div>
      <div className="space-y-4 p-4 pb-2">
        <div className="h-4 w-1/3 rounded bg-gray-200"></div>
        <div className="h-6 w-3/4 rounded bg-gray-200"></div>
        <div className="h-4 w-1/2 rounded bg-gray-200"></div>
        <div className="h-10 w-full rounded bg-gray-200"></div>
      </div>
      <div className="flex justify-between border-t border-gray-200 p-4">
        <div className="h-4 w-1/3 rounded bg-gray-200"></div>
        <div className="h-4 w-1/4 rounded bg-gray-200"></div>
      </div>
    </div>
  );
}

function UpcomingEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [visibility, setVisibility] = useState("all");
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get<PaginatedResponse<any>>(
          `${import.meta.env.VITE_BACKEND_URL}/events/upcoming?page=${page}&limit=6`,
          {
            withCredentials: true,
          }
        );
        const mappedEvents = res.data.data.map((evt: any) => ({
          id: evt.id,
          eventName: evt.title,
          description: evt.description,
          date: format(
            new Date(evt.event_start_date),
            "EEE, MMM d, yyyy • h:mm a"
          ),
          location: evt.location,
          isPublic: evt.event_type === "public",
          tags: evt.tags || [],
          timeAgo: formatDistanceToNow(new Date(evt.created_at), {
            addSuffix: true,
          }),
          creator: "User",
        }));
        setEvents(mappedEvents);
        setPagination(res.data.pagination);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUpcomingEvents();
  }, [page]);

  return (
    <div className="container mx-auto max-w-6xl space-y-8 p-4 font-sans md:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Upcoming Events
          </h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Events happening soon — don't miss out
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
        {showFilters && (
          <FilterBox visibility={visibility} setVisibility={setVisibility} />
        )}
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          title="No upcoming events"
          description="There are no upcoming events matching your filters."
        />
      ) : (
        <div className="space-y-8">
          <EventGrid events={events} />

          <Pagination className="justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination?.hasPreviousPage) setPage((p) => p - 1);
                  }}
                  className={
                    !pagination?.hasPreviousPage
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: pagination?.totalPages || 1 }).map(
                (_, idx) => (
                  <PaginationItem key={idx}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(idx + 1);
                      }}
                      isActive={page === idx + 1}
                      className={
                        page === idx + 1
                          ? "bg-[#1a73e8] text-white hover:bg-[#1a73e8]/90 hover:text-white"
                          : ""
                      }
                    >
                      {idx + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination?.hasNextPage) setPage((p) => p + 1);
                  }}
                  className={
                    !pagination?.hasNextPage
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
