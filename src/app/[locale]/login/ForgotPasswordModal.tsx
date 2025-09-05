import React, { useState } from "react";
import { forgotPassword } from "@/utils/apiUtils";

interface ForgotPasswordModalProps {
  show: boolean;
  handleClose: () => void;
}

const ForgotPasswordModal = ({
  show,
  handleClose,
}: ForgotPasswordModalProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  const handleSubmit = async () => {
    if (!email) {
      setMessage("Please enter your email");
      setMessageType("error");
      return;
    }
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setMessage(
        "Reset password request sent successfully. Please check your email."
      );
      setMessageType("success");
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
      setMessageType("error");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Forgot Password Request</h2>
              <button
                onClick={handleClose}
                aria-label="Close"
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="p-4 space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your email
                </label>
                <input
                  id="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                  aria-describedby="emailHelp"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <small id="emailHelp" className="text-gray-500">
                  We&apos;ll send a password reset link to this email.
                </small>
              </div>
              {message && (
                <p
                  className={`text-sm ${
                    messageType === "success"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {message}
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-2 p-4 border-t">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`px-4 py-2 rounded-md text-white ${
                  isLoading
                    ? "bg-gray-400"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ForgotPasswordModal;
