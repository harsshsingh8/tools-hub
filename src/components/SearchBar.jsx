import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { tools } from "../data/tools";
import { Link } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return tools.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div
        className={`
          flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all
          ${focused
            ? "border-brand-400/60 bg-slate-800/80 shadow-lg shadow-brand-500/10"
            : "border-slate-700 bg-slate-800/50"
          }
        `}
      >
        <Search className="h-5 w-5 text-slate-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Search tools (e.g., pdf to word, compress...)"
          className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none"
        />
        {query && (
          <button onClick={() => setQuery("")} className="rounded-lg p-1 text-slate-500 hover:bg-slate-700 hover:text-slate-300">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {focused && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden">
          {results.map((tool) => (
            <Link
              key={tool.id}
              to={tool.path}
              onClick={() => setQuery("")}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-800/80"
            >
              <tool.icon className="h-5 w-5 text-brand-400" />
              <div>
                <p className="text-sm font-medium text-slate-200">{tool.title}</p>
                <p className="text-xs text-slate-500">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {focused && query.trim() && results.length === 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/95 backdrop-blur-xl shadow-2xl px-4 py-6 text-center text-sm text-slate-500">
          No tools found for "{query}"
        </div>
      )}
    </div>
  );
}
