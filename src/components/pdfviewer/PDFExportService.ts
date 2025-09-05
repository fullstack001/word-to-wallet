import { PDFDocument, PDFPage, rgb, StandardFonts } from "pdf-lib";
import * as fabric from "fabric";
import { Annotation, AnnotationType } from "./types";

export class PDFExportService {
  private pdfDoc: PDFDocument | null = null;
  private originalPdfBytes: ArrayBuffer | null = null;

  async loadPDF(pdfBytes: ArrayBuffer): Promise<void> {
    this.originalPdfBytes = pdfBytes;
    this.pdfDoc = await PDFDocument.load(pdfBytes);
  }

  async addAnnotations(annotations: Annotation[]): Promise<ArrayBuffer> {
    if (!this.pdfDoc) {
      throw new Error("PDF document not loaded");
    }

    const pages = this.pdfDoc.getPages();

    // Group annotations by page
    const annotationsByPage = this.groupAnnotationsByPage(annotations);

    // Add annotations to each page
    for (const [pageIndex, pageAnnotations] of annotationsByPage.entries()) {
      if (pageIndex < pages.length) {
        await this.addAnnotationsToPage(pages[pageIndex], pageAnnotations);
      }
    }

    // Save the modified PDF
    const pdfBytes = await this.pdfDoc.save();
    return pdfBytes.buffer.slice(
      pdfBytes.byteOffset,
      pdfBytes.byteOffset + pdfBytes.byteLength
    ) as ArrayBuffer;
  }

  private groupAnnotationsByPage(
    annotations: Annotation[]
  ): Map<number, Annotation[]> {
    const grouped = new Map<number, Annotation[]>();

    annotations.forEach((annotation) => {
      const pageNum = annotation.page - 1; // Convert to 0-based index
      if (!grouped.has(pageNum)) {
        grouped.set(pageNum, []);
      }
      grouped.get(pageNum)!.push(annotation);
    });

    return grouped;
  }

  private async addAnnotationsToPage(
    page: PDFPage,
    annotations: Annotation[]
  ): Promise<void> {
    for (const annotation of annotations) {
      await this.addAnnotationToPage(page, annotation);
    }
  }

  private async addAnnotationToPage(
    page: PDFPage,
    annotation: Annotation
  ): Promise<void> {
    const { type, data } = annotation;

    switch (type) {
      case AnnotationType.TEXT:
        await this.addTextAnnotation(page, data);
        break;
      case AnnotationType.HIGHLIGHT:
        await this.addHighlightAnnotation(page, data);
        break;
      case AnnotationType.DRAWING:
        await this.addDrawingAnnotation(page, data);
        break;
      case AnnotationType.STAMP:
        await this.addStampAnnotation(page, data);
        break;
      case AnnotationType.SHAPE:
        await this.addShapeAnnotation(page, data);
        break;
    }
  }

  private async addTextAnnotation(page: PDFPage, data: any): Promise<void> {
    const {
      left,
      top,
      width,
      height,
      text,
      fontSize = 12,
      fontColor = rgb(0, 0, 0),
    } = data;

    const font = await this.pdfDoc!.embedFont(StandardFonts.Helvetica);

    page.drawText(text, {
      x: left,
      y: page.getHeight() - top - height, // Convert from top-left to bottom-left
      size: fontSize,
      font,
      color: fontColor,
    });
  }

  private async addHighlightAnnotation(
    page: PDFPage,
    data: any
  ): Promise<void> {
    const { left, top, width, height, color = rgb(1, 1, 0) } = data;

    page.drawRectangle({
      x: left,
      y: page.getHeight() - top - height,
      width,
      height,
      color,
      opacity: 0.3,
    });
  }

  private async addDrawingAnnotation(page: PDFPage, data: any): Promise<void> {
    // Handle freehand drawing paths
    if (data.paths && Array.isArray(data.paths)) {
      for (const path of data.paths) {
        if (path.points && path.points.length > 1) {
          const points = path.points.map((point: any) => ({
            x: point.x,
            y: page.getHeight() - point.y, // Convert coordinates
          }));

          page.drawLine({
            start: points[0],
            end: points[1],
            thickness: path.strokeWidth || 2,
            color: path.stroke || rgb(1, 0, 0),
          });

          // Draw additional line segments for the path
          for (let i = 1; i < points.length - 1; i++) {
            page.drawLine({
              start: points[i],
              end: points[i + 1],
              thickness: path.strokeWidth || 2,
              color: path.stroke || rgb(1, 0, 0),
            });
          }
        }
      }
    }
  }

