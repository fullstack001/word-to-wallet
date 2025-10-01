// Course-specific API utilities

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

export interface Subject {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Course {
  _id: string;
  title?: string;
  description?: string;
  subject?: {
    _id: string;
    name: string;
  };
  isPublished: boolean;
  isActive: boolean;
  createdAt: string;
  createdBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  epubCover?: string;
  chapters?: any[];
  progress?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * Fetch all active subjects
 */
export async function fetchSubjects(): Promise<Subject[]> {
  try {
    console.log("Fetching subjects from:", `${API_BASE_URL}/subjects/active`);
    const response = await fetch(`${API_BASE_URL}/subjects/active`);
    console.log("Subjects response status:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ApiResponse<Subject[]> = await response.json();
    console.log("Subjects data:", data);
    return data.data || [];
  } catch (error) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
}

/**
 * Fetch all published courses
 */
export async function fetchAllCourses(): Promise<Course[]> {
  try {
    console.log("Fetching courses from:", `${API_BASE_URL}/courses/published`);
    const response = await fetch(`${API_BASE_URL}/courses/published`);
    console.log("Courses response status:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ApiResponse<Course[]> = await response.json();
    console.log("Courses data:", data);
    return data.data || [];
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
}

/**
 * Fetch courses by subject
 */
export async function fetchCoursesBySubject(
  subjectId: string
): Promise<Course[]> {
  try {
    console.log(
      "Fetching courses by subject from:",
      `${API_BASE_URL}/courses/published?subject=${subjectId}`
    );
    const response = await fetch(
      `${API_BASE_URL}/courses/published?subject=${subjectId}`
    );
    console.log("Courses by subject response status:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ApiResponse<Course[]> = await response.json();
    console.log("Courses by subject data:", data);
    return data.data || [];
  } catch (error) {
    console.error("Error fetching courses by subject:", error);
    throw error;
  }
}
