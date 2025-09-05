"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import {
  GlobalWorkerOptions,
  getDocument,
  type PDFDocumentProxy,
} from "pdfjs-dist/legacy/build/pdf";
import { fabric } from "fabric";

// Serve the worker from /public (copy it there from pdfjs-dist)
GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.js";

interface CustomPDFViewerProps {
  onZoomChange?: (zoom: number) => void;
  onExportPDFReady?: (exportPDF: () => Promise<ArrayBuffer>) => void; // exports all page canvases' JSON
}

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 5;
const clamp = (n: number, lo: number, hi: number) =>
  Math.min(Math.max(n, lo), hi);

const CustomPDFViewer: React.FC<CustomPDFViewerProps> = ({
  onZoomChange,
  onExportPDFReady,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const pdfDocumentRef = useRef<PDFDocumentProxy | null>(null);

  // Maintain a canvas + fabric instance per page
  const pageCanvasEls = useRef<Map<number, HTMLCanvasElement>>(new Map());
  const pageFabricMap = useRef<Map<number, fabric.Canvas>>(new Map());
  const pageInitSet = useRef<Set<number>>(new Set()); // ensure each Fabric is created once

  const fileName = useSelector((s: RootState) => s.flow.fileName);
  const pdfFileData = useSelector((s: RootState) => s.flow.pdfFileData);

  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    let b64 = base64.trim();
    if (b64.startsWith("data:")) {
      const idx = b64.indexOf(",");
      if (idx !== -1) b64 = b64.slice(idx + 1);
    }
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  };

  const ensureFabricForPage = (pageNumber: number) => {
    // Create Fabric only once per page
    if (pageInitSet.current.has(pageNumber)) return;
    const el = pageCanvasEls.current.get(pageNumber);
    if (!el) return;

    const fc = new fabric.Canvas(el, {
      selection: true,
      preserveObjectStacking: true,
      backgroundColor: "#f0f0f0",
    });
    pageFabricMap.current.set(pageNumber, fc);
    pageInitSet.current.add(pageNumber);
  };

  const renderPage = useCallback(async (pageNumber: number, scale: number) => {
    const pdf = pdfDocumentRef.current;
    if (!pdf) return;

    const fc = pageFabricMap.current.get(pageNumber);
    if (!fc) return;

    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale });

    fc.setDimensions({ width: viewport.width, height: viewport.height });
    fc.clear();
    fc.backgroundColor = "#f0f0f0";

    // offscreen render
    const temp = document.createElement("canvas");
    temp.width = Math.ceil(viewport.width);
    temp.height = Math.ceil(viewport.height);
    const ctx = temp.getContext("2d");
    if (!ctx) throw new Error("2D context not available");
    await page.render({ canvasContext: ctx, viewport }).promise;

    // set as locked background
    const img = new Image();
    img.onload = () => {
      const bg = new fabric.Image(img, {
        selectable: false,
        evented: false,
        left: 0,
        top: 0,
      });
      fc.setBackgroundImage(bg, fc.renderAll.bind(fc));
    };
    img.src = temp.toDataURL();
  }, []);

  const renderAllPages = useCallback(
    async (scale: number) => {
      const pdf = pdfDocumentRef.current;
      if (!pdf) return;
      // render sequentially to keep memory use reasonable
      for (let p = 1; p <= pdf.numPages; p++) {
        await renderPage(p, scale);
      }
    },
    [renderPage]
  );

  const loadPDF = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const task =
        pdfFileData && pdfFileData.length > 0
          ? getDocument({
              data: base64ToArrayBuffer(pdfFileData),
              disableAutoFetch: true,
              disableStream: true,
            })
          : fileName
          ? getDocument({
              url: `https://api.wordtowallet.com/img/${encodeURIComponent(
                fileName
              )}`,
              disableAutoFetch: true,
              disableStream: true,
            })
          : null;

      if (!task) throw new Error("No PDF file selected or data provided");
      const pdf = await task.promise;
      pdfDocumentRef.current = pdf;
      setTotalPages(pdf.numPages);

      // Ensure all per-page Fabric canvases exist before first render
      // (Refs are set by React render; we’ll trigger actual render in a follow-up effect)
    } catch (err: any) {
      console.error("[PDF] load failed:", err);
      setError(err?.message || "Failed to load PDF");
    } finally {
      setIsLoading(false);
    }
  }, [pdfFileData, fileName]);

  // Initial load
  useEffect(() => {
    loadPDF();
    return () => {
      // cleanup all Fabric canvases
      for (const fc of pageFabricMap.current.values()) {
        try {
          fc.off();
          fc.clear();
          // don't dispose (keeps DOM stable for React unmount)
        } catch {}
      }
      pageFabricMap.current.clear();
      pageCanvasEls.current.clear();
      pageInitSet.current.clear();
      pdfDocumentRef.current = null;
    };
  }, [loadPDF]);

  // When totalPages known and canvases mounted, init Fabric instances and render
  useEffect(() => {
    if (!totalPages || !pdfDocumentRef.current) return;

    // Initialize Fabric for each page that now has a canvas element
    for (let p = 1; p <= totalPages; p++) {
      ensureFabricForPage(p);
    }
    // Render all pages at current zoom
    (async () => {
      await renderAllPages(zoom);
    })();
  }, [totalPages, zoom, renderAllPages]);

  // Zoom change callback to parent (optional)
  useEffect(() => {
    onZoomChange?.(zoom);
  }, [zoom, onZoomChange]);

  // Export: all Fabric canvases JSON in an array (page-ordered)
  const exportPDF = useCallback(async (): Promise<ArrayBuffer> => {
    const pages: Record<string, any>[] = [];
    for (let p = 1; p <= totalPages; p++) {
      const fc = pageFabricMap.current.get(p);
      if (fc) pages.push({ page: p, json: fc.toJSON() });
    }
    const blob = new Blob([JSON.stringify({ zoom, pages })], {
      type: "application/json",
    });
    return blob.arrayBuffer();
  }, [totalPages, zoom]);

  useEffect(() => {
    onExportPDFReady?.(exportPDF);
  }, [exportPDF, onExportPDFReady]);

  // helper to attach a canvas ref per page (stable by pageNumber)
  const setPageCanvasRef =
    (pageNumber: number) => (el: HTMLCanvasElement | null) => {
      if (el) {
        pageCanvasEls.current.set(pageNumber, el);
        // If PDF already loaded, we can init Fabric immediately for this page
        ensureFabricForPage(pageNumber);
      } else {
        // unmount path
        const fc = pageFabricMap.current.get(pageNumber);
        if (fc) {
          try {
            fc.off();
            fc.clear();
          } catch {}
          pageFabricMap.current.delete(pageNumber);
        }
        pageCanvasEls.current.delete(pageNumber);
        pageInitSet.current.delete(pageNumber);
      }
    };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <button
            onClick={() => location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="bg-gray-100 border-b p-2 flex gap-2 items-center">
        <button
          onClick={() => setZoom((z) => clamp(z + 0.2, MIN_ZOOM, MAX_ZOOM))}
          className="px-3 py-1 bg-green-600 text-white rounded"
          disabled={isLoading || !totalPages}
        >
          Zoom In
        </button>
        <button
          onClick={() => setZoom((z) => clamp(z - 0.2, MIN_ZOOM, MAX_ZOOM))}
          className="px-3 py-1 bg-green-600 text-white rounded"
          disabled={isLoading || !totalPages}
        >
          Zoom Out
        </button>
        <span className="px-3 py-1 bg-gray-200 rounded">
          {Math.round(zoom * 100)}%
        </span>
        <div className="ml-auto text-sm text-gray-500">
          {isLoading
            ? "Loading…"
            : totalPages
            ? `${totalPages} pages`
            : "No document"}
        </div>
      </div>

      {/* Scrollable pages container */}
      <div ref={containerRef} className="flex-1 overflow-auto">
        {/* Render one canvas per page (vertical stack) */}
        {Array.from({ length: totalPages || 0 }, (_, i) => {
          const pageNumber = i + 1;
          return (
            <div key={pageNumber} className="w-full flex justify-center py-4">
              <canvas
                ref={setPageCanvasRef(pageNumber)}
                className="border border-gray-300 shadow-sm"
                // Give an initial size so Fabric can initialize; it will be reset on first render
                width={900}
                height={1200}
              />
            </div>
          );
        })}
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4" />
              <p className="text-gray-600">Loading PDF…</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

CustomPDFViewer.displayName = "CustomPDFViewer";
export default CustomPDFViewer;
