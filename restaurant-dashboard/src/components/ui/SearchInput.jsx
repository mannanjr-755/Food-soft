import { useId } from "react";
import { Search } from "lucide-react";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}) {
  const id = useId();

  return (
    <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <div className="flex items-center rounded-lg border border-gray-200 px-3">
        <Search size={20} className="shrink-0 text-gray-400" aria-hidden="true" />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent p-3 text-sm outline-none"
        />
      </div>
    </div>
  );
}
