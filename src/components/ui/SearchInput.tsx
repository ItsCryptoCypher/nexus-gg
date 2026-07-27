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
      className={`flex h-10 items-center gap-2 rounded-xl border border-border-subtle bg-surface px-3 text-muted transition-colors focus-within:border-accent/50 focus-within:text-foreground ${className}`}
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
