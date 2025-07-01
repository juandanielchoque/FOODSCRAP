"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Upload, X, ImageIcon, Star } from "lucide-react"
import { uploadImage, deleteImage, setPrimaryImage, getImagesByEntity, type ImageData } from "@/lib/image-actions"
import { LoadingSpinner } from "./loading-spinner"

interface ImageUploadProps {
  entityType: "dish" | "establishment" | "review"
  entityId: string
  existingImages?: ImageData[]
  maxImages?: number
  onImagesChange?: (images: ImageData[]) => void
  className?: string
}

export function ImageUpload({
  entityType,
  entityId,
  existingImages = [],
  maxImages = 5,
  onImagesChange,
  className = "",
}: ImageUploadProps) {
  const [images, setImages] = useState<ImageData[]>(existingImages)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cargar imágenes existentes cuando el componente se monta
  useEffect(() => {
    if (entityId && entityId !== "temp") {
      loadExistingImages()
    }
  }, [entityId, entityType])

  const loadExistingImages = async () => {
    setIsLoading(true)
    try {
      const existingImages = await getImagesByEntity(entityType, entityId)
      console.log("Loaded existing images:", existingImages)
      setImages(existingImages)
      onImagesChange?.(existingImages)
    } catch (error) {
      console.error("Error loading existing images:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    if (images.length + files.length > maxImages) {
      alert(`Máximo ${maxImages} imágenes permitidas`)
      return
    }

    setIsUploading(true)

    try {
      const newImages: ImageData[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append("file", file)
        formData.append("entityType", entityType)
        formData.append("entityId", entityId)
        formData.append("altText", `${entityType} image`)
        formData.append("isPrimary", (images.length === 0 && i === 0).toString())

        console.log("Uploading file:", file.name, "for entity:", entityId)
        console.log("Entity type:", entityType)

        const result = await uploadImage(formData)
        console.log("Upload result:", result)

        if (result.success && result.url && result.imageId) {
          const newImage: ImageData = {
            id: result.imageId,
            url: result.url,
            alt_text: `${entityType} image`,
            uploaded_by: "",
            entity_type: entityType,
            entity_id: entityId,
            is_primary: images.length === 0 && i === 0,
            created_at: new Date().toISOString(),
          }

          newImages.push(newImage)
          console.log("Added new image to state:", newImage)
        } else {
          alert(result.error || "Error al subir imagen")
        }
      }

      if (newImages.length > 0) {
        const updatedImages = [...images, ...newImages]
        setImages(updatedImages)
        onImagesChange?.(updatedImages)
        console.log("Updated images state:", updatedImages)
      }
    } catch (error) {
      console.error("Error uploading images:", error)
      alert("Error al subir imágenes")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (imageId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta imagen?")) return

    try {
      const result = await deleteImage(imageId)
      if (result.success) {
        const updatedImages = images.filter((img) => img.id !== imageId)
        setImages(updatedImages)
        onImagesChange?.(updatedImages)
      } else {
        alert(result.error || "Error al eliminar imagen")
      }
    } catch (error) {
      console.error("Error deleting image:", error)
      alert("Error al eliminar imagen")
    }
  }

  const handleSetPrimary = async (imageId: string) => {
    try {
      const result = await setPrimaryImage(imageId)
      if (result.success) {
        const updatedImages = images.map((img) => ({
          ...img,
          is_primary: img.id === imageId,
        }))
        setImages(updatedImages)
        onImagesChange?.(updatedImages)
      } else {
        alert(result.error || "Error al establecer imagen principal")
      }
    } catch (error) {
      console.error("Error setting primary image:", error)
      alert("Error al establecer imagen principal")
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const getImageUrl = (image: ImageData) => {
    // Asegurar que la URL sea correcta
    if (image.url.startsWith("/uploads/")) {
      return image.url
    }
    if (image.url.startsWith("uploads/")) {
      return `/${image.url}`
    }
    return image.url
  }

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive ? "border-primary-500 bg-primary-50" : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center space-y-2">
            <LoadingSpinner size="lg" />
            <p className="text-gray-600">Subiendo imágenes...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Upload className="text-gray-400" size={48} />
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                Haz clic para subir
              </button>
              <span className="text-gray-600"> o arrastra y suelta</span>
            </div>
            <p className="text-sm text-gray-500">
              PNG, JPG, WebP hasta 5MB ({images.length}/{maxImages} imágenes)
            </p>
          </div>
        )}
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={getImageUrl(image) || "/placeholder.svg"}
                  alt={image.alt_text || "Uploaded image"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Error loading image:", getImageUrl(image))
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=200&width=200"
                  }}
                  onLoad={() => {
                    console.log("Image loaded successfully:", getImageUrl(image))
                  }}
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                {!image.is_primary && (
                  <button
                    onClick={() => handleSetPrimary(image.id)}
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                    title="Establecer como principal"
                  >
                    <Star size={16} className="text-white" />
                  </button>
                )}

                <button
                  onClick={() => handleDelete(image.id)}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                  title="Eliminar imagen"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>

              {/* Primary Badge */}
              {image.is_primary && (
                <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                  <Star size={12} className="fill-current" />
                  <span>Principal</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          <ImageIcon size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No hay imágenes subidas</p>
        </div>
      )}
    </div>
  )
}
