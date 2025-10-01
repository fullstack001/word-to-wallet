import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: courseId } = await params;
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";

    const response = await fetch(`${backendUrl}/courses/${courseId}/cover`, {
      method: "GET",
      headers: {
        Authorization: request.headers.get("Authorization") || "",
      },
    });

    if (!response.ok) {
      return new NextResponse("Cover image not found", { status: 404 });
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error proxying cover image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
