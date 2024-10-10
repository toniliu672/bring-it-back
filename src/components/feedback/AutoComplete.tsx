import React, { useState, useEffect, useRef } from "react";
import { Occupation } from "@/interfaces/schoolStats";
import { searchOccupations } from "@/services/schoolStatsService";
import { useDebounce } from "@/hooks/useDebounce";
import { useTheme } from "next-themes";
import SpinnerLoading from "./SpinnerLoading";

interface AutocompleteProps {
  onSelect: (occupation: Occupation) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Occupation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (debouncedQuery) {
      setIsLoading(true);
      searchOccupations(debouncedQuery).then((results) => {
        setSuggestions(results);
        setIsLoading(false);
      });
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleSelect = (occupation: Occupation) => {
    setQuery(`${occupation.code} - ${occupation.name}`);
    setShowSuggestions(false);
    onSelect(occupation);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSuggestions(true);
        }}
        placeholder="Cari okupasi..."
        className={`w-full p-2 border rounded ${
          theme === "dark"
            ? "bg-gray-800 text-white border-gray-600"
            : "bg-white text-black border-gray-300"
        }`}
      />
      {isLoading && (
        <div className="absolute right-2 top-2">
          <SpinnerLoading size="small" />
        </div>
      )}
      {showSuggestions && suggestions.length > 0 && (
        <ul
          className={`absolute z-10 w-full border rounded mt-1 max-h-60 overflow-auto ${
            theme === "dark"
              ? "bg-gray-800 text-white border-gray-600"
              : "bg-white text-black border-gray-300"
          }`}
        >
          {suggestions.map((occupation) => (
            <li
              key={occupation.id}
              onClick={() => handleSelect(occupation)}
              className={`p-2 cursor-pointer ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              {occupation.code} - {occupation.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
