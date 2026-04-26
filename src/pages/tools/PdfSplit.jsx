import { useState } from "react";
import { Scissors, Download, RefreshCcw } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import FileDropzone from "../../components/FileDropzone";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function PdfSplit() {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [range, setRange] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const onFile = async (f) => {
    setFile(f);
    setDone(false);
    setError("");
    setRange("");
    try {
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      setPageCount(pdf.getPageCount());
    } catch {
      setPageCount(0);
    }
  };

  const parseRanges = (input, total) => {
    const pages = new Set();
    const parts = input.split(",").map((s) => s.trim());
    for (const part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(total, end); i++) pages.add(i);
        }
      } else {
        const n = Number(part);
        if (!isNaN(n) && n >= 1 && n <= total) pages.add(n);
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file || !range.trim()) {
      setError("Please enter page numbers or ranges to extract.");
      return;
    }
    setLoading(true);
    setError("");
    setDone(false);

    try {
      const bytes = await file.arrayBuffer();
      const src = await PDFDocument.load(bytes);
      const selected = parseRanges(range, pageCount);

      if (selected.length === 0) {
        setError("No valid pages found in the range you entered.");
        setLoading(false);
        return;
      }

      const out = await PDFDocument.create();
      const indices = selected.map((p) => p - 1);
      const pages = await out.copyPages(src, indices);
      pages.forEach((p) => out.addPage(p));

      const pdfBytes = await out.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "_split.pdf");
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch (err) {
      console.error(err);
      setError("Failed to split PDF. Please check your page range and try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPageCount(0);
    setRange("");
    setDone(false);
    setError("");
  };

  return (
    <div className="space-y-5">
      {!file ? (
        <FileDropzone onFilesSelected={onFile} accept=".pdf" multiple={false} />
      ) : (
        <div className="rounded-xl bg-slate-800/40 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scissors className="h-5 w-5 text-brand-400" />
            <div>
              <p className="text-sm font-medium text-slate-200">{file.name}</p>
              <p className="text-xs text-slate-500">{pageCount} pages</p>
            </div>
          </div>
          <button onClick={reset} className="text-xs text-slate-500 hover:text-slate-300">Change</button>
        </div>
      )}

      {file && pageCount > 0 && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Pages to extract (e.g., 1-3, 5, 7-9)
          </label>
          <input
            type="text"
            value={range}
            onChange={(e) => setRange(e.target.value)}
            placeholder={`1-${pageCount}`}
            className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-brand-500/60"
          />
          <p className="mt-1 text-xs text-slate-500">
            Total pages: {pageCount}. Use commas to separate ranges or individual pages.
          </p>
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
      {loading && <LoadingSpinner text="Splitting PDF..." />}

      {!loading && file && !done && (
        <button
          onClick={handleSplit}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:bg-brand-500"
        >
          <Scissors className="h-4 w-4" />
          Split PDF
        </button>
      )}

      {done && (
        <div className="text-center">
          <p className="text-sm text-emerald-400 mb-3">Split complete!</p>
          <button onClick={reset} className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors">
            <RefreshCcw className="h-4 w-4" />
            Split Another File
          </button>
        </div>
      )}
    </div>
  );
}