  private async addStampAnnotation(page: PDFPage, data: any): Promise<void> {
    const { left, top, width, height, imageUrl } = data;

    try {
      // Load and embed the stamp image
      const imageBytes = await this.loadImageAsBytes(imageUrl);
      const image = await this.pdfDoc!.embedPng(imageBytes);

      page.drawImage(image, {
        x: left,
        y: page.getHeight() - top - height,
        width,
        height,
      });
    } catch (error) {
      console.warn("Failed to add stamp annotation:", error);
      // Fallback to a simple rectangle
      page.drawRectangle({
        x: left,
        y: page.getHeight() - top - height,
        width,
        height,
        color: rgb(0.8, 0.8, 0.8),
        borderColor: rgb(0.5, 0.5, 0.5),
        borderWidth: 1,
      });
    }
  }

  private async addShapeAnnotation(page: PDFPage, data: any): Promise<void> {
    const {
      left,
      top,
      width,
      height,
      type,
      fill,
      stroke,
      strokeWidth = 1,
    } = data;

    const x = left;
    const y = page.getHeight() - top - height;

    switch (type) {
      case "rect":
        page.drawRectangle({
          x,
          y,
          width,
          height,
          color: fill ? this.parseColor(fill) : undefined,
          borderColor: stroke ? this.parseColor(stroke) : rgb(0, 0, 0),
          borderWidth: strokeWidth,
        });
        break;

      case "circle":
        const radius = Math.min(width, height) / 2;
        const centerX = x + width / 2;
        const centerY = y + height / 2;

        page.drawCircle({
          x: centerX,
          y: centerY,
          size: radius * 2,
          color: fill ? this.parseColor(fill) : undefined,
          borderColor: stroke ? this.parseColor(stroke) : rgb(0, 0, 0),
          borderWidth: strokeWidth,
        });
        break;

      case "line":
        page.drawLine({
          start: { x, y },
          end: { x: x + width, y: y + height },
          thickness: strokeWidth,
          color: stroke ? this.parseColor(stroke) : rgb(0, 0, 0),
        });
        break;

      case "arrow":
        // Draw arrow line
        page.drawLine({
          start: { x, y },
          end: { x: x + width, y: y + height },
          thickness: strokeWidth,
          color: stroke ? this.parseColor(stroke) : rgb(0, 0, 0),
        });

        // Draw arrow head
        const arrowLength = 10;
        const arrowAngle = Math.PI / 6;
        const lineAngle = Math.atan2(height, width);

        const arrowHead1 = {
          x: x + width - arrowLength * Math.cos(lineAngle - arrowAngle),
          y: y + height - arrowLength * Math.sin(lineAngle - arrowAngle),
        };

        const arrowHead2 = {
          x: x + width - arrowLength * Math.cos(lineAngle + arrowAngle),
          y: y + height - arrowLength * Math.sin(lineAngle + arrowAngle),
        };

        page.drawLine({
          start: { x: x + width, y: y + height },
          end: arrowHead1,
          thickness: strokeWidth,
          color: stroke ? this.parseColor(stroke) : rgb(0, 0, 0),
        });

        page.drawLine({
          start: { x: x + width, y: y + height },
          end: arrowHead2,
          thickness: strokeWidth,
          color: stroke ? this.parseColor(stroke) : rgb(0, 0, 0),
        });
        break;
    }
  }

  private parseColor(colorString: string): any {
    // Parse CSS color strings to rgb values
    if (colorString.startsWith("#")) {
      const hex = colorString.slice(1);
      const r = parseInt(hex.slice(0, 2), 16) / 255;
      const g = parseInt(hex.slice(2, 4), 16) / 255;
      const b = parseInt(hex.slice(4, 6), 16) / 255;
      return rgb(r, g, b);
    }

    if (colorString.startsWith("rgb(")) {
      const values = colorString.match(/\d+/g);
      if (values && values.length >= 3) {
        const r = parseInt(values[0]) / 255;
        const g = parseInt(values[1]) / 255;
        const b = parseInt(values[2]) / 255;
        return rgb(r, g, b);
      }
    }

    // Default to black
    return rgb(0, 0, 0);
  }

  private async loadImageAsBytes(imageUrl: string): Promise<Uint8Array> {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    return new Uint8Array(arrayBuffer);
  }

  async exportWithAnnotations(annotations: Annotation[]): Promise<ArrayBuffer> {
    if (!this.originalPdfBytes) {
      throw new Error("No PDF loaded");
    }

    await this.loadPDF(this.originalPdfBytes);
    return await this.addAnnotations(annotations);
  }
}

export default PDFExportService;
