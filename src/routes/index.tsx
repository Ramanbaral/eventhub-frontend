import EventCard from "@/components/events/EventCard";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <EventCard
        eventName="Test Event"
        description="This is a test event."
        location="Kathmandu"
        date="Fri, Aug 21, 2026 • 5:30 PM"
        tags={["test", "event"]}
      />
    </div>
  );
}
