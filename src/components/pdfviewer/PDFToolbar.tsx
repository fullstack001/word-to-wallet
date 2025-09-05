"use client";

import React, { useState } from "react";
import {
  MousePointer,
  Pen,
  Type,
  Highlighter,
  Stamp,
  Square,
  Eraser,
  ZoomIn,
  ZoomOut,
  Save,
  Upload,
  Trash2,
  Search,
  Download,
  Settings,
} from "lucide-react";
import { PDFToolbarProps, ToolType } from "./types";

const PDFToolbar: React.FC<PDFToolbarProps> = ({
  tool,
  onToolChange,
  onZoomChange,
  zoom,
  onSave,
  onLoad,
  onClear,
}) => {
  const [showStamps, setShowStamps] = useState(false);
  const [showShapes, setShowShapes] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const tools = [
    { type: ToolType.SELECT, icon: MousePointer, label: "Select" },
    { type: ToolType.DRAW, icon: Pen, label: "Draw" },
    { type: ToolType.TEXT, icon: Type, label: "Text" },
    { type: ToolType.HIGHLIGHT, icon: Highlighter, label: "Highlight" },
    { type: ToolType.STAMP, icon: Stamp, label: "Stamp" },
    { type: ToolType.SHAPE, icon: Square, label: "Shape" },
    { type: ToolType.ERASER, icon: Eraser, label: "Eraser" },
  ];

  const stamps = [
    {
      id: "1",
      name: "Approved",
      imageUrl: "/stamps/approved.png",
      category: "approval",
    },
    {
      id: "2",
      name: "Rejected",
      imageUrl: "/stamps/rejected.png",
      category: "approval",
    },
    {
      id: "3",
      name: "Draft",
      imageUrl: "/stamps/draft.png",
      category: "status",
    },
    {
      id: "4",
      name: "Confidential",
      imageUrl: "/stamps/confidential.png",
      category: "security",
    },
  ];

  const shapes = [
    { id: "1", name: "Rectangle", type: "rect", icon: Square },
    { id: "2", name: "Circle", type: "circle", icon: Square },
    { id: "3", name: "Line", type: "line", icon: Square },
    { id: "4", name: "Arrow", type: "arrow", icon: Square },
  ];

  const handleZoomIn = () => {
    onZoomChange(Math.min(zoom * 1.2, 5));
  };

  const handleZoomOut = () => {
    onZoomChange(Math.max(zoom / 1.2, 0.1));
  };

  const handleZoomReset = () => {
    onZoomChange(1);
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        {/* Tools Section */}
        <div className="flex items-center space-x-2">
          {tools.map((toolItem) => (
            <button
              key={toolItem.type}
              onClick={() => onToolChange(toolItem.type)}
              className={`p-2 rounded-lg transition-colors ${
                tool === toolItem.type
                  ? "bg-blue-100 text-blue-600 border border-blue-300"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
              title={toolItem.label}
            >
              <toolItem.icon size={20} />
            </button>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100"
            title="Zoom Out"
          >
            <ZoomOut size={20} />
          </button>

          <select
            value={Math.round(zoom * 100)}
            onChange={(e) => onZoomChange(parseInt(e.target.value) / 100)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value={10}>10%</option>
            <option value={25}>25%</option>
            <option value={50}>50%</option>
            <option value={75}>75%</option>
            <option value={100}>100%</option>
            <option value={125}>125%</option>
            <option value={150}>150%</option>
            <option value={200}>200%</option>
            <option value={300}>300%</option>
            <option value={400}>400%</option>
            <option value={500}>500%</option>
          </select>

          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100"
            title="Zoom In"
          >
            <ZoomIn size={20} />
          </button>

          <button
            onClick={handleZoomReset}
            className="px-3 py-2 text-sm bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Fit Page
          </button>
        </div>

        {/* File Operations */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onSave}
            className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"
            title="Save Annotations"
          >
            <Save size={20} />
          </button>

          <button
            onClick={onLoad}
            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
            title="Load Annotations"
          >
            <Upload size={20} />
          </button>

          <button
            onClick={onClear}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
            title="Clear All Annotations"
          >
            <Trash2 size={20} />
          </button>

          <button
            className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100"
            title="Export PDF"
          >
            <Download size={20} />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100"
            title="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Stamps Dropdown */}
      {showStamps && tool === ToolType.STAMP && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Stamps</h3>
          <div className="grid grid-cols-4 gap-2">
            {stamps.map((stamp) => (
              <button
                key={stamp.id}
                className="p-2 border border-gray-200 rounded hover:bg-gray-50"
                title={stamp.name}
              >
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <Stamp size={16} />
                </div>
                <p className="text-xs text-gray-600 mt-1">{stamp.name}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Shapes Dropdown */}
      {showShapes && tool === ToolType.SHAPE && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Shapes</h3>
          <div className="grid grid-cols-4 gap-2">
            {shapes.map((shape) => (
              <button
                key={shape.id}
                className="p-2 border border-gray-200 rounded hover:bg-gray-50"
                title={shape.name}
              >
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <shape.icon size={16} />
                </div>
                <p className="text-xs text-gray-600 mt-1">{shape.name}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Settings</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Drawing Color
              </label>
              <input
                type="color"
                defaultValue="#ff0000"
                className="w-full h-8 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Line Width
              </label>
              <input
                type="range"
                min="1"
                max="20"
                defaultValue="2"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Text Size
              </label>
              <select className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                <option value="12">12px</option>
                <option value="14">14px</option>
                <option value="16">16px</option>
                <option value="18">18px</option>
                <option value="20">20px</option>
                <option value="24">24px</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFToolbar;
