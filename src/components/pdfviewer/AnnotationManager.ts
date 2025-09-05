import * as fabric from "fabric";
import { Annotation, AnnotationType, ToolType } from "./types";

export class AnnotationManager {
  private annotations: Annotation[] = [];
  private canvas: fabric.Canvas | null = null;
  private currentTool: ToolType = ToolType.SELECT;
  private drawingSettings = {
    color: "#ff0000",
    width: 2,
    fontSize: 16,
    fontFamily: "Arial",
  };

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
    this.setupCanvasEvents();
  }

  private setupCanvasEvents(): void {
    if (!this.canvas) return;

    this.canvas.on("mouse:down", this.handleMouseDown.bind(this));
    this.canvas.on("mouse:move", this.handleMouseMove.bind(this));
    this.canvas.on("mouse:up", this.handleMouseUp.bind(this));
    this.canvas.on("object:added", this.handleObjectAdded.bind(this));
    this.canvas.on("object:modified", this.handleObjectModified.bind(this));
    this.canvas.on("object:removed", this.handleObjectRemoved.bind(this));
  }

  setTool(tool: ToolType): void {
    this.currentTool = tool;

    if (!this.canvas) return;

    switch (tool) {
      case ToolType.DRAW:
        this.canvas.isDrawingMode = true;
        this.canvas.freeDrawingBrush.width = this.drawingSettings.width;
        this.canvas.freeDrawingBrush.color = this.drawingSettings.color;
        break;
      case ToolType.TEXT:
        this.canvas.isDrawingMode = false;
        this.canvas.defaultCursor = "text";
        break;
      case ToolType.HIGHLIGHT:
        this.canvas.isDrawingMode = false;
        this.canvas.defaultCursor = "crosshair";
        break;
      case ToolType.STAMP:
        this.canvas.isDrawingMode = false;
        this.canvas.defaultCursor = "crosshair";
        break;
      case ToolType.SHAPE:
        this.canvas.isDrawingMode = false;
        this.canvas.defaultCursor = "crosshair";
        break;
      case ToolType.ERASER:
        this.canvas.isDrawingMode = true;
        this.canvas.freeDrawingBrush.width = 20;
        this.canvas.freeDrawingBrush.color = "rgba(255,255,255,1)";
        break;
      default:
        this.canvas.isDrawingMode = false;
        this.canvas.defaultCursor = "default";
        break;
    }
  }

  private handleMouseDown(e: fabric.IEvent): void {
    if (!this.canvas) return;

    const pointer = this.canvas.getPointer(e.e);

    switch (this.currentTool) {
      case ToolType.TEXT:
        this.addTextAnnotation(pointer.x, pointer.y);
        break;
      case ToolType.HIGHLIGHT:
        this.startHighlightSelection(pointer.x, pointer.y);
        break;
      case ToolType.STAMP:
        this.addStampAnnotation(pointer.x, pointer.y);
        break;
      case ToolType.SHAPE:
        this.startShapeDrawing(pointer.x, pointer.y);
        break;
    }
  }

  private handleMouseMove(e: fabric.IEvent): void {
    // Handle drawing preview and shape resizing
  }

  private handleMouseUp(e: fabric.IEvent): void {
    // Finalize shape drawing and highlight selection
  }

  private handleObjectAdded(e: fabric.IEvent): void {
    const obj = e.target;
    if (!obj) return;

    const annotation: Annotation = {
      id: this.generateId(),
      type: this.getAnnotationType(obj),
      object: obj,
      page: this.getCurrentPage(),
      data: obj.toObject(),
      createdAt: new Date(),
      modifiedAt: new Date(),
    };

    this.annotations.push(annotation);
    this.emitAnnotationChange();
  }

  private handleObjectModified(e: fabric.IEvent): void {
    const obj = e.target;
    if (!obj) return;

    const annotation = this.findAnnotationByObject(obj);
    if (annotation) {
      annotation.data = obj.toObject();
      annotation.modifiedAt = new Date();
      this.emitAnnotationChange();
    }
  }

  private handleObjectRemoved(e: fabric.IEvent): void {
    const obj = e.target;
    if (!obj) return;

    this.annotations = this.annotations.filter((ann) => ann.object !== obj);
    this.emitAnnotationChange();
  }

  private addTextAnnotation(x: number, y: number): void {
    if (!this.canvas) return;

    const text = new fabric.IText("Click to edit", {
      left: x,
      top: y,
      fontSize: this.drawingSettings.fontSize,
      fontFamily: this.drawingSettings.fontFamily,
      fill: this.drawingSettings.color,
      selectable: true,
      editable: true,
    });

    this.canvas.add(text);
    this.canvas.setActiveObject(text);
    text.enterEditing();
  }

  private startHighlightSelection(x: number, y: number): void {
    if (!this.canvas) return;

    const rect = new fabric.Rect({
      left: x,
      top: y,
      width: 0,
      height: 0,
      fill: "rgba(255, 255, 0, 0.3)",
      stroke: "rgba(255, 255, 0, 0.8)",
      strokeWidth: 1,
      selectable: false,
      evented: false,
    });

    this.canvas.add(rect);
    this.canvas.setActiveObject(rect);
  }

  private addStampAnnotation(x: number, y: number): void {
    if (!this.canvas) return;

    // Create a simple stamp (circle with text)
    const stamp = new fabric.Group(
      [
        new fabric.Circle({
          radius: 20,
          fill: "rgba(255, 0, 0, 0.8)",
          stroke: "#ff0000",
          strokeWidth: 2,
        }),
        new fabric.Text("STAMP", {
          fontSize: 12,
          fill: "white",
          fontWeight: "bold",
        }),
      ],
      {
        left: x - 20,
        top: y - 20,
        selectable: true,
        hasControls: true,
      }
    );

    this.canvas.add(stamp);
  }

  private startShapeDrawing(x: number, y: number): void {
    if (!this.canvas) return;

    // Start drawing a rectangle (can be extended for other shapes)
    const rect = new fabric.Rect({
      left: x,
      top: y,
      width: 0,
      height: 0,
      fill: "transparent",
      stroke: this.drawingSettings.color,
      strokeWidth: this.drawingSettings.width,
      selectable: true,
    });

    this.canvas.add(rect);
    this.canvas.setActiveObject(rect);
  }

  private getAnnotationType(obj: fabric.Object): AnnotationType {
    if (obj instanceof fabric.IText || obj instanceof fabric.Text) {
      return AnnotationType.TEXT;
    }
    if (obj instanceof fabric.Rect && obj.fill === "rgba(255, 255, 0, 0.3)") {
      return AnnotationType.HIGHLIGHT;
    }
    if (obj instanceof fabric.Group) {
      return AnnotationType.STAMP;
    }
    if (
      obj instanceof fabric.Rect ||
      obj instanceof fabric.Circle ||
      obj instanceof fabric.Line
    ) {
      return AnnotationType.SHAPE;
    }
    return AnnotationType.DRAWING;
  }

  private findAnnotationByObject(obj: fabric.Object): Annotation | undefined {
    return this.annotations.find((ann) => ann.object === obj);
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private getCurrentPage(): number {
    // This should be implemented based on your page management
    return 1;
  }

  private emitAnnotationChange(): void {
    // Emit event for annotation changes
    const event = new CustomEvent("annotationsChanged", {
      detail: { annotations: this.annotations },
    });
    window.dispatchEvent(event);
  }

  // Public methods
  getAnnotations(): Annotation[] {
    return [...this.annotations];
  }

  getAnnotationsByPage(pageNumber: number): Annotation[] {
    return this.annotations.filter((ann) => ann.page === pageNumber);
  }

  addAnnotation(annotation: Annotation): void {
    this.annotations.push(annotation);
    this.emitAnnotationChange();
  }

  removeAnnotation(annotationId: string): void {
    const annotation = this.annotations.find((ann) => ann.id === annotationId);
    if (annotation && this.canvas) {
      this.canvas.remove(annotation.object);
      this.annotations = this.annotations.filter(
        (ann) => ann.id !== annotationId
      );
      this.emitAnnotationChange();
    }
  }

  updateAnnotation(annotationId: string, updates: Partial<Annotation>): void {
    const index = this.annotations.findIndex((ann) => ann.id === annotationId);
    if (index !== -1) {
      this.annotations[index] = { ...this.annotations[index], ...updates };
      this.emitAnnotationChange();
    }
  }

  clearAnnotations(): void {
    if (this.canvas) {
      this.canvas.clear();
    }
    this.annotations = [];
    this.emitAnnotationChange();
  }

  loadAnnotations(annotations: Annotation[]): void {
    this.annotations = annotations;

    if (this.canvas) {
      this.canvas.clear();

      annotations.forEach((annotation) => {
        fabric.util.enlivenObjects(
          [annotation.data],
          (objects: fabric.Object[]) => {
            objects.forEach((obj) => {
              obj.id = annotation.id;
              this.canvas!.add(obj);
            });
          }
        );
      });
    }

    this.emitAnnotationChange();
  }

  saveAnnotations(): string {
    const annotationsData = this.annotations.map((ann) => ({
      id: ann.id,
      type: ann.type,
      page: ann.page,
      data: ann.data,
      createdAt: ann.createdAt.toISOString(),
      modifiedAt: ann.modifiedAt.toISOString(),
    }));

    return JSON.stringify(annotationsData);
  }

  updateDrawingSettings(settings: Partial<typeof this.drawingSettings>): void {
    this.drawingSettings = { ...this.drawingSettings, ...settings };

    if (this.canvas && this.currentTool === ToolType.DRAW) {
      this.canvas.freeDrawingBrush.width = this.drawingSettings.width;
      this.canvas.freeDrawingBrush.color = this.drawingSettings.color;
    }
  }

  getDrawingSettings() {
    return { ...this.drawingSettings };
  }

  destroy(): void {
    if (this.canvas) {
      this.canvas.off("mouse:down");
      this.canvas.off("mouse:move");
      this.canvas.off("mouse:up");
      this.canvas.off("object:added");
      this.canvas.off("object:modified");
      this.canvas.off("object:removed");
    }
    this.annotations = [];
    this.canvas = null;
  }
}

export default AnnotationManager;
