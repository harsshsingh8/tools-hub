import { useState, useRef } from "react";
import { Image, Download, RefreshCcw, Minus, Plus } from "lucide-react";
import FileDropzone from "../../components/FileDropzone";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function ImageCompressor() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [quality, setQuality] = useState(80);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [compressedUrl, setCompressedUrl] = useState(null);
  const [compressedSize, setCompressedSize] = useState(0);
  const canvasRef = useRef(null);

  const onFile = (f) => {
    setFile(f);
    setDone(false);
    setCompressedUrl(null);
    setCompressedSize(0);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const handleCompress = async () => {
    if (!file || !preview) return;
    setLoading(true);
    setDone(false);

    try {
      const img = new window.Image();
      img.src = preview;
      await new Promise((resolve) => { img.onload = resolve; });

      const canvas = canvasRef.current;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const mime = file.type === "image/png" ? "image/png" : "image/jpeg";
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, mime, quality / 100);
      });

      setCompressedSize(blob.size);
      const url = URL.createObjectURL(blob);
      setCompressedUrl(url);
      setDone(true);

      const a = document.createElement("a");
      a.href = url;
      const ext = mime === "image/png" ? "png" : "jpg";
      a.download = file.name.replace(/\.[^.]+$/, `_compressed.${ext}`);
      a.click();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setQuality(80);
    setDone(false);
    setCompressedUrl(null);
    setCompressedSize(0);
  };

  return (
    <div className="space-y-5">
      <canvas ref={canvasRef} className="hidden" />

      {!file ? (
        <FileDropzone
          onFilesSelected={onFile}
          accept="image/png,image/jpeg,image/webp"
          multiple={false}
          maxSizeMB={10}
        />
      ) : (
        <div className="rounded-xl bg-slate-800/40 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image className="h-5 w-5 text-brand-400" />
            <div>
              <p className="text-sm font-medium text-slate-200">{file.name}</p>
              <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <button onClick={reset} className="text-xs text-slate-500 hover:text-slate-300">Change</button>
        </div>
      )}

      {preview && (
        <div className="space-y-4">
          <img
            src={preview}
            alt="Preview"
            className="mx-auto max-h-56 rounded-xl object-contain"
          />

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-300">Quality</label>
              <span className="text-sm font-semibold text-brand-400">{quality}%</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuality((q) => Math.max(10, q - 5))}
                className="rounded-lg bg-slate-800 p-1.5 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="flex-1 accent-brand-500"
              />
              <button
                onClick={() => setQuality((q) => Math.min(100, q + 5))}
                className="rounded-lg bg-slate-800 p-1.5 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <LoadingSpinner text="Compressing image..." />}

      {!loading && file && !done && (
        <button
          onClick={handleCompress}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition-all hover:bg-brand-500"
        >
          <Image className="h-4 w-4" />
          Compress Image
        </button>
      )}

      {done && compressedUrl && (
        <div className="text-center space-y-3">
          <p className="text-sm text-emerald-400">Compression complete!</p>
          {compressedSize > 0 && (
            <p className="text-xs text-slate-400">
              {(file.size / 1024).toFixed(1)} KB → {(compressedSize / 1024).toFixed(1)} KB
              {" "}(
              {((file.size - compressedSize) / file.size * 100).toFixed(1)}% reduction
              )
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-2">
            <a
              href={compressedUrl}
              download
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 transition-colors"
            >
              <Download className="h-4 w-4" />
              Download
            </a>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <RefreshCcw className="h-4 w-4" />
              Compress Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
