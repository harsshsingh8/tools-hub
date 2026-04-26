import { useCallback, useState } from "react";
import { Upload, File, X } from "lucide-react";

export default function FileDropzone({
  onFilesSelected,
  accept = ".pdf",
  multiple = false,
  maxSizeMB = 20,
}) {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const validateFiles = (fileList) => {
    setError("");
    const valid = [];
    for (const file of fileList) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File "${file.name}" exceeds ${maxSizeMB}MB limit.`);
        continue;
      }
      valid.push(file);
    }
    return valid;
  };

  const handleFiles = (fileList) => {
    const valid = validateFiles(fileList);
    if (valid.length === 0) return;
    const next = multiple ? [...files, ...valid] : valid;
    setFiles(next);
    onFilesSelected(multiple ? next : next[0]);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [files]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const onInputChange = (e) => {
    handleFiles(e.target.files);
  };

  const removeFile = (index) => {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    onFilesSelected(multiple ? next : null);
  };

  return (
    <div className="w-full">
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`
          relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 transition-all
          ${dragOver
            ? "border-brand-400 bg-brand-500/10"
            : "border-slate-600 bg-slate-800/40 hover:border-slate-500 hover:bg-slate-800/60"
          }
        `}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/15">
          <Upload className="h-6 w-6 text-brand-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-slate-200">
            Drop your file{multiple ? "s" : ""} here, or{" "}
            <label className="cursor-pointer text-brand-400 hover:text-brand-300">
              browse
              <input
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={onInputChange}
                className="sr-only"
              />
            </label>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {accept.replace(/\./g, "").toUpperCase()} up to {maxSizeMB}MB
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="flex items-center justify-between rounded-xl bg-slate-800/60 px-4 py-3"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <File className="h-5 w-5 shrink-0 text-brand-400" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-200">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(i)}
                className="shrink-0 rounded-lg p-1 text-slate-500 hover:bg-slate-700 hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
