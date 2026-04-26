import { useState } from "react";
import { Combine, Download, RefreshCcw, GripVertical, Trash2 } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import FileDropzone from "../../components/FileDropzone";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function PdfMerge() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleFilesSelected = (selected) => {
    const incoming = Array.isArray(selected) ? selected : selected ? [selected] : [];
    setFiles((prev) => [...prev, ...incoming]);
    setDone(false);
    setError("");
  };

  const move = (index, dir) => {
    const next = [...files];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setFiles(next);
  };

  const remove = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Please upload at least 2 PDF files to merge.");
      return;
    }
    setLoading(true);
    setError("");
    setDone(false);

    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const pdfBytes = await merged.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch (err) {
      console.error(err);
      setError("Failed to merge PDFs. Please ensure all files are valid PDFs.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFiles([]);
    setDone(false);
    setError("");
  };

  return (
    <div className="space-y-5">
      <FileDropzone
        onFilesSelected={handleFilesSelected}
        accept=".pdf"
        multiple={true}
      />

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="flex items-center gap-2 rounded-xl bg-slate-800/40 px-3 py-2"
            >
              <GripVertical className="h-4 w-4 text-slate-600" />
              <span className="flex-1 truncate text-sm text-slate-200">{file.name}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => move(i, -1)} className="rounded p-1 text-slate-500 hover:bg-slate-700 hover:text-slate-300" title="Move up">&#8593;</button>
                <button onClick={() => move(i, 1)} className="rounded p-1 text-slate-500 hover:bg-slate-700 hover:text-slate-300" title="Move down">&#8595;</button>
                <button onClick={() => remove(i)} className="rounded p-1 text-slate-500 hover:bg-red-500/20 hover:text-red-400" title="Remove">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
      {loading && <LoadingSpinner text="Merging PDFs..." />}

      {!loading && files.length >= 2 && !done && (
        <button
          onClick={handleMerge}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:bg-brand-500"
        >
          <Combine className="h-4 w-4" />
          Merge PDFs
        </button>
      )}

      {done && (
        <div className="text-center">
          <p className="text-sm text-emerald-400 mb-3">Merge complete!</p>
          <button onClick={reset} className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors">
            <RefreshCcw className="h-4 w-4" />
            Merge More Files
          </button>
        </div>
      )}
    </div>
  );
}
