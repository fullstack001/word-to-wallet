import { apiClient } from "./api";

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  tags: string[];
  status: "draft" | "published";
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  views: number;
  reactionsCount: number;
  commentsCount: number;
  isActive: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
}

export interface Comment {
  _id: string;
  blog: string;
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  anonymousName?: string;
  anonymousEmail?: string;
  content: string;
  parent?: string | null;
  likes: number;
  likedBy: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

export interface Reaction {
  reacted: boolean;
  type: "like" | "love" | "thumbsup" | "thumbsdown" | null;
}

export interface BlogListResponse {
  blogs: Blog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CommentListResponse {
  comments: Comment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateBlogRequest {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  tags?: string[];
  status?: "draft" | "published";
}

export interface UpdateBlogRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  tags?: string[];
  status?: "draft" | "published";
}

export interface CreateCommentRequest {
  content: string;
  parent?: string;
  anonymousName?: string;
  anonymousEmail?: string;
}

export class BlogService {
  private static readonly API_BASE = "/blogs";

  /**
   * Get all blogs (Admin - includes drafts)
   */
  static async getBlogs(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: "draft" | "published";
    tag?: string;
    author?: string;
    sort?: string;
    order?: "asc" | "desc";
  }): Promise<BlogListResponse> {
    const response = await apiClient.get(this.API_BASE, { params });
    return {
      blogs: response.data.data || [],
      pagination: response.data.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },
    };
  }

  /**
   * Get published blogs (Public)
   */
  static async getPublishedBlogs(params?: {
    page?: number;
    limit?: number;
    search?: string;
    tag?: string;
    sort?: string;
    order?: "asc" | "desc";
  }): Promise<BlogListResponse> {
    const response = await apiClient.get(`${this.API_BASE}/published`, { params });
    return {
      blogs: response.data.data || [],
      pagination: response.data.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },
    };
  }

  /**
   * Get recent blogs
   */
  static async getRecentBlogs(limit = 5): Promise<Blog[]> {
    const response = await apiClient.get(`${this.API_BASE}/recent`, {
      params: { limit },
    });
    return response.data.data || [];
  }

  /**
   * Get blog by ID or slug
   */
  static async getBlogById(id: string, isPublic = false): Promise<Blog> {
    const endpoint = isPublic
      ? `${this.API_BASE}/${id}/public`
      : `${this.API_BASE}/${id}`;
    const response = await apiClient.get(endpoint);
    return response.data.data;
  }

  /**
   * Get related blogs
   */
  static async getRelatedBlogs(id: string, limit = 5): Promise<Blog[]> {
    const response = await apiClient.get(`${this.API_BASE}/${id}/related`, {
      params: { limit },
    });
    return response.data.data || [];
  }

  /**
   * Create blog (Admin only)
   */
  static async createBlog(
    data: CreateBlogRequest
  ): Promise<{ success: boolean; data: Blog; message: string }> {
    const response = await apiClient.post(this.API_BASE, data);
    return response.data;
  }

  /**
   * Update blog (Admin only)
   */
  static async updateBlog(
    id: string,
    data: UpdateBlogRequest
  ): Promise<{ success: boolean; data: Blog; message: string }> {
    const response = await apiClient.put(`${this.API_BASE}/${id}`, data);
    return response.data;
  }

  /**
   * Delete blog (Admin only)
   */
  static async deleteBlog(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`${this.API_BASE}/${id}`);
    return response.data;
  }

  /**
   * Increment blog views
   */
  static async incrementViews(
    blogId: string
  ): Promise<{ views: number }> {
    const response = await apiClient.post(
      `${this.API_BASE}/${blogId}/increment-views`
    );
    return response.data.data;
  }

  /**
   * Get comments for a blog
   */
  static async getComments(
    blogId: string,
    params?: { page?: number; limit?: number }
  ): Promise<CommentListResponse> {
    const response = await apiClient.get(`${this.API_BASE}/${blogId}/comments`, {
      params,
    });
    return {
      comments: response.data.data || [],
      pagination: response.data.pagination || {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
      },
    };
  }

  /**
   * Create comment
   */
  static async createComment(
    blogId: string,
    data: CreateCommentRequest
  ): Promise<{ success: boolean; data: Comment; message: string }> {
    const response = await apiClient.post(
      `${this.API_BASE}/${blogId}/comments`,
      data
    );
    return response.data;
  }

  /**
   * Update comment
   */
  static async updateComment(
    id: string,
    content: string
  ): Promise<{ success: boolean; data: Comment; message: string }> {
    const response = await apiClient.put(`${this.API_BASE}/comments/${id}`, {
      content,
    });
    return response.data;
  }

  /**
   * Delete comment
   */
  static async deleteComment(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`${this.API_BASE}/comments/${id}`);
    return response.data;
  }

  /**
   * Toggle like on comment
   */
  static async toggleCommentLike(
    id: string
  ): Promise<{ success: boolean; data: Comment; message: string }> {
    const response = await apiClient.post(`${this.API_BASE}/comments/${id}/like`);
    return response.data;
  }

  /**
   * Toggle reaction on blog
   */
  static async toggleReaction(
    blogId: string,
    type: "like" | "love" | "thumbsup" | "thumbsdown" = "like"
  ): Promise<{ success: boolean; data: Reaction; message: string }> {
    const response = await apiClient.post(`${this.API_BASE}/${blogId}/reactions`, {
      type,
    });
    return response.data;
  }

  /**
   * Get user's reaction on blog
   */
  static async getUserReaction(blogId: string): Promise<Reaction> {
    const response = await apiClient.get(`${this.API_BASE}/${blogId}/reactions/me`);
    return response.data.data;
  }

  /**
   * Get all reactions for a blog
   */
  static async getBlogReactions(blogId: string): Promise<{
    total: number;
    grouped: Record<string, number>;
    reactions: Array<{
      type: string;
      user: { _id: string; firstName: string; lastName: string; email: string };
      createdAt: string;
    }>;
  }> {
    const response = await apiClient.get(`${this.API_BASE}/${blogId}/reactions`);
    return response.data.data;
  }
}

