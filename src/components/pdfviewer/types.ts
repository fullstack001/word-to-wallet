import * as fabric from "fabric";

export enum ToolType {
  SELECT = "select",
  DRAW = "draw",
  TEXT = "text",
  HIGHLIGHT = "highlight",
  STAMP = "stamp",
  SHAPE = "shape",
  ERASER = "eraser",
}

export enum AnnotationType {
  TEXT = "text",
  HIGHLIGHT = "highlight",
  DRAWING = "drawing",
  STAMP = "stamp",
  SHAPE = "shape",
}

export interface Annotation {
  id: string;
  type: AnnotationType;
  object: fabric.Object;
  page: number;
  data: any;
  createdAt: Date;
  modifiedAt: Date;
}

export interface SearchResult {
  page: number;
  text: string;
  bounds: number[];
  index: number;
}

export interface PDFEditorState {
  currentPage: number;
  totalPages: number;
  zoom: number;
  tool: ToolType;
  annotations: Annotation[];
  isDrawing: boolean;
  searchResults: SearchResult[];
  currentSearchIndex: number;
}

export interface PDFToolbarProps {
  tool: ToolType;
  onToolChange: (tool: ToolType) => void;
  onZoomChange: (zoom: number) => void;
  zoom: number;
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
}

export interface PDFPageNavigatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface PDFSearchProps {
  onSearch: (query: string) => void;
  results: SearchResult[];
  currentIndex: number;
  onResultSelect: (result: SearchResult) => void;
}

export interface StampData {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
}

export interface ShapeData {
  id: string;
  name: string;
  type: "rect" | "circle" | "line" | "arrow";
  properties: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  };
}
