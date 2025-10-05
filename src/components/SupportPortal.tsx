"use client";

import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  MessageCircle,
  Search,
  Plus,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Calendar,
  Tag,
  Send,
  FileText,
  BookOpen,
  Download,
  ExternalLink,
} from "lucide-react";

interface SupportPortalProps {
  userId: string;
}

interface SupportTicket {
  _id: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category: "technical" | "billing" | "general" | "feature_request";
  userEmail: string;
  userName?: string;
  bookId?: string;
  deliveryLinkId?: string;
  landingPageId?: string;
  attachments?: string[];
  responses: Array<{
    _id: string;
    message: string;
    isFromUser: boolean;
    createdAt: string;
    attachments?: string[];
  }>;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  viewCount: number;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

const SupportPortal: React.FC<SupportPortalProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<"tickets" | "faq" | "new_ticket">(
    "tickets"
  );
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
    category: "general" as const,
    priority: "medium" as const,
    userEmail: "",
    userName: "",
  });
  const [newResponse, setNewResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchSupportData();
  }, [userId]);

  const fetchSupportData = async () => {
    setLoading(true);
    try {
      // Fetch support tickets
      const ticketsResponse = await fetch("/api/support/tickets");
      if (ticketsResponse.ok) {
        const ticketsResult = await ticketsResponse.json();
        setTickets(ticketsResult.data.tickets || []);
      }

      // Fetch FAQs
      const faqsResponse = await fetch("/api/support/faqs");
      if (faqsResponse.ok) {
        const faqsResult = await faqsResponse.json();
        setFaqs(faqsResult.data.faqs || []);
      }
    } catch (error) {
      console.error("Error fetching support data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTicket),
      });

      if (response.ok) {
        const result = await response.json();
        setTickets((prev) => [result.data, ...prev]);
        setNewTicket({
          subject: "",
          description: "",
          category: "general",
          priority: "medium",
          userEmail: "",
          userName: "",
        });
        setActiveTab("tickets");
        alert("Support ticket created successfully!");
      } else {
        const error = await response.json();
        alert(`Error creating ticket: ${error.message}`);
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to create support ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddResponse = async (ticketId: string) => {
    if (!newResponse.trim()) {
      alert("Please enter a response");
      return;
    }

    try {
      const response = await fetch(
        `/api/support/tickets/${ticketId}/responses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: newResponse }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        setTickets((prev) =>
          prev.map((ticket) =>
            ticket._id === ticketId
              ? { ...ticket, responses: [...ticket.responses, result.data] }
              : ticket
          )
        );
        setNewResponse("");
        if (selectedTicket?._id === ticketId) {
          setSelectedTicket((prev) =>
            prev
              ? {
                  ...prev,
                  responses: [...prev.responses, result.data],
                }
              : null
          );
        }
      } else {
        const error = await response.json();
        alert(`Error adding response: ${error.message}`);
      }
    } catch (error) {
      console.error("Error adding response:", error);
      alert("Failed to add response");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || ticket.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || ticket.category === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const renderTickets = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Support Tickets</h2>
          <p className="text-gray-600 mt-1">
            Manage and respond to reader support requests
          </p>
        </div>
        <button
          onClick={() => setActiveTab("new_ticket")}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Ticket</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="general">General</option>
              <option value="feature_request">Feature Request</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <tr key={ticket._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {ticket.subject}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {ticket.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        ticket.status
                      )}`}
                    >
                      {ticket.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {ticket.category.replace("_", " ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {ticket.userName || "Anonymous"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {ticket.userEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(ticket.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFAQ = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 mt-1">
          Common questions and answers from readers
        </p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFaqs.map((faq) => (
          <div key={faq._id} className="bg-white p-6 rounded-lg border">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {faq.question}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{faq.viewCount} views</span>
                <span>•</span>
                <span>{faq.helpfulCount} helpful</span>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{faq.answer}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {faq.category}
                </span>
                {faq.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                Updated {formatDate(faq.updatedAt)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNewTicket = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Create Support Ticket
        </h2>
        <p className="text-gray-600 mt-1">Submit a new support request</p>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                type="text"
                value={newTicket.subject}
                onChange={(e) =>
                  setNewTicket((prev) => ({ ...prev, subject: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of the issue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={newTicket.category}
                onChange={(e) =>
                  setNewTicket((prev) => ({
                    ...prev,
                    category: e.target.value as any,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">General</option>
                <option value="technical">Technical</option>
                <option value="billing">Billing</option>
                <option value="feature_request">Feature Request</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={newTicket.priority}
                onChange={(e) =>
                  setNewTicket((prev) => ({
                    ...prev,
                    priority: e.target.value as any,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Email *
              </label>
              <input
                type="email"
                value={newTicket.userEmail}
                onChange={(e) =>
                  setNewTicket((prev) => ({
                    ...prev,
                    userEmail: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={newTicket.userName}
              onChange={(e) =>
                setNewTicket((prev) => ({ ...prev, userName: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your name (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={newTicket.description}
              onChange={(e) =>
                setNewTicket((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={6}
              placeholder="Please provide detailed information about your issue or request..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setActiveTab("tickets")}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateTicket}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "Creating..." : "Create Ticket"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTicketDetail = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedTicket?.subject}
          </h2>
          <div className="flex items-center space-x-4 mt-2">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                selectedTicket?.status || ""
              )}`}
            >
              {selectedTicket?.status?.replace("_", " ")}
            </span>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                selectedTicket?.priority || ""
              )}`}
            >
              {selectedTicket?.priority}
            </span>
            <span className="text-sm text-gray-500">
              Created {formatDateTime(selectedTicket?.createdAt || "")}
            </span>
          </div>
        </div>
        <button
          onClick={() => setSelectedTicket(null)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      {/* Ticket Info */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              User Information
            </h3>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-900">
                  {selectedTicket?.userName || "Anonymous"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-900">
                  {selectedTicket?.userEmail}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Ticket Details
            </h3>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-900 capitalize">
                  {selectedTicket?.category?.replace("_", " ")}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-900">
                  Created {formatDate(selectedTicket?.createdAt || "")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Description</h3>
        <p className="text-gray-700 whitespace-pre-wrap">
          {selectedTicket?.description}
        </p>
      </div>

      {/* Responses */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Conversation</h3>
        <div className="space-y-4">
          {selectedTicket?.responses.map((response) => (
            <div
              key={response._id}
              className={`p-4 rounded-lg ${
                response.isFromUser ? "bg-blue-50" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">
                  {response.isFromUser
                    ? selectedTicket.userName || "User"
                    : "Support Team"}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDateTime(response.createdAt)}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {response.message}
              </p>
            </div>
          ))}
        </div>

        {/* Add Response */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Add Response
          </h4>
          <div className="space-y-3">
            <textarea
              value={newResponse}
              onChange={(e) => setNewResponse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Type your response here..."
            />
            <div className="flex justify-end">
              <button
                onClick={() =>
                  selectedTicket && handleAddResponse(selectedTicket._id)
                }
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Send className="w-4 h-4" />
                <span>Send Response</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Support Portal</h1>
        <p className="text-gray-600 mt-2">
          Manage reader support requests and FAQs
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          {[
            { id: "tickets", label: "Support Tickets", icon: MessageCircle },
            { id: "faq", label: "FAQ", icon: HelpCircle },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-3 py-2 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div>
        {selectedTicket ? (
          renderTicketDetail()
        ) : (
          <>
            {activeTab === "tickets" && renderTickets()}
            {activeTab === "faq" && renderFAQ()}
            {activeTab === "new_ticket" && renderNewTicket()}
          </>
        )}
      </div>
    </div>
  );
};

export default SupportPortal;
