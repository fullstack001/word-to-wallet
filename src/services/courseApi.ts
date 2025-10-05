import { api } from "./api";

// Types
export interface Subject {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  uploadedAt: string;
  file?: File;
}

export interface MultimediaContent {
  images: MediaFile[];
  audio: MediaFile[];
  video: MediaFile[];
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  content: string;
}

export interface Course {
  _id: string;
  title: string;
  description?: string;
  subject: string | Subject;
  epubFile?: string;
  epubCover?: string;
  epubMetadata?: {
    title: string;
    author: string;
    publisher?: string;
    language: string;
    description?: string;
    coverImage?: string;
    totalPages?: number;
    fileSize?: number;
    lastModified?: string;
  };
  chapters?: Chapter[];
  thumbnail?: string;
  multimediaContent?: MultimediaContent;
  isActive: boolean;
  isPublished: boolean;
  googleDocLink?: string;
  googleClassroomLink?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubjectData {
  name: string;
  description?: string;
}

export interface UpdateSubjectData {
  name?: string;
  description?: string;
  isActive?: boolean;
}

export interface CreateCourseData {
  title: string;
  description?: string;
  subject: string;
  chapters: Chapter[];
  cover?: File;
  audio?: File[];
  video?: File[];
  isActive?: boolean;
  isPublished?: boolean;
  googleDocLink?: string;
  googleClassroomLink?: string;
}

export interface UpdateCourseData {
  title?: string;
  description?: string;
  subject?: string;
  chapters?: Chapter[];
  multimediaContent?: {
    audio?: MediaFile[];
    video?: MediaFile[];
  };
  isActive?: boolean;
  isPublished?: boolean;
  googleDocLink?: string;
  googleClassroomLink?: string;
}

export interface GenerateContentRequest {
  title: string;
  description: string;
  courseTitle?: string;
  subjectName?: string;
}

export interface GenerateContentResponse {
  success: boolean;
  message: string;
  data: {
    content: string;
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };
}

// Course API service
export const courseApi = {
  // Subject management
  subjects: {
    // Get all subjects
    getAll: async (): Promise<Subject[]> => {
      const response = await api.get("/subjects");
      return response.data;
    },

    // Get subject by ID
    getById: async (id: string): Promise<Subject> => {
      const response = await api.get(`/subjects/${id}`);
      return response.data;
    },

    // Create subject
    create: async (data: CreateSubjectData): Promise<Subject> => {
      const response = await api.post("/subjects", data);
      return response.data;
    },

    // Update subject
    update: async (id: string, data: UpdateSubjectData): Promise<Subject> => {
      const response = await api.put(`/subjects/${id}`, data);
      return response.data;
    },

    // Delete subject
    delete: async (id: string): Promise<void> => {
      await api.delete(`/subjects/${id}`);
    },

    // Toggle subject status
    toggleStatus: async (id: string): Promise<Subject> => {
      const response = await api.patch(`/subjects/${id}/toggle-status`);
      return response.data;
    },
  },

  // Course management
  courses: {
    // Get all courses
    getAll: async (): Promise<Course[]> => {
      const response = await api.get("/courses");
      return response.data;
    },

    // Get course by ID
    getById: async (id: string): Promise<Course> => {
      const response = await api.get(`/courses/id/${id}`);
      return response.data;
    },

    // Create course
    create: async (data: CreateCourseData): Promise<Course> => {
      const formData = new FormData();

      // Add text fields
      formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      formData.append("subject", data.subject);
      formData.append("chapters", JSON.stringify(data.chapters));
      formData.append("isActive", String(data.isActive ?? true));
      formData.append("isPublished", String(data.isPublished ?? false));
      if (data.googleDocLink)
        formData.append("googleDocLink", data.googleDocLink);
      if (data.googleClassroomLink)
        formData.append("googleClassroomLink", data.googleClassroomLink);

      // Add cover image if present
      if (data.cover) {
        formData.append("cover", data.cover);
      }

      // Add audio files if present
      if (data.audio && data.audio.length > 0) {
        data.audio.forEach((file) => {
          formData.append("audio", file);
        });
      }

      // Add video files if present
      if (data.video && data.video.length > 0) {
        data.video.forEach((file) => {
          formData.append("video", file);
        });
      }

      const response = await api.upload("/courses", formData);
      return response.data;
    },

    // Update course
    update: async (
      id: string,
      data: UpdateCourseData & {
        epubCover?: File | null;
        audio?: File[];
        video?: File[];
      }
    ): Promise<Course> => {
      // Check if we have files to upload
      const hasFiles =
        data.epubCover ||
        (data.audio && data.audio.length > 0) ||
        (data.video && data.video.length > 0);

      if (hasFiles) {
        // Use FormData for file uploads
        const formData = new FormData();

        // Add text fields
        if (data.title) formData.append("title", data.title);
        if (data.description) formData.append("description", data.description);
        if (data.subject) formData.append("subject", data.subject);
        if (data.chapters)
          formData.append("chapters", JSON.stringify(data.chapters));
        if (data.multimediaContent)
          formData.append(
            "multimediaContent",
            JSON.stringify(data.multimediaContent)
          );
        if (data.isActive !== undefined)
          formData.append("isActive", String(data.isActive));
        if (data.isPublished !== undefined)
          formData.append("isPublished", String(data.isPublished));
        if (data.googleDocLink !== undefined)
          formData.append("googleDocLink", data.googleDocLink || "");
        if (data.googleClassroomLink !== undefined)
          formData.append(
            "googleClassroomLink",
            data.googleClassroomLink || ""
          );

        // Add cover image if present
        if (data.epubCover) {
          formData.append("epubCover", data.epubCover);
        }

        // Add audio files if present
        if (data.audio && data.audio.length > 0) {
          data.audio.forEach((file) => {
            formData.append("audio", file);
          });
        }

        // Add video files if present
        if (data.video && data.video.length > 0) {
          data.video.forEach((file) => {
            formData.append("video", file);
          });
        }

        const response = await api.upload(`/courses/${id}`, formData);
        return response.data;
      } else {
        // Use JSON for text-only updates
        const response = await api.put(`/courses/${id}`, data);
        return response.data;
      }
    },

    // Delete course
    delete: async (id: string): Promise<void> => {
      await api.delete(`/courses/${id}`);
    },

    // Toggle published status
    togglePublished: async (id: string): Promise<Course> => {
      const response = await api.patch(`/courses/${id}/toggle-published`);
      return response.data;
    },

    // Upload EPUB file
    uploadEpub: async (id: string, file: File): Promise<Course> => {
      const formData = new FormData();
      formData.append("epub", file);

      const response = await api.upload(`/courses/${id}/upload-epub`, formData);
      return response.data;
    },

    // Upload thumbnail
    uploadThumbnail: async (id: string, file: File): Promise<Course> => {
      const formData = new FormData();
      formData.append("thumbnail", file);

      const response = await api.upload(
        `/courses/${id}/upload-thumbnail`,
        formData
      );
      return response.data;
    },
  },

  // Content generation
  contentGeneration: {
    // Generate chapter content
    generateChapterContent: async (
      data: GenerateContentRequest
    ): Promise<GenerateContentResponse> => {
      const response = await api.post(
        "/content-generation/generate-chapter-content",
        data
      );
      return response.data;
    },

    // Get generation status
    getStatus: async (): Promise<{
      success: boolean;
      message: string;
      data: {
        available: boolean;
        models?: any[];
        recommended?: string;
        reason?: string;
      };
    }> => {
      const response = await api.get("/content-generation/models-status");
      return response.data;
    },
  },
};

export default courseApi;
