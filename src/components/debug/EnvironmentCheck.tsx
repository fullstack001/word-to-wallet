"use client";

import React from "react";

export default function EnvironmentCheck() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg text-xs max-w-sm">
      <h3 className="font-bold mb-2">Environment Check</h3>
      <div className="space-y-1">
        <div>
          <strong>API URL:</strong> {apiUrl || "Not set"}
        </div>
        <div>
          <strong>Stripe Key:</strong> {stripeKey ? "Set" : "Not set"}
        </div>
        <div>
          <strong>Node Env:</strong> {process.env.NODE_ENV}
        </div>
      </div>
    </div>
  );
}
