import { Link } from "react-router-dom";
import { ArrowDown, Zap } from "lucide-react";
import SearchBar from "./SearchBar";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pt-20 pb-16 sm:pt-28 sm:pb-24">
      <div className="relative mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-xs font-medium text-brand-300 mb-6 glow-brand">
          <Zap className="h-3.5 w-3.5" />
          12+ Free Tools — No Login Required
        </div>

        {/* Title */}
        <h1 className="animate-fade-in-up delay-100 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Free Online Tools —{" "}
          <span className="text-gradient-shimmer">Fast, Simple</span>{" "}
          <span className="text-gradient-shimmer">& No Login</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up delay-200 mx-auto mt-5 max-w-2xl text-base text-slate-400 sm:text-lg leading-relaxed">
          Convert, compress, and create instantly. A growing collection of
          powerful tools that run entirely in your browser. Your files never
          leave your device.
        </p>

        {/* Search */}
        <div className="animate-fade-in-up delay-300 mt-8">
          <SearchBar />
        </div>

        {/* CTA */}
        <div className="animate-fade-in-up delay-400 mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/#tools"
            className="btn-glow inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25"
          >
            Explore Tools
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </Link>
          <span className="text-xs text-slate-500 animate-pulse-soft">
            Works on mobile & desktop
          </span>
        </div>
      </div>
    </section>
  );
}
