"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import type PSPDFKitType from "pspdfkit";
import type { Instance } from "pspdfkit";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import "../../app/globals.css"; // Ensure global styles are imported

export interface PDFViewerRef {
  exportPDF: () => Promise<ArrayBuffer>;
  instance: Instance | null;
}

const PDFViewer = forwardRef<PDFViewerRef, {}>((props, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<Instance | null>(null);
  const fileName = useSelector((state: RootState) => state.flow.fileName);
  useImperativeHandle(ref, () => ({
    exportPDF: async () => {
      if (!instanceRef.current) {
        throw new Error("PDF instance not ready");
      }
      return await instanceRef.current.exportPDF();
    },
    instance: instanceRef.current,
  }));

  useEffect(() => {
    let instance: Instance | null = null;

    (async () => {
      const PSPDFKit = (await import(
        "pspdfkit"
      )) as unknown as typeof PSPDFKitType;

      if (containerRef.current) {
        PSPDFKit.unload(containerRef.current);
      }

      await PSPDFKit.load({
        container: containerRef.current as HTMLDivElement,
        // document: `${window.location.origin}/${primaryDocument}`,
        document: `https://api.wordtowallet.com/img/${fileName}`,
        baseUrl: `${window.location.origin}/pspdfkit-lib/`,
      }).then((inst) => {
        instance = inst;
        instanceRef.current = inst;
      });
    })();

    return () => {
      (async () => {
        const PSPDFKit = (await import(
          "pspdfkit"
        )) as unknown as typeof PSPDFKitType;
        if (instance && containerRef.current) {
          PSPDFKit.unload(containerRef.current);
          instanceRef.current = null;
        }
      })();
    };
  }, [fileName]);

  return (
    <div className="w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
});

PDFViewer.displayName = "PDFViewer";

export default PDFViewer;
