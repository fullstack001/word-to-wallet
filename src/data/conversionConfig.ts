import {
  convertPdfToWord,
  convertPdfToPng,
  convertPdfToJpg,
  convertPdfToEpub,
  convertPdfToExcel,
  convertPdfToPptx,
  convertWordToPdf,
  convertJpgToPdf,
  convertPngToPdf,
  convertEpubToPdf,
} from "@/utils/apiUtils";

export interface ConversionToolConfig {
  titleKey: string;
  subtitleKey: string;
  convertFunction: (file: File) => Promise<string>;
  action: string;
  acceptType?: string;
}

export const conversionTools: Record<string, ConversionToolConfig> = {
  "pdf-to-word": {
    titleKey: "toolPages.pdfToWord.title",
    subtitleKey: "toolPages.pdfToWord.subtitle",
    convertFunction: convertPdfToWord,
    action: "pdf_to_word",
  },
  "pdf-to-png": {
    titleKey: "toolPages.pdfToPng.title",
    subtitleKey: "toolPages.pdfToPng.subtitle",
    convertFunction: convertPdfToPng,
    action: "pdf_to_png",
  },
  "pdf-to-jpg": {
    titleKey: "toolPages.pdfToJpg.title",
    subtitleKey: "toolPages.pdfToJpg.subtitle",
    convertFunction: convertPdfToJpg,
    action: "pdf_to_jpg",
  },
  "pdf-to-epub": {
    titleKey: "toolPages.pdfToEpub.title",
    subtitleKey: "toolPages.pdfToEpub.subtitle",
    convertFunction: convertPdfToEpub,
    action: "pdf_to_epub",
  },
  "pdf-to-excel": {
    titleKey: "toolPages.pdfToExcel.title",
    subtitleKey: "toolPages.pdfToExcel.subtitle",
    convertFunction: convertPdfToExcel,
    action: "pdf_to_excel",
  },
  "pdf-to-pptx": {
    titleKey: "toolPages.pdfToPptx.title",
    subtitleKey: "toolPages.pdfToPptx.subtitle",
    convertFunction: convertPdfToPptx,
    action: "pdf_to_pptx",
  },
  "word-to-pdf": {
    titleKey: "toolPages.wordToPdf.title",
    subtitleKey: "toolPages.wordToPdf.subtitle",
    convertFunction: convertWordToPdf,
    action: "word_to_pdf",
    acceptType: ".docx, .doc",
  },
  "jpg-to-pdf": {
    titleKey: "toolPages.jpgToPdf.title",
    subtitleKey: "toolPages.jpgToPdf.subtitle",
    convertFunction: convertJpgToPdf,
    action: "jpg_to_pdf",
    acceptType: ".jpg, .jpeg",
  },
  "png-to-pdf": {
    titleKey: "toolPages.pngToPdf.title",
    subtitleKey: "toolPages.pngToPdf.subtitle",
    convertFunction: convertPngToPdf,
    action: "png_to_pdf",
    acceptType: ".png",
  },
  "epub-to-pdf": {
    titleKey: "toolPages.epubToPdf.title",
    subtitleKey: "toolPages.epubToPdf.subtitle",
    convertFunction: convertEpubToPdf,
    action: "epub_to_pdf",
    acceptType: ".epub",
  },
};

export const getConversionConfig = (toolKey: string): ConversionToolConfig | null => {
  return conversionTools[toolKey] || null;
}; 