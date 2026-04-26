import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ text = "Processing..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <Loader2 className="h-10 w-10 animate-spin text-brand-400" />
      <p className="text-sm text-slate-400">{text}</p>
    </div>
  );
}
