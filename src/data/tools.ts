interface Tool {
  icon: string;
  labelKey: string;
  href: string;
  category: string;
  mobileOnly?: boolean;
  desktopOnly?: boolean;
}

const tools: Tool[] = [
  // Convert from PDF
  {
    icon: "/assets/icnos/pdf_word.svg",
    labelKey: "tools.pdfToWord",
    href: "/pdf-to-word",
    category: "convertFromPdf"
  },
  {
    icon: "/assets/icnos/pdf_excel.svg",
    labelKey: "tools.pdfToExcel",
    href: "/pdf-to-excel",
    category: "convertFromPdf"
  },
  {
    icon: "/assets/icnos/pdf_ppt.svg",
    labelKey: "tools.pdfToPptx",
    href: "/pdf-to-pptx",
    category: "convertFromPdf",
    mobileOnly: true // PDF to PPT for mobile
  },
  {
    icon: "/assets/icnos/pdf_png.svg",
    labelKey: "tools.pdfToPng",
    href: "/pdf-to-png",
    category: "convertFromPdf"
  },
  {
    icon: "/assets/icnos/pdf_jpg.svg",
    labelKey: "tools.pdfToJpg",
    href: "/pdf-to-jpg",
    category: "convertFromPdf"
  },
  {
    icon: "/assets/icnos/pdf_epub.svg",
    labelKey: "tools.pdfToEpub",
    href: "/pdf-to-epub",
    category: "convertFromPdf"
  },
  {
    icon: "/assets/icnos/pdf_mobi.svg",
    labelKey: "tools.pdfToMobi",
    href: "/pdf-to-mobi",
    category: "convertFromPdf"
  },
  {
    icon: "/assets/icnos/pdf_txt.svg",
    labelKey: "tools.pdfToTxt",
    href: "/pdf-to-txt",
    category: "convertFromPdf"
  },
  {
    icon: "/assets/icnos/pdf_html.svg",
    labelKey: "tools.pdfToHtml",
    href: "/pdf-to-html",
    category: "convertFromPdf"
  },
  {
    icon: "/assets/icnos/pdf_svg.svg",
    labelKey: "tools.pdfToSvg",
    href: "/pdf-to-svg",
    category: "convertFromPdf"
  },
  {
    icon: "/assets/icnos/pdf_tiff.svg",
    labelKey: "tools.pdfToTiff",
    href: "/pdf-to-tiff",
    category: "convertFromPdf"
  },
  {
    icon: "/assets/icnos/pdf_webp.svg",
    labelKey: "tools.pdfToWebp",
    href: "/pdf-to-webp",
    category: "convertFromPdf"
  },
  {
    icon: "/assets/icnos/pdf_Avif.svg",
    labelKey: "tools.pdfToAvif",
    href: "/pdf-to-avif",
    category: "convertFromPdf"
  },
  {
    icon: "/assets/icnos/pdf_eps.svg",
    labelKey: "tools.pdfToEps",
    href: "/pdf-to-eps",
    category: "convertFromPdf"
  },
  {
    icon: "/assets/icnos/pdf_dxf.svg",
    labelKey: "tools.pdfToDxf",
    href: "/pdf-to-dxf",
    category: "convertFromPdf"
  },
  {
    icon: "/assets/icnos/pdf_azw3.svg",
    labelKey: "tools.pdfToAzw3",
    href: "/pdf-to-azw3",
    category: "convertFromPdf"
  },

  // Convert to PDF
  {
    icon: "/assets/icnos/image_word.svg",
    labelKey: "tools.wordToPdf",
    href: "/word-to-pdf",
    category: "convertToPdf"
  },
  {
    icon: "/assets/icnos/image_excel.svg",
    labelKey: "tools.excelToPdf",
    href: "/excel-to-pdf",
    category: "convertToPdf",
    desktopOnly: true // XLS to PDF for desktop/tablet
  },
  {
    icon: "/assets/icnos/image_pdf.svg",
    labelKey: "tools.pptxToPdf",
    href: "/pptx-to-pdf",
    category: "convertToPdf"
  },
  {
    icon: "/assets/icnos/png_avif.svg",
    labelKey: "tools.pngToPdf",
    href: "/png-to-pdf",
    category: "convertToPdf"
  },
  {
    icon: "/assets/icnos/jpg_avif.svg",
    labelKey: "tools.jpgToPdf",
    href: "/jpg-to-pdf",
    category: "convertToPdf"
  },
  {
    icon: "/assets/icnos/epub_mobi.svg",
    labelKey: "tools.epubToPdf",
    href: "/epub-to-pdf",
    category: "convertToPdf"
  },
  {
    icon: "/assets/icnos/mobi_epub.svg",
    labelKey: "tools.mobiToPdf",
    href: "/mobi-to-pdf",
    category: "convertToPdf"
  },
  {
    icon: "/assets/icnos/avif_png.svg",
    labelKey: "tools.avifToPdf",
    href: "/avif-to-pdf",
    category: "convertToPdf"
  },
  {
    icon: "/assets/icnos/avif_jpg.svg",
    labelKey: "tools.avifToPdfJpg",
    href: "/avif-to-pdf",
    category: "convertToPdf"
  },

  // Image Conversion
  {
    icon: "/assets/icnos/png_avif.svg",
    labelKey: "tools.pngToAvif",
    href: "/png-to-avif",
    category: "convertImage"
  },
  {
    icon: "/assets/icnos/jpg_avif.svg",
    labelKey: "tools.jpgToAvif",
    href: "/jpg-to-avif",
    category: "convertImage"
  },
  {
    icon: "/assets/icnos/avif_png.svg",
    labelKey: "tools.avifToPng",
    href: "/avif-to-png",
    category: "convertImage"
  },
  {
    icon: "/assets/icnos/avif_jpg.svg",
    labelKey: "tools.avifToJpg",
    href: "/avif-to-jpg",
    category: "convertImage"
  },

  // E-book Conversion
  {
    icon: "/assets/icnos/epub_mobi.svg",
    labelKey: "tools.epubToMobi",
    href: "/epub-to-mobi",
    category: "convertEbook"
  },
  {
    icon: "/assets/icnos/mobi_epub.svg",
    labelKey: "tools.mobiToEpub",
    href: "/mobi-to-epub",
    category: "convertEbook"
  },

  // PDF Tools
  {
    icon: "/assets/icnos/edit.svg",
    labelKey: "tools.editPdf",
    href: "/editor",
    category: "otherFormats"
  },
  {
    icon: "/assets/icnos/sign-pdf.svg",
    labelKey: "tools.signPdf",
    href: "/sign-pdf",
    category: "otherFormats"
  },
  {
    icon: "/assets/icnos/pdf-split.svg",
    labelKey: "tools.splitPdf",
    href: "/split-pdf",
    category: "otherFormats"
  },
  {
    icon: "/assets/icnos/compress-pdf.svg",
    labelKey: "tools.compressPdf",
    href: "/compress-pdf",
    category: "otherFormats"
  },
  {
    icon: "/assets/icnos/pdf-ocr.svg",
    labelKey: "tools.pdfOcr",
    href: "/pdf-ocr",
    category: "otherFormats"
  },
  {
    icon: "/assets/icnos/pdf_page.svg",
    labelKey: "tools.mergePdf",
    href: "/merge-pdf",
    category: "otherFormats"
  },
  {
    icon: "/assets/icnos/pdf_picture.svg",
    labelKey: "tools.pdfToImage",
    href: "/pdf-to-image",
    category: "otherFormats"
  },
  {
    icon: "/assets/icnos/pdf_image.svg",
    labelKey: "tools.imageToPdf",
    href: "/image-to-pdf",
    category: "otherFormats"
  },
  {
    icon: "/assets/icnos/pdf-doc.svg",
    labelKey: "tools.pdfToDoc",
    href: "/pdf-to-doc",
    category: "otherFormats"
  }
];

export default tools;
