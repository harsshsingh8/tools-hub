import { useState } from "react";
import { FileText, Download, RefreshCcw } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import { Document, Packer, Paragraph } from "docx";
import FileDropzone from "../../components/FileDropzone";
import LoadingSpinner from "../../components/LoadingSpinner";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PdfToWord() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleConvert = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setDone(false);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const paragraphs = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const text = textContent.items.map((item) => item.str).join(" ");
        if (text.trim()) {
          paragraphs.push(new Paragraph({ text }));
        }
      }

      const doc = new Document({
        sections: [{ properties: {}, children: paragraphs }],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, ".docx");
      a.click();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch (err) {
      console.error(err);
      setError("Failed to convert PDF. Please ensure it is a valid PDF file.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setDone(false);
    setError("");
  };

  return (
    <div className="space-y-5">
      {!file ? (
        <FileDropzone
          onFilesSelected={setFile}
          accept=".pdf"
          multiple={false}
        />
      ) : (
        <div className="rounded-xl bg-slate-800/40 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-brand-400" />
            <div>
              <p className="text-sm font-medium text-slate-200">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
          <button onClick={reset} className="text-xs text-slate-500 hover:text-slate-300">
            Change
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      {loading && <LoadingSpinner text="Extracting text and building Word document..." />}

      {!loading && file && !done && (
        <button
          onClick={handleConvert}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:bg-brand-500"
        >
          <Download className="h-4 w-4" />
          Convert to Word
        </button>
      )}

      {done && (
        <div className="text-center">
          <p className="text-sm text-emerald-400 mb-3">Conversion complete! Your download should start automatically.</p>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <RefreshCcw className="h-4 w-4" />
            Convert Another File
          </button>
        </div>
      )}
    </div>
  );
}
