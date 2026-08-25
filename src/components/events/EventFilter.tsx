import { CalendarIcon, Tag } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

function FilterBox({ visibility, setVisibility }: any) {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm md:px-6">
      {/* Visibility */}
      <div className="flex items-center gap-4">
        <span className="w-[90px] shrink-0 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          Visibility
        </span>
        <ToggleGroup
          type="single"
          value={visibility}
          onValueChange={(val) => val && setVisibility(val)}
          className="justify-start gap-2"
        >
          <ToggleGroupItem
            value="all"
            className="h-7 rounded-full bg-slate-100 px-4 text-xs font-medium text-slate-600 hover:bg-slate-200 data-[state=on]:bg-[#1a73e8] data-[state=on]:text-white data-[state=on]:hover:bg-blue-700"
          >
            All
          </ToggleGroupItem>
          <ToggleGroupItem
            value="public"
            className="h-7 rounded-full bg-slate-100 px-4 text-xs font-medium text-slate-600 hover:bg-slate-200 data-[state=on]:bg-[#1a73e8] data-[state=on]:text-white data-[state=on]:hover:bg-blue-700"
          >
            Public
          </ToggleGroupItem>
          <ToggleGroupItem
            value="private"
            className="h-7 rounded-full bg-slate-100 px-4 text-xs font-medium text-slate-600 hover:bg-slate-200 data-[state=on]:bg-[#1a73e8] data-[state=on]:text-white data-[state=on]:hover:bg-blue-700"
          >
            Private
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-4">
        <div className="flex w-[90px] shrink-0 items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          <Tag className="h-3.5 w-3.5" />
          <span>Tags</span>
        </div>
        <div className="flex gap-2">
          <Badge
            variant="secondary"
            className="rounded-full border-none bg-slate-100/80 px-4 py-0.5 text-xs font-medium text-slate-600 hover:bg-slate-200"
          >
            new
          </Badge>
          <Badge
            variant="secondary"
            className="rounded-full border-none bg-slate-100/80 px-4 py-0.5 text-xs font-medium text-slate-600 hover:bg-slate-200"
          >
            test
          </Badge>
        </div>
      </div>

      {/* Date Range */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex w-[100px] shrink-0 items-center gap-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          <CalendarIcon className="h-3.5 w-3.5" />
          <span>Date Range</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DatePicker
            value={dateFrom}
            onChange={setDateFrom}
            placeholder="mm/dd/yyyy"
          />
          <span className="mx-1 text-sm text-slate-400">to</span>
          <DatePicker
            value={dateTo}
            onChange={setDateTo}
            placeholder="mm/dd/yyyy"
          />
        </div>
      </div>
    </div>
  );
}

function DatePicker({ value, onChange, placeholder }: any) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`h-9 w-[165px] justify-between rounded-lg border-slate-200 bg-white px-3 text-left font-normal shadow-sm hover:bg-slate-50 ${!value ? "text-slate-400" : "text-slate-900"}`}
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {value ? format(value, "MM/dd/yyyy") : placeholder}
          </div>
          <CalendarIcon className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export default FilterBox;
