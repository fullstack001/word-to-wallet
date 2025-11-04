"use client";

import React, { useState, useEffect } from "react";
import { BlogService, Blog } from "@/services/blogService";
import { useLocalizedNavigation } from "@/utils/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Search,
  Calendar,
  User,
  Tag,
  Heart,
  MessageCircle,
  ArrowRight,
  Loader2,
  LayoutDashboard,
} from "lucide-react";

export default function BlogsPage() {
  const { navigate } = useLocalizedNavigation();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    loadBlogs();
    loadRecentBlogs();
  }, [page, selectedTag, searchQuery]);

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

      if (selectedTag) {
        params.tag = selectedTag;
      }

      const response = await BlogService.getPublishedBlogs(params);
      setBlogs(response.blogs);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const loadRecentBlogs = async () => {
    try {
      const recent = await BlogService.getRecentBlogs(5);
      setRecentBlogs(recent);
    } catch (err) {
      // Silent fail for recent blogs
      console.error("Failed to load recent blogs:", err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Extract unique tags from all blogs
  const allTags = Array.from(new Set(blogs.flatMap((blog) => blog.tags || [])));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white pt-32 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-blue-700/90 to-indigo-800/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
                Blog
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 font-light max-w-2xl">
                Discover insights, stories, and updates from our community
              </p>
            </div>
            {isLoggedIn && (
              <button
                onClick={() => navigate("/dashboard")}
                className="group flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 backdrop-blur-md border border-white/30 hover:border-white/50 hover:scale-105 whitespace-nowrap shadow-lg hover:shadow-xl"
              >
                <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-semibold">Go to Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Search */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search blogs..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/50 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">
                  Filter by Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedTag === null
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50 scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                    }`}
                  >
                    All
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSelectedTag(selectedTag === tag ? null : tag);
                        setPage(1);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedTag === tag
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50 scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Blog List */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading blogs...</p>
                </div>
              </div>
            ) : blogs.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-16 text-center">
                <div className="max-w-md mx-auto">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No blogs found</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Try adjusting your search or filters
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {blogs.map((blog, index) => (
                  <article
                    key={blog._id}
                    className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/blogs/${blog.slug}`)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {blog.featuredImage && (
                      <div className="relative h-72 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <img
                          src={blog.featuredImage}
                          alt={blog.title}
                          className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-8">
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-full">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">
                            {blog.author.firstName} {blog.author.lastName}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-full">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>
                            {formatDate(blog.publishedAt || blog.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 bg-red-50 px-3 py-1.5 rounded-full">
                          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                          <span className="font-medium">
                            {blog.reactionsCount || 0}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1.5 rounded-full">
                          <MessageCircle className="w-4 h-4 text-purple-500" />
                          <span className="font-medium">
                            {blog.commentsCount || 0}
                          </span>
                        </div>
                      </div>

                      <h2 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {blog.title}
                      </h2>

                      {blog.excerpt && (
                        <p className="text-gray-600 mb-5 line-clamp-3 text-lg leading-relaxed">
                          {blog.excerpt}
                        </p>
                      )}

                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {blog.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-xs font-semibold border border-blue-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/blogs/${blog.slug}`);
                        }}
                        className="group/btn inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                      >
                        <span>Read more</span>
                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center space-x-3 pt-8">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:border-blue-500 hover:text-blue-600 transition-all duration-200 font-semibold bg-white/80 backdrop-blur-sm"
                >
                  Previous
                </button>
                <div className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg">
                  Page {page} of {pagination.pages}
                </div>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= pagination.pages}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:border-blue-500 hover:text-blue-600 transition-all duration-200 font-semibold bg-white/80 backdrop-blur-sm"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recent Blogs */}
            {recentBlogs.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-100">
                  Recent Posts
                </h3>
                <div className="space-y-5">
                  {recentBlogs.map((blog) => (
                    <div
                      key={blog._id}
                      onClick={() => navigate(`/blogs/${blog.slug}`)}
                      className="cursor-pointer group p-3 rounded-xl hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-200"
                    >
                      <h4 className="font-bold text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {blog.title}
                      </h4>
                      <p className="text-xs text-gray-500 font-medium">
                        {formatDate(blog.publishedAt || blog.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
