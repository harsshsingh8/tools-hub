import { useState } from "react";
import { tools, categories } from "../data/tools";
import HeroSection from "../components/HeroSection";
import ToolCard from "../components/ToolCard";
import AdSense from "../components/AdSense";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? tools
      : tools.filter((t) => t.category === activeCategory);

  return (
    <div>
      <HeroSection />

      {/* Ad — Below Hero */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-8">
        <AdSense slot="1111111111" format="auto" style={{ minHeight: "90px" }} />
      </div>

      <section id="tools" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="mb-8 text-center animate-fade-in-up">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl tracking-tight">
            Explore Our Tools
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            All tools are free, private, and run in your browser
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2 animate-fade-in-up delay-100">
          <button
            onClick={() => setActiveCategory("all")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
              activeCategory === "all"
                ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20 glow-brand"
                : "bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
                activeCategory === cat.id
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20 glow-brand"
                  : "bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tool Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-slate-500">
            No tools found in this category.
          </div>
        )}

        {/* Ad — Below Tool Grid */}
        <AdSense slot="5555555555" format="auto" style={{ minHeight: "90px" }} />
      </section>

      {/* Stats / Trust Section */}
      <section className="border-y border-white/5 glass px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            <div className="animate-fade-in-up">
              <p className="text-3xl font-bold text-gradient-shimmer">12+</p>
              <p className="mt-1 text-sm text-slate-500">Free Tools</p>
            </div>
            <div className="animate-fade-in-up delay-100">
              <p className="text-3xl font-bold text-gradient-shimmer">100%</p>
              <p className="mt-1 text-sm text-slate-500">Free Forever</p>
            </div>
            <div className="animate-fade-in-up delay-200">
              <p className="text-3xl font-bold text-gradient-shimmer">0</p>
              <p className="mt-1 text-sm text-slate-500">Login Required</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ad — Below Stats */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <AdSense slot="2222222222" format="auto" style={{ minHeight: "90px" }} />
      </div>
    </div>
  );
}
