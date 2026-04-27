import React, { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchLocations } from '@/data/worldLocations';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  value,
  onChange,
  placeholder = "Escribe una ciudad o país..."
}) => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update suggestions when value changes
  useEffect(() => {
    if (value.length > 0) {
      setSuggestions(searchLocations(value));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000" />
        <MapPin className="absolute left-8 top-1/2 -translate-y-1/2 text-emerald-500 w-8 h-8 z-10 pointer-events-none" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="relative text-2xl py-10 pl-20 pr-8 rounded-3xl border-none bg-white dark:bg-white/5 shadow-2xl focus:ring-2 focus:ring-emerald-500 w-full"
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl z-50 max-h-[400px] overflow-y-auto">
          {suggestions.map((loc, idx) => (
            <button
              key={`${loc.value}-${idx}`}
              onClick={() => handleSelectSuggestion(loc.value)}
              className="w-full px-6 py-3 text-left hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 transition-colors flex items-center gap-3 border-b border-gray-100 dark:border-white/5 last:border-b-0"
            >
              <MapPin className={`w-4 h-4 flex-shrink-0 ${loc.type === 'country' ? 'text-emerald-500' : 'text-blue-500'}`} />
              <span className="font-medium text-gray-900 dark:text-white flex-1">{loc.label}</span>
              <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                {loc.type === 'country' ? 'País' : 'Ciudad'}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {showSuggestions && value.length > 0 && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1a1a1a] rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl z-50 p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No encontramos "{value}" en nuestra base de datos. <br />
            <span className="text-xs text-gray-400">Puedes escribir cualquier ubicación personalizada.</span>
          </p>
        </div>
      )}
    </div>
  );
};
