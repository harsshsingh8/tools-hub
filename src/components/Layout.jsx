import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Wrench, Globe, MessageCircle, Mail } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import AnimatedBackground from "./AnimatedBackground";

export default function Layout({ children }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-950 text-slate-200">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/5 glass-strong">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 shadow-lg shadow-brand-500/30 transition-all group-hover:shadow-brand-500/50 group-hover:scale-105">
              <Wrench className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-lg font-bold text-white tracking-tight">
              ToolsHub
            </span>
          </Link>

          <nav className="hidden items-center gap-6 sm:flex">
            <Link
              to="/"
              className="relative text-sm font-medium text-slate-400 transition-colors hover:text-white after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-brand-400 after:transition-all hover:after:w-full"
            >
              Home
            </Link>
            <Link
              to="/#tools"
              className="relative text-sm font-medium text-slate-400 transition-colors hover:text-white after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-brand-400 after:transition-all hover:after:w-full"
            >
              Tools
            </Link>
            <Link
              to="/pdf-to-word"
              className="relative text-sm font-medium text-slate-400 transition-colors hover:text-white after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-brand-400 after:transition-all hover:after:w-full"
            >
              PDF Tools
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 animate-fade-in">{children}</main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 glass px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 shadow-lg shadow-brand-500/20">
                  <Wrench className="h-4 w-4 text-white" />
                </div>
                <span className="font-display text-lg font-bold text-white tracking-tight">
                  ToolsHub
                </span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Free online tools that run entirely in your browser. Convert,
                compress, and create without registration.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3 tracking-tight">Popular Tools</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/pdf-to-word" className="text-sm text-slate-500 hover:text-brand-400 transition-colors duration-300">
                    PDF to Word
                  </Link>
                </li>
                <li>
                  <Link to="/compress-pdf" className="text-sm text-slate-500 hover:text-brand-400 transition-colors duration-300">
                    Compress PDF
                  </Link>
                </li>
                <li>
                  <Link to="/merge-pdf" className="text-sm text-slate-500 hover:text-brand-400 transition-colors duration-300">
                    Merge PDF
                  </Link>
                </li>
                <li>
                  <Link to="/image-compressor" className="text-sm text-slate-500 hover:text-brand-400 transition-colors duration-300">
                    Image Compressor
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3 tracking-tight">Company</h4>
              <ul className="space-y-2">
                <li>
                  <span className="text-sm text-slate-500 cursor-default">About</span>
                </li>
                <li>
                  <span className="text-sm text-slate-500 cursor-default">Privacy Policy</span>
                </li>
                <li>
                  <span className="text-sm text-slate-500 cursor-default">Contact</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3 tracking-tight">Connect</h4>
              <div className="flex items-center gap-3">
                <a href="#" className="rounded-lg bg-slate-800/60 p-2 text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 transition-all duration-300">
                  <Globe className="h-4 w-4" />
                </a>
                <a href="#" className="rounded-lg bg-slate-800/60 p-2 text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 transition-all duration-300">
                  <MessageCircle className="h-4 w-4" />
                </a>
                <a href="#" className="rounded-lg bg-slate-800/60 p-2 text-slate-500 hover:text-brand-400 hover:bg-brand-500/10 transition-all duration-300">
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/5 pt-6 text-center text-xs text-slate-600">
            &copy; {new Date().getFullYear()} ToolsHub. All rights reserved. Free online tools for everyone.
          </div>
        </div>
      </footer>
    </div>
  );
}
