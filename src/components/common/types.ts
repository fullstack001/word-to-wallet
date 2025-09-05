export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

export interface MultiFileUploadSectionProps {
  acceptType?: string;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  onFilesChange: (files: UploadedFile[]) => void;
  actionButtonText?: string;
  onActionButtonClick?: () => void;
  actionButtonDisabled?: boolean;
  dropText?: string;
  uploadText?: string;
} 