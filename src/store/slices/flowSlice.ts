import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FileState {
  fileName: string;
  plan: string | null;
  action: string | null;
  editedPdfData: string | null; // Store as base64 string instead of Blob
  editedPdfFileName: string;
  editedPdfConverter: string | null;
  pdfFileData: string | null; // Store the file data as base64 string instead of ArrayBuffer
  pdfFileName: string; // Store the file name separately
}

const initialState: FileState = {
  fileName: "",
  plan: null,
  action: null,
  editedPdfData: null,
  editedPdfFileName: "",
  editedPdfConverter: null,
  pdfFileData: null,
  pdfFileName: "",
};

const flowSlice = createSlice({
  name: "flow",
  initialState,
  reducers: {
    setFileName(state, action: PayloadAction<string>) {
      state.fileName = action.payload;
    },
    setPlan(state, action: PayloadAction<string>) {
      state.plan = action.payload; // Update the plan in the global store
    },
    setAction(state, action: PayloadAction<string>) {
      state.action = action.payload;
    },
    setEditedPdf(
      state,
      action: PayloadAction<{
        [x: string]: string | null;
        data: string;
        fileName: string;
      }>
    ) {
      state.editedPdfData = action.payload.data;
      state.editedPdfFileName = action.payload.fileName;
      state.editedPdfConverter = action.payload.converter;
    },
    setPdfFile(state, action: PayloadAction<{ data: string; name: string }>) {
      state.pdfFileData = action.payload.data;
      state.pdfFileName = action.payload.name;
    },
    clearEditedPdf(state) {
      state.editedPdfData = null;
      state.editedPdfFileName = "";
      state.editedPdfConverter = null;
      state.pdfFileData = null;
      state.pdfFileName = "";
    },
    clearFlow(state) {
      state.fileName = "";
      state.plan = null;
      state.action = null;
      state.editedPdfData = null;
      state.editedPdfFileName = "";
      state.editedPdfConverter = null;
      state.pdfFileData = null;
      state.pdfFileName = "";
    },
  },
});

export const {
  setFileName,
  setPlan,
  setAction,
  setEditedPdf,
  setPdfFile,
  clearEditedPdf,
  clearFlow,
} = flowSlice.actions;
export default flowSlice.reducer;
