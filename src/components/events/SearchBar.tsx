import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: () => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

function SearchBar({
  searchQuery,
  setSearchQuery,
  onSearch,
  showFilters,
  setShowFilters,
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search events by title..."
          className="h-11 w-full rounded-xl border-slate-200 bg-white pl-10 text-base shadow-sm focus-visible:ring-1 focus-visible:ring-[#1a73e8]"
        />
      </div>
      <Button
        onClick={onSearch}
        className="h-11 shrink-0 rounded-xl bg-[#1a73e8] px-6 font-medium text-white shadow-sm transition-colors hover:bg-[#1557b0]"
      >
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
      <Button
        variant="secondary"
        onClick={() => setShowFilters(!showFilters)}
        className={`h-11 shrink-0 rounded-xl border px-5 font-medium shadow-sm transition-colors ${showFilters ? "border-blue-200 bg-blue-100 text-blue-700 hover:bg-blue-200" : "border-blue-100/50 bg-blue-50/50 text-[#1a73e8] hover:bg-blue-50 hover:text-blue-700"}`}
      >
        <SlidersHorizontal className="mr-2 h-4 w-4" />
        Filters
      </Button>
    </div>
  );
}

export default SearchBar;
