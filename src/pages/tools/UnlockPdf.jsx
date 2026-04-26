import { useState } from "react";
import { Unlock, Download, RefreshCcw, Eye, EyeOff } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import FileDropzone from "../../components/FileDropzone";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function UnlockPdf() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const onFile = (f) => {
    setFile(f);
    setDone(false);
    setError("");
    setPassword("");
  };

  const handleUnlock = async () => {
    if (!file) return;
    if (!password) {
      setError("Please enter the PDF password.");
      return;
    }
    setLoading(true);
    setError("");
    setDone(false);

    try {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes, { password });
      const unlocked = await pdf.save();
      const blob = new Blob([unlocked], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, "_unlocked.pdf");
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch (err) {
      console.error(err);
      setError("Incorrect password or unsupported encryption. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPassword("");
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
            <Unlock className="h-5 w-5 text-brand-400" />
            <div>
              <p className="text-sm font-medium text-slate-200">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button onClick={reset} className="text-xs text-slate-500 hover:text-slate-300">Change</button>
        </div>
      )}

      {file && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">PDF Password</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 pr-10 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-brand-500/60"
            />
            <button
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
      {loading && <LoadingSpinner text="Unlocking PDF..." />}

      {!loading && file && !done && (
        <button
          onClick={handleUnlock}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:bg-brand-500"
        >
          <Unlock className="h-4 w-4" />
          Unlock PDF
        </button>
      )}

      {done && (
        <div className="text-center">
          <p className="text-sm text-emerald-400 mb-3">Unlock complete!</p>
          <button onClick={reset} className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors">
            <RefreshCcw className="h-4 w-4" />
            Unlock Another File
          </button>
        </div>
      )}
    </div>
  );
}
