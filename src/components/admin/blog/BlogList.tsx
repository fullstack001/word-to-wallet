"use client";

import React, { useState, useEffect } from "react";
import { BlogService, Blog } from "@/services/blogService";
import { useLocalizedNavigation } from "@/utils/navigation";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Calendar,
  User,
  Tag,
  Loader2,
} from "lucide-react";

export default function BlogList() {
  const { navigate } = useLocalizedNavigation();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published">("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadBlogs();
  }, [page, statusFilter, searchQuery]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      setError("");

      const params: any = {
        page,
        limit: 10,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      const response = await BlogService.getBlogs(params);
      setBlogs(response.blogs);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      setDeletingId(id);
      await BlogService.deleteBlog(id);
      loadBlogs();
    } catch (err: any) {
      alert(err.message || "Failed to delete blog");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blogs</h1>
          <p className="text-gray-600 mt-1">Manage your blog posts</p>
        </div>
        <button
          onClick={() => navigate("/admin/blogs/new")}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>New Blog</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search blogs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as any);
                setPage(1);
              }}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600">No blogs found</p>
          <button
            onClick={() => navigate("/admin/blogs/new")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Your First Blog
          </button>
        </div>
      ) : (
        <>
          {/* Blog List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {blog.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            blog.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {blog.status}
                        </span>
                      </div>

                      {blog.excerpt && (
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {blog.excerpt}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>
                            {blog.author.firstName} {blog.author.lastName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(blog.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{blog.views} views</span>
                        </div>
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Tag className="w-4 h-4" />
                            <div className="flex space-x-1">
                              {blog.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                              {blog.tags.length > 3 && (
                                <span className="text-xs">+{blog.tags.length - 3}</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => navigate(`/admin/blogs/${blog._id}/edit`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        disabled={deletingId === blog._id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === blog._id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700">
                Page {page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= pagination.pages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

