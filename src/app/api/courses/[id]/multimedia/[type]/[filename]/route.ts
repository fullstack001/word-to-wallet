import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ id: string; type: string; filename: string }> }
) {
  try {
    const { id, type, filename } = await params;
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    const response = await fetch(
      `${backendUrl}/courses/${id}/multimedia/${type}/${filename}`,
      {
        method: "GET",
        headers: {
          Authorization: request.headers.get("Authorization") || "",
        },
      }
    );

    if (!response.ok) {
      return new NextResponse("Media file not found", { status: 404 });
    }

    const mediaBuffer = await response.arrayBuffer();
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    return new NextResponse(mediaBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
        "Accept-Ranges": "bytes",
      },
    });
  } catch (error) {
    console.error("Error proxying media file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
