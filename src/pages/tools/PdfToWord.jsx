import { useState } from "react";
import { FileText, Download, RefreshCcw } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.mjs?url";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableCell,
  TableRow,
  WidthType,
} from "docx";
import FileDropzone from "../../components/FileDropzone";
import LoadingSpinner from "../../components/LoadingSpinner";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

function isBoldFont(fontName) {
  if (!fontName) return false;
  const lower = fontName.toLowerCase();
  return lower.includes("bold") || lower.includes("heavy") || lower.includes("black");
}

function extractStructuredLines(textItems) {
  if (!textItems || textItems.length === 0) return [];

  const items = textItems
    .map((item) => ({
      text: item.str || "",
      x: item.transform?.[4] ?? 0,
      y: item.transform?.[5] ?? 0,
      width: item.width ?? 0,
      height: item.height ?? 12,
      fontName: item.fontName ?? "",
    }))
    .filter((item) => item.text.trim());

  if (items.length === 0) return [];

  // Sort by y descending (top to bottom)
  items.sort((a, b) => b.y - a.y);

  // Group into lines by y-position
  const lines = [];
  const yTolerance = 4;
  let currentLine = [items[0]];

  for (let i = 1; i < items.length; i++) {
    const lastY = currentLine[0].y;
    if (Math.abs(items[i].y - lastY) <= yTolerance) {
      currentLine.push(items[i]);
    } else {
      currentLine.sort((a, b) => a.x - b.x);
      lines.push(currentLine);
      currentLine = [items[i]];
    }
  }
  if (currentLine.length > 0) {
    currentLine.sort((a, b) => a.x - b.x);
    lines.push(currentLine);
  }

  // Calculate median height for heading detection
  const heights = items.map((i) => i.height).sort((a, b) => a - b);
  const medianHeight = heights[Math.floor(heights.length / 2)] || 12;

  return lines.map((lineItems) => {
    const text = lineItems.map((i) => i.text).join(" ").trim();
    const maxHeight = Math.max(...lineItems.map((i) => i.height));
    const lineBold = lineItems.some((i) => isBoldFont(i.fontName));
    const wordCount = text.split(/\s+/).length;

    return {
      text,
      items: lineItems,
      maxHeight,
      isBold: lineBold,
      isHeading:
        maxHeight > medianHeight * 1.35 ||
        (lineBold && wordCount <= 12 && maxHeight > medianHeight * 1.1),
    };
  });
}

function groupLinesIntoBlocks(lines) {
  const blocks = [];
  const gapThreshold = 12;
  let currentBlock = [lines[0]];

  for (let i = 1; i < lines.length; i++) {
    const prevY = currentBlock[currentBlock.length - 1].items[0].y;
    const currY = lines[i].items[0].y;
    if (prevY - currY > gapThreshold) {
      blocks.push(currentBlock);
      currentBlock = [lines[i]];
    } else {
      currentBlock.push(lines[i]);
    }
  }
  if (currentBlock.length > 0) blocks.push(currentBlock);
  return blocks;
}

function buildDocxTable(block) {
  const lineColumns = block.map((line) => {
    const cols = [];
    let currentCol = [line.items[0]];

    for (let i = 1; i < line.items.length; i++) {
      const prev = line.items[i - 1];
      const curr = line.items[i];
      const gap = curr.x - (prev.x + prev.width);
      if (gap > 18) {
        cols.push(currentCol);
        currentCol = [curr];
      } else {
        currentCol.push(curr);
      }
    }
    cols.push(currentCol);
    return cols;
  });

  const maxCols = Math.max(...lineColumns.map((c) => c.length), 1);

  const rows = lineColumns.map((cols) => {
    const cells = [];
    for (let i = 0; i < maxCols; i++) {
      const colItems = cols[i] || [];
      const cellText = colItems.map((c) => c.text).join(" ").trim();
      cells.push(
        new TableCell({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: cellText || " ",
                  bold: colItems.some((c) => isBoldFont(c.fontName)),
                }),
              ],
            }),
          ],
          width: { size: 100 / maxCols, type: WidthType.PERCENTAGE },
        })
      );
    }
    return new TableRow({ children: cells });
  });

  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

function buildDocxParagraphs(lines) {
  return lines.map((line) => {
    const runs = line.items.map(
      (item) =>
        new TextRun({
          text: item.text,
          bold: isBoldFont(item.fontName),
          size: Math.round(item.height * 2),
        })
    );

    return new Paragraph({
      children: runs,
      spacing: { after: 80 },
    });
  });
}

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
      let totalItems = 0;
      const allLines = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        totalItems += textContent.items.length;
        const pageLines = extractStructuredLines(textContent.items);
        allLines.push(...pageLines);
      }

      if (totalItems === 0 || allLines.length === 0) {
        throw new Error(
          "This PDF appears to be a scanned image with no extractable text. Try an OCR tool first."
        );
      }

      const blocks = groupLinesIntoBlocks(allLines);
      const docxChildren = [];

      for (const block of blocks) {
        const tableLikeLines = block.filter((line) => {
          if (line.items.length < 2) return false;
          for (let i = 1; i < line.items.length; i++) {
            const gap = line.items[i].x - (line.items[i - 1].x + line.items[i - 1].width);
            if (gap > 18) return true;
          }
          return false;
        });
        const isTable = block.length >= 2 && tableLikeLines.length >= 2;
        const headingLines = block.filter((l) => l.isHeading);

        if (headingLines.length === 1 && block.length === 1) {
          docxChildren.push(
            new Paragraph({
              text: block[0].text,
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 280, after: 140 },
            })
          );
        } else if (isTable) {
          docxChildren.push(buildDocxTable(block));
          docxChildren.push(new Paragraph({ text: "" }));
        } else {
          docxChildren.push(...buildDocxParagraphs(block));
        }
      }

      const doc = new Document({
        sections: [{ properties: {}, children: docxChildren }],
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
      setError(err.message || "Failed to convert PDF. Please ensure it is a valid PDF file.");
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
