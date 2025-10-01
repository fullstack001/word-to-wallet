// Utility functions for handling images and media

/**
 * Get the full API URL for course cover images
 */
export function getCourseCoverUrl(courseId: string): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";
  return `${baseUrl}/courses/${courseId}/cover`;
}

/**
 * Get the full API URL for multimedia files
 */
export function getMultimediaUrl(
  courseId: string,
  type: string,
  filename: string
): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";
  return `${baseUrl}/courses/${courseId}/multimedia/${type}/${filename}`;
}

/**
 * Check if a course has a cover image
 */
export function hasCourseCover(course: { epubCover?: string }): boolean {
  return Boolean(course.epubCover && course.epubCover.trim() !== "");
}

/**
 * Get fallback icon HTML for course covers
 */
export function getCourseCoverFallback(): string {
  return `
    <div class="w-full h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
      </svg>
    </div>
  `;
}

/**
 * Handle image loading errors with fallback
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>
): void {
  const target = event.target as HTMLImageElement;
  target.style.display = "none";
  const parent = target.parentElement;
  if (parent) {
    parent.innerHTML = getCourseCoverFallback();
  }
}
