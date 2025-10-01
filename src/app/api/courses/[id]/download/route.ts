import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

    const response = await fetch(`${backendUrl}/courses/${courseId}/download`, {
      method: "GET",
      headers: {
        Authorization: request.headers.get("Authorization") || "",
      },
    });

    if (!response.ok) {
      return new NextResponse("EPUB file not found", { status: 404 });
    }

    const epubBuffer = await response.arrayBuffer();
    const contentType =
      response.headers.get("content-type") || "application/epub+zip";

    return new NextResponse(epubBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="course-${courseId}.epub"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error proxying EPUB download:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
