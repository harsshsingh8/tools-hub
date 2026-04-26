import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { categories } from "../data/tools";

export default function ToolCard({ tool, index = 0 }) {
  const category = categories.find((c) => c.id === tool.category);

  return (
    <Link
      to={tool.path}
      className="group relative flex flex-col rounded-2xl bg-gradient-card glass glass-hover card-hover p-5"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="mb-4 flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${category?.bg || "bg-slate-700/30"} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}
        >
          <tool.icon
            className={`h-5 w-5 ${category?.color || "text-slate-300"} transition-transform duration-300 group-hover:scale-110`}
          />
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800/50 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:bg-brand-500/20">
          <ArrowUpRight className="h-3.5 w-3.5 text-brand-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      <h3 className="text-base font-semibold text-slate-100 mb-1 font-display tracking-tight">
        {tool.title}
      </h3>
      <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
        {tool.description}
      </p>

      <div className="mt-auto pt-4">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${category?.bg || "bg-slate-700/30"} ${category?.color || "text-slate-300"} transition-all duration-300 group-hover:scale-105`}
        >
          {category?.label || tool.category}
        </span>
      </div>
    </Link>
  );
}
