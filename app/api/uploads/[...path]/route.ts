import { type NextRequest, NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params
    const filePath = join(process.cwd(), "public", "uploads", ...path)

    console.log("Serving image from:", filePath)

    // Verificar si el archivo existe
    if (!existsSync(filePath)) {
      console.log("File not found:", filePath)
      return new NextResponse("File not found", { status: 404 })
    }

    // Leer el archivo
    const fileBuffer = await readFile(filePath)

    // Determinar el tipo de contenido basado en la extensión
    const extension = path[path.length - 1].split(".").pop()?.toLowerCase()
    let contentType = "application/octet-stream"

    switch (extension) {
      case "jpg":
      case "jpeg":
        contentType = "image/jpeg"
        break
      case "png":
        contentType = "image/png"
        break
      case "webp":
        contentType = "image/webp"
        break
      case "gif":
        contentType = "image/gif"
        break
    }

    console.log("Serving image with content type:", contentType)

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Error serving image:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
