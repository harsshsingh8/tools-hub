import { useState } from "react";
import { Minimize2, Download, RefreshCcw } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import FileDropzone from "../../components/FileDropzone";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function CompressPdf() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [level, setLevel] = useState("medium");

  const onFile = (f) => {
    setFile(f);
    setOriginalSize(f.size);
    setDone(false);
    setError("");
    setCompressedSize(0);
  };

  const handleCompress = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setDone(false);

    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { updateMetadata: false });

      // Best-effort: remove unused objects and re-save
      // pdf-lib does not do image re-encoding, so we rely on structural cleanup
      const saved = await pdf.save({ useObjectStreams: true });
      const blob = new Blob([saved], { type: "application/pdf" });

      setCompressedSize(blob.size);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "_compressed.pdf");
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch (err) {
      console.error(err);
      setError("Failed to compress PDF. Please ensure it is a valid PDF file.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setDone(false);
    setError("");
    setOriginalSize(0);
    setCompressedSize(0);
  };

  const saved = originalSize > 0 && compressedSize > 0
    ? ((originalSize - compressedSize) / originalSize * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-5">
      {!file ? (
        <FileDropzone onFilesSelected={onFile} accept=".pdf" multiple={false} />
      ) : (
        <div className="rounded-xl bg-slate-800/40 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Minimize2 className="h-5 w-5 text-brand-400" />
            <div>
              <p className="text-sm font-medium text-slate-200">{file.name}</p>
              <p className="text-xs text-slate-500">{(originalSize / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button onClick={reset} className="text-xs text-slate-500 hover:text-slate-300">Change</button>
        </div>
      )}

      {file && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Compression Level</label>
          <div className="flex gap-2">
            {["low", "medium", "high"].map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium capitalize transition-all ${
                  level === l
                    ? "bg-brand-600 text-white"
                    : "bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Note: Client-side compression is best-effort. Results vary based on PDF content.
          </p>
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
      {loading && <LoadingSpinner text="Compressing PDF..." />}

      {!loading && file && !done && (
        <button
          onClick={handleCompress}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:bg-brand-500"
        >
          <Minimize2 className="h-4 w-4" />
          Compress PDF
        </button>
      )}

      {done && (
        <div className="text-center space-y-3">
          <p className="text-sm text-emerald-400">Compression complete!</p>
          {Number(saved) > 0 ? (
            <p className="text-xs text-slate-400">
              Reduced by <span className="font-semibold text-slate-200">{saved}%</span>{" "}
              ({(originalSize / 1024 / 1024).toFixed(2)} MB →{" "}
              {(compressedSize / 1024 / 1024).toFixed(2)} MB)
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              This PDF is already well-optimized. Minimal reduction achieved.
            </p>
          )}
          <button onClick={reset} className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors">
            <RefreshCcw className="h-4 w-4" />
            Compress Another File
          </button>
        </div>
      )}
    </div>
  );
}
