import { useState, useMemo } from "react";
import { AlignLeft, Copy, Trash2 } from "lucide-react";

export default function WordCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const sentences = trimmed ? trimmed.split(/[.!?]+/).filter(Boolean).length : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
    const readingTime = Math.ceil(words / 200);
    return { words, chars, charsNoSpace, sentences, paragraphs, readingTime };
  }, [text]);

  const copy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        rows={10}
        className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 outline-none resize-y leading-relaxed"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-800/40 px-4 py-3 text-center">
          <p className="text-xl font-bold text-brand-400">{stats.words}</p>
          <p className="text-xs text-slate-500 mt-0.5">Words</p>
        </div>
        <div className="rounded-xl bg-slate-800/40 px-4 py-3 text-center">
          <p className="text-xl font-bold text-brand-400">{stats.chars}</p>
          <p className="text-xs text-slate-500 mt-0.5">Characters</p>
        </div>
        <div className="rounded-xl bg-slate-800/40 px-4 py-3 text-center">
          <p className="text-xl font-bold text-brand-400">{stats.charsNoSpace}</p>
          <p className="text-xs text-slate-500 mt-0.5">Chars (no spaces)</p>
        </div>
        <div className="rounded-xl bg-slate-800/40 px-4 py-3 text-center">
          <p className="text-xl font-bold text-brand-400">{stats.sentences}</p>
          <p className="text-xs text-slate-500 mt-0.5">Sentences</p>
        </div>
        <div className="rounded-xl bg-slate-800/40 px-4 py-3 text-center">
          <p className="text-xl font-bold text-brand-400">{stats.paragraphs}</p>
          <p className="text-xs text-slate-500 mt-0.5">Paragraphs</p>
        </div>
        <div className="rounded-xl bg-slate-800/40 px-4 py-3 text-center">
          <p className="text-xl font-bold text-brand-400">{stats.readingTime} min</p>
          <p className="text-xs text-slate-500 mt-0.5">Reading time</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={copy}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors"
        >
          <Copy className="h-4 w-4" />
          {copied ? "Copied!" : "Copy Text"}
        </button>
        <button
          onClick={() => setText("")}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </button>
      </div>
    </div>
  );
}
