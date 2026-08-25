import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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

export const Route = createFileRoute("/my-events")({
  component: MyEventsPage,
});

// MOCK DATA for EventGrid
const mockEvents = [
  {
    id: 1,
    eventName: "My Team Planning Session",
    description:
      "A strategic planning session with the core team to discuss Q4 goals.",
    date: "Oct 15, 2026",
    location: "Virtual",
    visibility: "Private",
  },
];

function MyEventsPage() {
  const [events, setEvents] = useState(mockEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibility, setVisibility] = useState("all");
  const [showFilters, setShowFilters] = useState(true);

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
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />
        {showFilters && (
          <FilterBox visibility={visibility} setVisibility={setVisibility} />
        )}
      </div>

      {/* Content Area */}
      {events.length === 0 ? (
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
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive
                  className="bg-[#1a73e8] text-white hover:bg-[#1a73e8]/90 hover:text-white"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
