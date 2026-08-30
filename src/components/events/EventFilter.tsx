import { CalendarIcon, Tag, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface FilterBoxProps {
  visibility: string;
  setVisibility: (val: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  dateFrom: Date | undefined;
  setDateFrom: (date: Date | undefined) => void;
  dateTo: Date | undefined;
  setDateTo: (date: Date | undefined) => void;
}

function FilterBox({
  visibility,
  setVisibility,
  selectedTags,
  setSelectedTags,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
}: FilterBoxProps) {
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!selectedTags.includes(newTag)) {
        setSelectedTags([...selectedTags, newTag]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

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
          onValueChange={(val) => val[0] && setVisibility(val[0])}
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
      <div className="flex items-start gap-4">
        <div className="flex w-[90px] shrink-0 items-center gap-1.5 pt-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          <Tag className="h-3.5 w-3.5" />
          <span>Tags</span>
        </div>
        <div className="flex flex-1 flex-wrap items-center gap-2">
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer rounded-full border-none bg-[#1a73e8]/10 px-3 py-0.5 text-xs font-medium text-[#1a73e8] hover:bg-[#1a73e8]/20"
              onClick={() => handleRemoveTag(tag)}
            >
              {tag}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Type a tag and press Enter"
            className="h-7 w-[180px] rounded-lg border-slate-200 bg-white px-3 text-xs shadow-sm placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-[#1a73e8]"
          />
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
            onChange={(date: Date | undefined) => {
              if (date && dateTo && date > dateTo) {
                toast.error("Start date cannot be later than end date");
                return;
              }
              setDateFrom(date);
            }}
            placeholder="mm/dd/yyyy"
          />
          <span className="mx-1 text-sm text-slate-400">to</span>
          <DatePicker
            value={dateTo}
            onChange={(date: Date | undefined) => {
              if (date && dateFrom && date < dateFrom) {
                toast.error("End date cannot be earlier than start date");
                return;
              }
              setDateTo(date);
            }}
            placeholder="mm/dd/yyyy"
          />
          {(dateFrom || dateTo) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setDateFrom(undefined);
                setDateTo(undefined);
              }}
              className="h-7 px-2 text-xs text-slate-400 hover:text-slate-600"
            >
              <X className="mr-1 h-3 w-3" />
              Clear
            </Button>
          )}
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
