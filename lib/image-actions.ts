"use server"

import { executeQuery, generateUUID } from "./database"
import { getCurrentUser } from "./auth-actions"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { revalidatePath } from "next/cache"

export interface ImageData {
  id: string
  url: string
  alt_text?: string
  uploaded_by: string
  entity_type: "dish" | "establishment" | "review"
  entity_id: string
  is_primary: boolean
  file_size?: number
  width?: number
  height?: number
  created_at: string
}

export async function uploadImage(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "Debes iniciar sesión para subir imágenes" }
  }

  try {
    const file = formData.get("file") as File
    const entityType = formData.get("entityType") as string
    const entityId = formData.get("entityId") as string
    const altText = formData.get("altText") as string
    const isPrimary = formData.get("isPrimary") === "true"

    console.log("Upload params:", { entityType, entityId, fileName: file.name, isPrimary })

    if (!file || !entityType || !entityId) {
      return { error: "Faltan datos requeridos" }
    }

    // Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return { error: "Tipo de archivo no permitido. Solo se permiten JPG, PNG y WebP" }
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return { error: "El archivo es demasiado grande. Máximo 5MB" }
    }

    // Crear directorio si no existe
    const uploadDir = join(__dirname, "..", "public", "uploads", entityType)

    await mkdir(uploadDir, { recursive: true })

    // Generar nombre único para el archivo
    const fileExtension = file.name.split(".").pop()
    const fileName = `${generateUUID()}.${fileExtension}`
    const filePath = join(uploadDir, fileName)
    const publicUrl = `/uploads/${entityType}/${fileName}`

    console.log("Saving file to:", filePath)
    console.log("Public URL will be:", publicUrl)

    // Guardar archivo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    console.log("File saved successfully")

    // Si es imagen primaria, desmarcar otras imágenes primarias
    if (isPrimary) {
      await executeQuery(`UPDATE images SET is_primary = FALSE WHERE entity_type = ? AND entity_id = ?`, [
        entityType,
        entityId,
      ])
    }

    // Guardar información en base de datos
    const imageId = generateUUID()
    await executeQuery(
      `
      INSERT INTO images (id, url, alt_text, uploaded_by, entity_type, entity_id, is_primary, file_size)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [imageId, publicUrl, altText, user.id, entityType, entityId, isPrimary, file.size],
    )

    console.log("Image record saved to database with ID:", imageId)

    revalidatePath(`/${entityType}/${entityId}`)
    return { success: true, imageId, url: publicUrl }
  } catch (error) {
    console.error("Error uploading image:", error)
    return { error: "Error al subir la imagen" }
  }
}

export async function getImagesByEntity(entityType: string, entityId: string): Promise<ImageData[]> {
  try {
    console.log("Getting images for:", { entityType, entityId })

    const images = (await executeQuery(
      `
      SELECT * FROM images 
      WHERE entity_type = ? AND entity_id = ?
      ORDER BY is_primary DESC, created_at DESC
    `,
      [entityType, entityId],
    )) as ImageData[]

    console.log("Found images:", images.length)
    console.log("Images data:", images)

    return images
  } catch (error) {
    console.error("Error getting images:", error)
    return []
  }
}

export async function deleteImage(imageId: string) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "Debes iniciar sesión" }
  }

  try {
    // Verificar permisos
    const images = (await executeQuery(`SELECT * FROM images WHERE id = ? AND uploaded_by = ?`, [
      imageId,
      user.id,
    ])) as ImageData[]

    if (images.length === 0) {
      return { error: "No tienes permisos para eliminar esta imagen" }
    }

    const image = images[0]

    // Eliminar de base de datos
    await executeQuery(`DELETE FROM images WHERE id = ?`, [imageId])

    // Intentar eliminar archivo físico
    try {
      const fs = await import("fs/promises")
      const path = join(process.cwd(), "public", image.url)
      await fs.unlink(path)
    } catch (fileError) {
      console.warn("No se pudo eliminar el archivo físico:", fileError)
    }

    revalidatePath(`/${image.entity_type}/${image.entity_id}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting image:", error)
    return { error: "Error al eliminar la imagen" }
  }
}

export async function setPrimaryImage(imageId: string) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "Debes iniciar sesión" }
  }

  try {
    // Obtener información de la imagen
    const images = (await executeQuery(`SELECT * FROM images WHERE id = ? AND uploaded_by = ?`, [
      imageId,
      user.id,
    ])) as ImageData[]

    if (images.length === 0) {
      return { error: "No tienes permisos para modificar esta imagen" }
    }

    const image = images[0]

    // Desmarcar otras imágenes primarias
    await executeQuery(`UPDATE images SET is_primary = FALSE WHERE entity_type = ? AND entity_id = ?`, [
      image.entity_type,
      image.entity_id,
    ])

    // Marcar esta como primaria
    await executeQuery(`UPDATE images SET is_primary = TRUE WHERE id = ?`, [imageId])

    revalidatePath(`/${image.entity_type}/${image.entity_id}`)
    return { success: true }
  } catch (error) {
    console.error("Error setting primary image:", error)
    return { error: "Error al establecer imagen principal" }
  }
}
