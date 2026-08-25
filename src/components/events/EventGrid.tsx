import { CalendarIcon, MapPin } from "lucide-react";
import { Card, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import EventCard from "./EventCard";

//use EventCard 
function EventGrid({ events }) {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((evt) => (
                <EventCard key={evt.id} {...evt} />
            ))}
        </div>
    );
}

export default EventGrid;
