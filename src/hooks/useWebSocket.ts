import { useEffect, useRef, useState, useCallback } from "react";

interface WebSocketMessage {
  type: "snapshot" | "bid_update" | "offer_update" | "error";
  data: any;
  auctionId: string;
}

interface UseWebSocketOptions {
  auctionId: string;
  token?: string;
  onMessage?: (message: WebSocketMessage) => void;
  onError?: (error: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onOpen?: (event: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  enabled?: boolean; // Allow disabling WebSocket entirely
}

export const useWebSocket = ({
  auctionId,
  token,
  onMessage,
  onError,
  onClose,
  onOpen,
  reconnectInterval = 10000,
  maxReconnectAttempts = 3,
  enabled = true,
}: UseWebSocketOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastConnectTimeRef = useRef(0);

  // Use refs for callbacks to prevent unnecessary re-renders
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);
  const onCloseRef = useRef(onClose);
  const onOpenRef = useRef(onOpen);

  // Update refs when callbacks change
  useEffect(() => {
    onMessageRef.current = onMessage;
    onErrorRef.current = onError;
    onCloseRef.current = onClose;
    onOpenRef.current = onOpen;
  }, [onMessage, onError, onClose, onOpen]);

  const connect = useCallback(() => {
    if (!enabled) {
      console.log("WebSocket disabled, skipping connection");
      return;
    }

    if (!auctionId) {
      console.log("No auctionId provided, skipping WebSocket connection");
      return;
    }

    // Prevent rapid reconnection attempts
    const now = Date.now();
    if (now - lastConnectTimeRef.current < 2000) {
      console.log("Skipping connection attempt - too soon after last attempt");
      return;
    }
    lastConnectTimeRef.current = now;

    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      console.log("Not in browser environment, skipping WebSocket connection");
      return;
    }

    // Check if we've already failed too many times, skip connection to prevent spam
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.log(
        "Max reconnection attempts reached, skipping WebSocket connection"
      );
      setConnectionError("WebSocket connection failed after maximum attempts");
      return;
    }

    try {
      // Build WebSocket URL
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host =
        process.env.NEXT_PUBLIC_WEBSOCKET_URL?.replace(/^https?:\/\//, "") ||
        "localhost:5000";
      const url = `${protocol}//${host}/ws?auctionId=${auctionId}`;

      console.log("Attempting WebSocket connection to:", url);
      console.log("Token provided:", !!token);
      console.log("Environment variables:", {
        NEXT_PUBLIC_WEBSOCKET_URL: process.env.NEXT_PUBLIC_WEBSOCKET_URL,
        protocol: window.location.protocol,
        host: host,
      });

      // Create WebSocket connection
      let ws: WebSocket;
      try {
        ws = token ? new WebSocket(url, ["jwt", token]) : new WebSocket(url);
        console.log("WebSocket object created successfully");
      } catch (wsError) {
        console.error("Failed to create WebSocket object:", wsError);
        setConnectionError("Failed to create WebSocket connection");
        return;
      }

      // Set up connection timeout
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          console.error("WebSocket connection timeout");
          ws.close();
          setConnectionError("WebSocket connection timeout");
        }
      }, 10000); // 10 second timeout

      ws.onopen = (event) => {
        clearTimeout(connectionTimeout);
        console.log("WebSocket connected successfully");
        console.log("WebSocket readyState:", ws.readyState);
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;
        onOpenRef.current?.(event);

        // Start heartbeat
        heartbeatIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "ping" }));
          }
        }, 30000);
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          // Ignore pong messages (which are not part of WebSocketMessage)
          if (message.type === "pong") {
            return;
          }

          onMessageRef.current?.(message as WebSocketMessage);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onclose = (event) => {
        clearTimeout(connectionTimeout);
        console.log("WebSocket disconnected:", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          type: event.type,
        });
        setIsConnected(false);

        // Clear heartbeat
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
          heartbeatIntervalRef.current = null;
        }

        onCloseRef.current?.(event);

        // Attempt reconnection if not a clean close and under max attempts
        if (
          event.code !== 1000 && // Not a normal closure
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          reconnectAttemptsRef.current++;
          console.log(
            `Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
          );

          // Exponential backoff for reconnection
          const backoffDelay = Math.min(
            reconnectInterval * Math.pow(2, reconnectAttemptsRef.current - 1),
            30000
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, backoffDelay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setConnectionError("Failed to reconnect after maximum attempts");
        }
      };

      ws.onerror = (event) => {
        try {
          const errorInfo = {
            type: event.type,
            target: event.target,
            url: url,
            readyState: ws.readyState,
            protocol: ws.protocol,
            timestamp: new Date().toISOString(),
            auctionId: auctionId,
            tokenProvided: !!token,
          };

          // Use console.warn instead of console.error to avoid triggering Next.js error overlay
          console.warn("WebSocket connection failed:", errorInfo);

          // Provide more specific error messages based on readyState
          let errorMessage = "WebSocket connection error";
          switch (ws.readyState) {
            case WebSocket.CONNECTING:
              errorMessage =
                "WebSocket connection failed to establish - server may not be running";
              break;
            case WebSocket.CLOSING:
              errorMessage = "WebSocket connection is closing";
              break;
            case WebSocket.CLOSED:
              errorMessage = "WebSocket connection is closed";
              break;
            default:
              errorMessage = `WebSocket error (readyState: ${ws.readyState})`;
          }

          setConnectionError(errorMessage);

          // Safely call the error callback
          try {
            onErrorRef.current?.(event);
          } catch (callbackError) {
            console.warn("Error in WebSocket error callback:", callbackError);
          }
        } catch (error) {
          // Prevent any unhandled errors from bubbling up
          console.warn("Error handling WebSocket error:", error);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
      setConnectionError("Failed to create WebSocket connection");
    }
  }, [auctionId, token, reconnectInterval, maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    // Clear reconnection timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Clear heartbeat
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }

    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close(1000, "Manual disconnect");
      wsRef.current = null;
    }

    setIsConnected(false);
    reconnectAttemptsRef.current = 0;
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected");
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [auctionId]); // Only reconnect when auctionId changes

  return {
    isConnected,
    connectionError,
    sendMessage,
    reconnect: connect,
    disconnect,
  };
};
