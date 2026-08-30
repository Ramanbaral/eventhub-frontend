import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
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
import EventError from "@/components/events/EventError";
import EventGrid from "@/components/events/EventGrid";
import { useAuth } from "@/context/AuthContext";
import { buildFilterParams } from "@/lib/build-filter-params";
import type {
  PaginatedResponse,
  PaginationMeta,
} from "@/types/pagination.type";
import type { EventFilterParams } from "@/types/event-filter.type";

export const Route = createFileRoute("/my-events")({
  component: MyEventsPage,
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

function MyEventsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [visibility, setVisibility] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [showFilters, setShowFilters] = useState(true);

  const handleSearch = () => {
    setActiveSearch(searchQuery);
    setPage(1);
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login" });
    }
  }, [authLoading, user, navigate]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [visibility, selectedTags, dateFrom, dateTo]);

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      setError(null);
      try {
        const filters: EventFilterParams = {
          search: activeSearch || undefined,
          event_type:
            visibility === "all"
              ? undefined
              : (visibility as "public" | "private"),
          tags: selectedTags.length > 0 ? selectedTags : undefined,
          date_from: dateFrom,
          date_to: dateTo,
        };
        const filterParams = buildFilterParams(filters);
        filterParams.append("page", String(page));
        filterParams.append("limit", "6");

        const res = await axios.get<PaginatedResponse<any>>(
          `${import.meta.env.VITE_BACKEND_URL}/events/user/${user.id}?${filterParams.toString()}`,
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
          startsAt: format(
            new Date(evt.event_start_date),
            "yyyy-MM-dd'T'HH:mm"
          ),
          endsAt: format(new Date(evt.event_end_date), "yyyy-MM-dd'T'HH:mm"),
          location: evt.location,
          isPublic: evt.event_type === "public",
          tags: evt.tags || [],
          timeAgo: formatDistanceToNow(new Date(evt.created_at), {
            addSuffix: true,
          }),
          creator: user?.name || "You",
          created_by: evt.created_by,
        }));
        setEvents(mappedEvents);
        setPagination(res.data.pagination);
      } catch (err) {
        console.error(err);
        const message =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Failed to load events. Please try again.";
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyEvents();
  }, [
    page,
    user?.id,
    visibility,
    selectedTags,
    dateFrom,
    dateTo,
    activeSearch,
  ]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto max-w-6xl space-y-8 p-4 font-sans md:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            My Events
          </h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Events you have created or registered for
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
        {showFilters && (
          <FilterBox
            visibility={visibility}
            setVisibility={setVisibility}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
          />
        )}
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <EventError message={error} />
      ) : events.length === 0 ? (
        <EmptyState
          title="No events found"
          description="You haven't created or joined any events yet."
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
