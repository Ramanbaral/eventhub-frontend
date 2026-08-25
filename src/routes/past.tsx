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

export const Route = createFileRoute("/past")({
  component: PastEventsPage,
});

// MOCK DATA for EventGrid
const mockEvents = [
  {
    id: 1,
    eventName: "Annual Tech Conference 2023",
    description:
      "Join us for the biggest tech conference of the year featuring keynotes from industry leaders.",
    date: "Aug 28, 2023",
    location: "San Francisco, CA",
    visibility: "Public",
  },
  // {
  //   id: 2,
  //   title: 'Internal Team Offsite',
  //   description: 'Quarterly planning and team building activities.',
  //   date: 'Sep 05, 2023',
  //   location: 'Lake Tahoe, NV',
  //   visibility: 'Private',
  // },
  // {
  //   id: 3,
  //   title: 'Product Launch Party',
  //   description: 'Celebrating the launch of our new flagship product with partners and early adopters.',
  //   date: 'Sep 12, 2023',
  //   location: 'New York, NY',
  //   visibility: 'Public',
  // }
];

function PastEventsPage() {
  const [events, setEvents] = useState(mockEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibility, setVisibility] = useState("all");
  const [showFilters, setShowFilters] = useState(true);

  return (
    <div className="container mx-auto max-w-6xl space-y-8 p-4 font-sans md:p-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Past Events
          </h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Events that have already taken place
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
          title="No past events"
          description="There are no past events matching your filters."
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
