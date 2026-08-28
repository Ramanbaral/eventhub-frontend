export interface EventFilterParams {
  search?: string | undefined;
  event_type?: "public" | "private" | undefined;
  tags?: string[] | undefined;
  date_from?: Date | undefined;
  date_to?: Date | undefined;
}
