"use client";

import { useState, useCallback } from "react";
import { useLoading } from "@/contexts/LoadingContext";

interface UseLoadingStateReturn {
  isLoading: boolean;
  loadingMessage: string;
  setLoading: (loading: boolean, message?: string) => void;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  withLoading: <T>(asyncFn: () => Promise<T>, message?: string) => Promise<T>;
}

export function useLoadingState(): UseLoadingStateReturn {
  const [localLoading, setLocalLoading] = useState(false);
  const [localMessage, setLocalMessage] = useState("Loading...");
  const {
    setLoading: setGlobalLoading,
    showLoading,
    hideLoading,
  } = useLoading();

  const setLoading = useCallback(
    (loading: boolean, message = "Loading...") => {
      setLocalLoading(loading);
      setLocalMessage(message);
      if (loading) {
        setGlobalLoading(true, message);
      } else {
        setGlobalLoading(false);
      }
    },
    [setGlobalLoading]
  );

  const showLoadingWithMessage = useCallback(
    (message = "Loading...") => {
      setLoading(true, message);
    },
    [setLoading]
  );

  const hideLoadingState = useCallback(() => {
    setLoading(false);
  }, [setLoading]);

  const withLoading = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      message = "Loading..."
    ): Promise<T> => {
      try {
        setLoading(true, message);
        const result = await asyncFn();
        return result;
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  return {
    isLoading: localLoading,
    loadingMessage: localMessage,
    setLoading,
    showLoading: showLoadingWithMessage,
    hideLoading: hideLoadingState,
    withLoading,
  };
}

// Hook for simple loading states without global loading
export function useSimpleLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading...");

  const setLoading = useCallback((loading: boolean, message = "Loading...") => {
    setIsLoading(loading);
    setLoadingMessage(message);
  }, []);

  const showLoading = useCallback(
    (message = "Loading...") => {
      setLoading(true, message);
    },
    [setLoading]
  );

  const hideLoading = useCallback(() => {
    setLoading(false);
  }, [setLoading]);

  const withLoading = useCallback(
    async <T>(
      asyncFn: () => Promise<T>,
      message = "Loading..."
    ): Promise<T> => {
      try {
        setLoading(true, message);
        const result = await asyncFn();
        return result;
      } finally {
        setLoading(false);
      }
    },
    [setLoading]
  );

  return {
    isLoading,
    loadingMessage,
    setLoading,
    showLoading,
    hideLoading,
    withLoading,
  };
}
