import { useState } from "react";
import { Code, Copy, Check, Wand2, Minimize2, AlertCircle } from "lucide-react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [view, setView] = useState("formatted"); // formatted | tree

  const format = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError("");
    } catch (err) {
      setError(err.message);
      setOutput("");
    }
  };

  const minify = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (err) {
      setError(err.message);
      setOutput("");
    }
  };

  const validate = () => {
    if (!input.trim()) return;
    try {
      JSON.parse(input);
      setError("");
      setOutput("Valid JSON!");
    } catch (err) {
      setError(err.message);
      setOutput("");
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const renderTree = (obj, level = 0) => {
    if (obj === null) return <span className="text-slate-500">null</span>;
    if (typeof obj === "string") return <span className="text-emerald-400">"{obj}"</span>;
    if (typeof obj === "number") return <span className="text-amber-400">{obj}</span>;
    if (typeof obj === "boolean") return <span className="text-brand-400">{String(obj)}</span>;
    if (Array.isArray(obj)) {
      return (
        <div style={{ paddingLeft: level * 12 }}>
          <span className="text-slate-400">[</span>
          {obj.map((item, i) => (
            <div key={i} style={{ paddingLeft: 12 }}>
              {renderTree(item, level + 1)}
              {i < obj.length - 1 && <span className="text-slate-500">,</span>}
            </div>
          ))}
          <span className="text-slate-400">]</span>
        </div>
      );
    }
    if (typeof obj === "object") {
      const entries = Object.entries(obj);
      return (
        <div style={{ paddingLeft: level * 12 }}>
          <span className="text-slate-400">{"{"}</span>
          {entries.map(([key, val], i) => (
            <div key={key} style={{ paddingLeft: 12 }}>
              <span className="text-cyan-400">"{key}"</span>
              <span className="text-slate-500">: </span>
              {renderTree(val, level + 1)}
              {i < entries.length - 1 && <span className="text-slate-500">,</span>}
            </div>
          ))}
          <span className="text-slate-400">{"}"}</span>
        </div>
      );
    }
    return null;
  };

  let treeData = null;
  if (output && output !== "Valid JSON!" && !error) {
    try { treeData = JSON.parse(output); } catch {}
  }

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your JSON here..."
        rows={8}
        className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 outline-none resize-y font-mono leading-relaxed"
      />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={format}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500 transition-colors"
        >
          <Wand2 className="h-4 w-4" />
          Format
        </button>
        <button
          onClick={minify}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors"
        >
          <Minimize2 className="h-4 w-4" />
          Minify
        </button>
        <button
          onClick={validate}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 transition-colors"
        >
          <Check className="h-4 w-4" />
          Validate
        </button>
        <button
          onClick={clear}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-colors"
        >
          <AlertCircle className="h-4 w-4" />
          Clear
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {output && !error && output !== "Valid JSON!" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setView("formatted")}
                className={`text-xs font-medium px-2 py-1 rounded-lg transition-colors ${view === "formatted" ? "bg-brand-600 text-white" : "text-slate-500 hover:text-slate-300"}`}
              >
                Formatted
              </button>
              <button
                onClick={() => setView("tree")}
                className={`text-xs font-medium px-2 py-1 rounded-lg transition-colors ${view === "tree" ? "bg-brand-600 text-white" : "text-slate-500 hover:text-slate-300"}`}
              >
                Tree View
              </button>
            </div>
            <button
              onClick={copyOutput}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          {view === "formatted" ? (
            <pre className="max-h-80 overflow-auto rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-xs text-slate-200 font-mono leading-relaxed">
              {output}
            </pre>
          ) : (
            <div className="max-h-80 overflow-auto rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-xs font-mono leading-relaxed">
              {treeData ? renderTree(treeData) : <span className="text-slate-500">Invalid tree data</span>}
            </div>
          )}
        </div>
      )}

      {output === "Valid JSON!" && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400">
          Valid JSON!
        </div>
      )}
    </div>
  );
}
