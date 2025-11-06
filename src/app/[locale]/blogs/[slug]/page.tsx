"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { BlogService, Blog, Reaction } from "@/services/blogService";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useLocalizedNavigation } from "@/utils/navigation";
import CommentSection from "@/components/blog/CommentSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Heart,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Calendar,
  User,
  Tag,
  ArrowLeft,
  Share2,
  Loader2,
  LayoutDashboard,
} from "lucide-react";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { navigate } = useLocalizedNavigation();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [reaction, setReaction] = useState<Reaction>({
    reacted: false,
    type: null,
  });
  const [loading, setLoading] = useState(true);
  const [reacting, setReacting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBlog();
  }, [slug]);

  useEffect(() => {
    if (blog) {
      loadRelatedBlogs();
      if (isLoggedIn) {
        loadUserReaction();
      }
    }
  }, [blog, isLoggedIn]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      setError("");
      const blogData = await BlogService.getBlogById(slug, true);
      setBlog(blogData);
    } catch (err: any) {
      setError(err.message || "Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedBlogs = async () => {
    if (!blog) return;
    try {
      const related = await BlogService.getRelatedBlogs(blog._id);
      setRelatedBlogs(related);
    } catch (err) {
      // Silent fail for related blogs
      console.error("Failed to load related blogs:", err);
    }
  };

  const loadUserReaction = async () => {
    if (!blog) return;
    try {
      const userReaction = await BlogService.getUserReaction(blog._id);
      setReaction(userReaction);
    } catch (err) {
      // Silent fail for user reaction
      console.error("Failed to load user reaction:", err);
    }
  };

  const handleReaction = async (
    type: "like" | "love" | "thumbsup" | "thumbsdown"
  ) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!blog) return;

    try {
      setReacting(true);
      const result = await BlogService.toggleReaction(blog._id, type);
      setReaction(result.data);

      // Update blog reactions count
      if (result.data.reacted) {
        setBlog({ ...blog, reactionsCount: blog.reactionsCount + 1 });
      } else if (reaction.reacted) {
        setBlog({
          ...blog,
          reactionsCount: Math.max(0, blog.reactionsCount - 1),
        });
      }
    } catch (err: any) {
      alert(err.message || "Failed to react");
    } finally {
      setReacting(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt || "",
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Blog not found"}</p>
            <button
              onClick={() => navigate("/blogs")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Blogs
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white pt-32 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-blue-700/90 to-indigo-800/90"></div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <button
              onClick={() => navigate("/blogs")}
              className="group flex items-center space-x-2 px-4 py-2 text-white hover:text-blue-200 rounded-lg hover:bg-white/20 backdrop-blur-sm transition-all duration-200 border border-white/30"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Blogs</span>
            </button>
            {isLoggedIn && (
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center space-x-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-200 whitespace-nowrap shadow-lg hover:shadow-xl hover:scale-105 font-semibold backdrop-blur-md border border-white/30 hover:border-white/50"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Go to Dashboard</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Title Section */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
            <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
              <User className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-gray-700">
                {blog.author.firstName} {blog.author.lastName}
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">
                {formatDate(blog.publishedAt || blog.createdAt)}
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-full">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span className="font-semibold text-gray-700">
                {blog.reactionsCount || 0}
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-full">
              <MessageCircle className="w-4 h-4 text-purple-500" />
              <span className="font-semibold text-gray-700">
                {blog.commentsCount || 0}
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed font-light">
              {blog.excerpt}
            </p>
          )}

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-8">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Reactions */}
          <div className="flex items-center space-x-4 mb-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => handleReaction("like")}
              disabled={reacting}
              className={`group flex items-center space-x-2 px-6 py-3 rounded-xl border-2 transition-all duration-200 ${
                reaction.reacted && reaction.type === "like"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-lg shadow-blue-500/50"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400 hover:scale-105"
              }`}
            >
              <ThumbsUp className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Like</span>
            </button>
            <button
              onClick={() => handleReaction("love")}
              disabled={reacting}
              className={`group flex items-center space-x-2 px-6 py-3 rounded-xl border-2 transition-all duration-200 ${
                reaction.reacted && reaction.type === "love"
                  ? "bg-gradient-to-r from-red-600 to-pink-600 text-white border-red-600 shadow-lg shadow-red-500/50"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-red-50 hover:border-red-400 hover:scale-105"
              }`}
            >
              <Heart
                className={`w-5 h-5 group-hover:scale-110 transition-transform ${
                  reaction.reacted && reaction.type === "love"
                    ? "fill-current"
                    : ""
                }`}
              />
              <span className="font-semibold">Love</span>
            </button>
            <button
              onClick={handleShare}
              className="group flex items-center space-x-2 px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:scale-105 transition-all duration-200 font-semibold"
            >
              <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Share</span>
            </button>
          </div>
        </header>

        {/* Featured Image and Content Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-16">
          {/* Featured Image */}
          {blog.featuredImage && (
            <div className="relative w-full h-[500px] overflow-hidden ">
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="max-w-full max-h-full object-contain mx-auto"
                width={100}
                height={100}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8 md:p-12">
            <div
              className="blog-content prose prose-lg prose-blue max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mt-8 prose-headings:mb-4 prose-h1:text-4xl prose-h1:font-extrabold prose-h1:leading-tight prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-2xl prose-h3:font-bold prose-h3:mt-8 prose-h3:mb-3 prose-h4:text-xl prose-h4:font-semibold prose-h4:mt-6 prose-h4:mb-2 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-strong:text-gray-900 prose-strong:font-bold prose-em:text-gray-700 prose-em:italic prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-6 prose-ul:space-y-2 prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-6 prose-ol:space-y-2 prose-li:text-gray-700 prose-li:leading-relaxed prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 prose-blockquote:my-6 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-6 prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8 prose-img:mx-auto prose-hr:border-gray-300 prose-hr:my-8 prose-table:w-full prose-table:my-6 prose-table:border-collapse prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2 prose-figcaption:text-sm prose-figcaption:text-gray-500 prose-figcaption:italic prose-figcaption:mt-2 prose-figcaption:text-center"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-20 pt-12 border-t-2 border-gray-200">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <CommentSection blogId={blog._id} />
          </div>
        </div>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <div className="mt-20 pt-12 border-t-2 border-gray-200">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">
              Related Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedBlogs.map((relatedBlog) => (
                <article
                  key={relatedBlog._id}
                  onClick={() => navigate(`/blogs/${relatedBlog.slug}`)}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                >
                  {relatedBlog.featuredImage && (
                    <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <img
                        src={relatedBlog.featuredImage}
                        alt={relatedBlog.title}
                        className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {relatedBlog.title}
                    </h3>
                    {relatedBlog.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                        {relatedBlog.excerpt}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 font-medium">
                      {formatDate(
                        relatedBlog.publishedAt || relatedBlog.createdAt
                      )}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </article>
      <Footer />
    </div>
  );
}
