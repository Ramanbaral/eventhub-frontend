import { format } from "date-fns";
import type { EventFilterParams } from "@/types/event-filter.type";

/**
 * Builds URLSearchParams from EventFilterParams.
 * Only appends params that have values — the backend ignores absent keys.
 */
export function buildFilterParams(filters: EventFilterParams): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.event_type) {
    params.append("event_type", filters.event_type);
  }

  if (filters.tags && filters.tags.length > 0) {
    filters.tags.forEach((tag) => {
      params.append("tags", tag);
    });
  }

  if (filters.date_from) {
    params.append("date_from", format(filters.date_from, "yyyy-MM-dd"));
  }

  if (filters.date_to) {
    params.append("date_to", format(filters.date_to, "yyyy-MM-dd"));
  }

  return params;
}
