export interface ToolPageConfig {
  titleKey: string;
  subtitleKey: string;
  action: string;
  route: string;
}

export const toolPages: Record<string, ToolPageConfig> = {
  home: {
    titleKey: "toolPages.home.title",
    subtitleKey: "toolPages.home.subtitle",
    action: "edit_pdf",
    route: "/",
  },
  "sign-pdf": {
    titleKey: "toolPages.signPdf.title",
    subtitleKey: "toolPages.signPdf.subtitle",
    action: "sign_pdf",
    route: "/sign-pdf",
  },
  "split-pdf": {
    titleKey: "toolPages.splitPdf.title",
    subtitleKey: "toolPages.splitPdf.subtitle",
    action: "split_pdf",
    route: "/split-pdf",
  },
  "compress-pdf": {
    titleKey: "toolPages.compressPdf.title",
    subtitleKey: "toolPages.compressPdf.subtitle",
    action: "compress_pdf",
    route: "/compress-pdf",
  },
  "merge-pdf": {
    titleKey: "toolPages.mergePdf.title",
    subtitleKey: "toolPages.mergePdf.subtitle",
    action: "merge_pdf",
    route: "/merge-pdf",
  },
};

export const getToolPageConfig = (toolKey: string): ToolPageConfig | null => {
  return toolPages[toolKey] || null;
};
