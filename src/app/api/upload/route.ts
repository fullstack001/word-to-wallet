import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

// Configure runtime for large file uploads
export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes for large file uploads

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const fileName = formData.get("fileName") as string;
    const fileId = formData.get("fileId") as string;

    if (!file || !fileName || !fileId) {
      return NextResponse.json(
        { error: "Missing required fields: file, fileName, or fileId" },
        { status: 400 }
      );
    }

    // Check file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          error: `File size ${(file.size / 1024 / 1024).toFixed(
            2
          )}MB exceeds the maximum allowed size of 100MB`,
        },
        { status: 413 }
      );
    }

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), "public", "uploads");
    if (!existsSync(uploadsDir)) {
      try {
        mkdirSync(uploadsDir, { recursive: true });
        console.log("Created uploads directory:", uploadsDir);
      } catch (dirError) {
        console.error("Failed to create uploads directory:", dirError);
        return NextResponse.json(
          { error: "Failed to create uploads directory" },
          { status: 500 }
        );
      }
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file to uploads directory
    const filePath = join(uploadsDir, fileName);

    try {
      await writeFile(filePath, buffer);
      console.log(`File uploaded successfully: ${fileName} to ${filePath}`);

      // Verify file was written successfully
      if (!existsSync(filePath)) {
        throw new Error("File was not written to disk");
      }
    } catch (writeError) {
      console.error("Failed to write file:", writeError);
      return NextResponse.json(
        { error: "Failed to save file to disk" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      fileId,
      fileName,
      filePath: `/uploads/${fileName}`,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName } = body;

    if (!fileName) {
      return NextResponse.json(
        { error: "Missing fileName parameter" },
        { status: 400 }
      );
    }

    // Delete file from uploads directory
    const filePath = join(process.cwd(), "public", "uploads", fileName);

    if (existsSync(filePath)) {
      await unlink(filePath);
      console.log(`File deleted successfully: ${fileName}`);
      return NextResponse.json({ success: true });
    } else {
      console.log(`File not found for deletion: ${fileName}`);
      return NextResponse.json({ success: true }); // File doesn't exist, consider it deleted
    }
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
