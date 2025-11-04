"use client";

import React, { useState, useEffect } from "react";
import { BlogService, Comment } from "@/services/blogService";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Heart, MessageCircle, ThumbsUp, Loader2 } from "lucide-react";
import { useLocalizedNavigation } from "@/utils/navigation";

interface CommentSectionProps {
  blogId: string;
}

export default function CommentSection({ blogId }: CommentSectionProps) {
  const { navigate } = useLocalizedNavigation();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.user);

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [anonymousName, setAnonymousName] = useState("");
  const [anonymousEmail, setAnonymousEmail] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyAnonymousName, setReplyAnonymousName] = useState("");
  const [replyAnonymousEmail, setReplyAnonymousEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadComments();
  }, [blogId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await BlogService.getComments(blogId);
      setComments(response.comments);
    } catch (err: any) {
      setError(err.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      return;
    }

    // Validate anonymous fields if not logged in
    if (!isLoggedIn) {
      if (!anonymousName.trim()) {
        setError("Name is required");
        return;
      }
      if (!anonymousEmail.trim()) {
        setError("Email is required");
        return;
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(anonymousEmail)) {
        setError("Please enter a valid email address");
        return;
      }
    }

    try {
      setSubmitting(true);
      setError("");
      const commentData: any = { content: newComment };
      
      if (!isLoggedIn) {
        commentData.anonymousName = anonymousName.trim();
        commentData.anonymousEmail = anonymousEmail.trim();
      }

      await BlogService.createComment(blogId, commentData);
      setNewComment("");
      setAnonymousName("");
      setAnonymousEmail("");
      loadComments();
    } catch (err: any) {
      setError(err.message || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) {
      return;
    }

    // Validate anonymous fields if not logged in
    if (!isLoggedIn) {
      if (!replyAnonymousName.trim()) {
        setError("Name is required");
        return;
      }
      if (!replyAnonymousEmail.trim()) {
        setError("Email is required");
        return;
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(replyAnonymousEmail)) {
        setError("Please enter a valid email address");
        return;
      }
    }

    try {
      setSubmitting(true);
      setError("");
      const replyData: any = {
        content: replyContent,
        parent: parentId,
      };

      if (!isLoggedIn) {
        replyData.anonymousName = replyAnonymousName.trim();
        replyData.anonymousEmail = replyAnonymousEmail.trim();
      }

      await BlogService.createComment(blogId, replyData);
      setReplyContent("");
      setReplyAnonymousName("");
      setReplyAnonymousEmail("");
      setReplyingTo(null);
      loadComments();
    } catch (err: any) {
      setError(err.message || "Failed to post reply");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleLike = async (commentId: string) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    try {
      await BlogService.toggleCommentLike(commentId);
      loadComments();
    } catch (err: any) {
      setError(err.message || "Failed to like comment");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderComment = (comment: Comment, level = 0) => {
    const isLiked = comment.likedBy?.includes(user?._id || "");
    const isReply = level > 0;
    const isAnonymous = !comment.user;
    const displayName = comment.user
      ? `${comment.user.firstName} ${comment.user.lastName}`
      : comment.anonymousName || "Anonymous";
    const initials = comment.user
      ? `${comment.user.firstName[0]}${comment.user.lastName[0]}`
      : comment.anonymousName
      ? comment.anonymousName.substring(0, 2).toUpperCase()
      : "AN";

    return (
      <div
        key={comment._id}
        className={`${isReply ? "ml-8 mt-4" : ""} ${
          level === 0 ? "border-b border-gray-200 pb-4 mb-4" : ""
        }`}
      >
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 font-semibold">{initials}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-semibold text-gray-900">{displayName}</span>
              {isAnonymous && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                  Guest
                </span>
              )}
              <span className="text-sm text-gray-500">
                {formatDate(comment.createdAt)}
              </span>
            </div>
            <p className="text-gray-700 mb-2 whitespace-pre-wrap">
              {comment.content}
            </p>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleToggleLike(comment._id)}
                className={`flex items-center space-x-1 text-sm ${
                  isLiked ? "text-red-600" : "text-gray-500 hover:text-red-600"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                />
                <span>{comment.likes || 0}</span>
              </button>
              {!isReply && (
                <button
                  onClick={() =>
                    setReplyingTo(
                      replyingTo === comment._id ? null : comment._id
                    )
                  }
                  className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Reply</span>
                </button>
              )}
            </div>

            {/* Reply Form */}
            {replyingTo === comment._id && (
              <div className="mt-4 space-y-2">
                {!isLoggedIn && (
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input
                      type="text"
                      value={replyAnonymousName}
                      onChange={(e) => setReplyAnonymousName(e.target.value)}
                      placeholder="Your name"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <input
                      type="email"
                      value={replyAnonymousEmail}
                      onChange={(e) => setReplyAnonymousEmail(e.target.value)}
                      placeholder="Your email"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                )}
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSubmitReply(comment._id)}
                    disabled={submitting || !replyContent.trim()}
                    className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Post Reply"
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent("");
                      setReplyAnonymousName("");
                      setReplyAnonymousEmail("");
                    }}
                    className="px-4 py-1.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4">
                {comment.replies.map((reply) => renderComment(reply, level + 1))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">
        Comments ({comments.length})
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* New Comment Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        {!isLoggedIn && (
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              value={anonymousName}
              onChange={(e) => setAnonymousName(e.target.value)}
              placeholder="Your name *"
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="email"
              value={anonymousEmail}
              onChange={(e) => setAnonymousEmail(e.target.value)}
              placeholder="Your email *"
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="mt-3 flex items-center justify-end">
          <button
            onClick={handleSubmitComment}
            disabled={submitting || !newComment.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4" />
                <span>Post Comment</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => renderComment(comment))}
        </div>
      )}
    </div>
  );
}

