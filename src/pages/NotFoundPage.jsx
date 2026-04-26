import { Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";
import AdSense from "../components/AdSense";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15">
        <AlertTriangle className="h-8 w-8 text-amber-400" />
      </div>
      <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
        Page Not Found
      </h1>
      <p className="mt-3 max-w-md text-sm text-slate-400">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition-all hover:bg-brand-500"
      >
        <Home className="h-4 w-4" />
        Back to Home
      </Link>

      {/* Ad — 404 Page */}
      <div className="mt-10 w-full max-w-xl">
        <AdSense slot="6666666666" format="auto" style={{ minHeight: "90px" }} />
      </div>
    </div>
  );
}
