import { Search } from "lucide-react";

type SearchInputProps = {
  placeholder?: string;
  className?: string;
};

export function SearchInput({
  placeholder = "Search...",
  className = "",
}: SearchInputProps) {
  return (
    <label
      className={`glass-panel flex h-10 items-center gap-2 rounded-xl px-3 text-muted transition-opacity focus-within:text-foreground ${className}`}
    >
      <Search className="h-4 w-4 shrink-0" />
      <input
        type="search"
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-dark"
      />
    </label>
  );
}
