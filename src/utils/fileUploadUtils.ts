import { v4 as uuidv4 } from 'uuid';

export interface UploadedFile {
  id: string;
  originalName: string;
  fileName: string;
  filePath: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

class FileUploadManager {
  private uploadedFiles: Map<string, UploadedFile> = new Map();

  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<UploadedFile> {
    const fileId = uuidv4();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${fileId}.${fileExtension}`;
    const filePath = `/uploads/${fileName}`;

    console.log('Starting upload for file:', file.name, 'with ID:', fileId);

    // Create FormData to send file to server
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('fileId', fileId);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const progressPercent = Math.round((event.loaded / event.total) * 100);
          onProgress(progressPercent);
        }
      });

      // Handle response
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const responseData = JSON.parse(xhr.responseText);
            console.log('Upload response:', responseData);

            if (!responseData.success) {
              console.error('Server reported upload failure:', responseData);
              reject(new Error(responseData.error || 'Upload failed on server'));
              return;
            }

            const uploadedFile: UploadedFile = {
              id: fileId,
              originalName: file.name,
              fileName,
              filePath,
              size: file.size,
              type: file.type,
              uploadedAt: new Date(),
            };

            this.uploadedFiles.set(fileId, uploadedFile);
            console.log('File uploaded successfully:', uploadedFile);
            resolve(uploadedFile);
          } catch (error) {
            console.error('Error parsing response:', error, 'Response text:', xhr.responseText);
            reject(new Error('Failed to parse upload response'));
          }
        } else {
          console.error('Upload response not ok:', xhr.status, xhr.responseText);
          reject(
            new Error(
              `Failed to upload file: ${xhr.status} - ${xhr.responseText}`
            )
          );
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        console.error('Upload error:', xhr.statusText);
        reject(new Error('Network error during upload'));
      });

      xhr.addEventListener('abort', () => {
        console.error('Upload aborted');
        reject(new Error('Upload was aborted'));
      });

      // Send the request
      xhr.open('POST', '/api/upload');
      xhr.send(formData);
    });
  }

  getFile(fileId: string): UploadedFile | undefined {
    return this.uploadedFiles.get(fileId);
  }

  async deleteFile(fileId: string): Promise<void> {
    const file = this.uploadedFiles.get(fileId);
    if (!file) {
      console.log('File not found for deletion:', fileId);
      return;
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName: file.fileName }),
      });

      if (!response.ok) {
        console.error('Failed to delete file from server:', response.status);
      } else {
        console.log('File deleted from server successfully');
      }

      this.uploadedFiles.delete(fileId);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  cleanupAllFiles(): Promise<void[]> {
    const deletePromises = Array.from(this.uploadedFiles.keys()).map(fileId =>
      this.deleteFile(fileId)
    );
    return Promise.all(deletePromises);
  }

  getAllFiles(): UploadedFile[] {
    return Array.from(this.uploadedFiles.values());
  }
}

export const fileUploadManager = new FileUploadManager(); 