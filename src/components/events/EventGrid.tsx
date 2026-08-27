import EventCard from "./EventCard";
import type { EventCardProps } from "./EventCard";

function EventGrid({ events }: { events: EventCardProps[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((evt) => (
        <EventCard key={evt.id} {...evt} />
      ))}
    </div>
  );
}

export default EventGrid;
