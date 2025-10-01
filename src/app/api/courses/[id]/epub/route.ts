import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

    // Forward all relevant headers
    const headers: Record<string, string> = {};
    const authHeader = request.headers.get("Authorization");
    if (authHeader) headers.Authorization = authHeader;

    const rangeHeader = request.headers.get("Range");
    if (rangeHeader) headers.Range = rangeHeader;

    const response = await fetch(`${backendUrl}/courses/${courseId}/epub`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      return new NextResponse("EPUB file not found", { status: 404 });
    }

    const epubBuffer = await response.arrayBuffer();
    const contentType =
      response.headers.get("content-type") || "application/epub+zip";
    const contentLength = response.headers.get("content-length");
    const contentRange = response.headers.get("content-range");
    const cacheControl = response.headers.get("cache-control");
    const acceptRanges = response.headers.get("accept-ranges");

    const responseHeaders: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": cacheControl || "public, max-age=3600",
      "Accept-Ranges": acceptRanges || "bytes",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "Range, Content-Type, Accept",
    };

    if (contentLength) responseHeaders["Content-Length"] = contentLength;
    if (contentRange) responseHeaders["Content-Range"] = contentRange;

    return new NextResponse(epubBuffer, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Error proxying EPUB file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

    const response = await fetch(`${backendUrl}/courses/${courseId}/epub`, {
      method: "HEAD",
      headers: {
        Authorization: request.headers.get("Authorization") || "",
      },
    });

    if (!response.ok) {
      return new NextResponse("EPUB file not found", { status: 404 });
    }

    const contentType =
      response.headers.get("content-type") || "application/epub+zip";
    const contentLength = response.headers.get("content-length");
    const acceptRanges = response.headers.get("accept-ranges");
    const cacheControl = response.headers.get("cache-control");

    return new NextResponse(null, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
        "Content-Length": contentLength || "0",
        "Accept-Ranges": acceptRanges || "bytes",
        "Cache-Control": cacheControl || "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "Range, Content-Type, Accept",
      },
    });
  } catch (error) {
    console.error("Error proxying EPUB HEAD request:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
