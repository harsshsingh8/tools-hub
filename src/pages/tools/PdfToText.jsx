import { useState } from "react";
import { Type, Copy, Download, RefreshCcw } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import FileDropzone from "../../components/FileDropzone";
import LoadingSpinner from "../../components/LoadingSpinner";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PdfToText() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const onFile = (f) => {
    setFile(f);
    setText("");
    setError("");
    setCopied(false);
  };

  const handleExtract = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setText("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let allText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(" ");
        allText += `--- Page ${i} ---\n${pageText}\n\n`;
      }

      setText(allText.trim());
    } catch (err) {
      console.error(err);
      setError("Failed to extract text. Please ensure it is a valid PDF file.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadText = () => {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name.replace(/\.pdf$/i, ".txt");
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setText("");
    setError("");
    setCopied(false);
  };

  return (
    <div className="space-y-5">
      {!file ? (
        <FileDropzone onFilesSelected={onFile} accept=".pdf" multiple={false} />
      ) : (
        <div className="rounded-xl bg-slate-800/40 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Type className="h-5 w-5 text-brand-400" />
            <div>
              <p className="text-sm font-medium text-slate-200">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button onClick={reset} className="text-xs text-slate-500 hover:text-slate-300">Change</button>
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
      {loading && <LoadingSpinner text="Extracting text from PDF..." />}

      {!loading && file && !text && (
        <button
          onClick={handleExtract}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:bg-brand-500"
        >
          <Type className="h-4 w-4" />
          Extract Text
        </button>
      )}

      {text && (
        <div className="space-y-3">
          <textarea
            readOnly
            value={text}
            rows={12}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-sm text-slate-200 outline-none resize-y font-mono leading-relaxed"
          />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={copyText}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copied!" : "Copy Text"}
            </button>
            <button
              onClick={downloadText}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Download .txt
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <RefreshCcw className="h-4 w-4" />
              New File
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
