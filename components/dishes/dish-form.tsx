"use client"

import { useState, useEffect } from "react"
import { createDish, updateDish, type DishCategory } from "@/lib/dish-actions"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { X, Plus, Minus } from "lucide-react"
import { ImageUpload } from "@/components/ui/image-upload"
import { getImagesByEntity, type ImageData } from "@/lib/image-actions"

interface DishFormProps {
  categories: DishCategory[]
  dish?: any
  onClose: () => void
  onSuccess: () => void
}

export function DishForm({ categories, dish, onClose, onSuccess }: DishFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [spiceLevel, setSpiceLevel] = useState(dish?.spice_level || 0)
  const [images, setImages] = useState<ImageData[]>([])

  useEffect(() => {
    if (dish?.id) {
      loadImages()
    }
  }, [dish?.id])

  async function loadImages() {
    if (dish?.id) {
      const dishImages = await getImagesByEntity("dish", dish.id)
      setImages(dishImages)
    }
  }

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError("")

    try {
      formData.append("spiceLevel", spiceLevel.toString())

      const result = dish ? await updateDish(dish.id, formData) : await createDish(formData)

      if (result.error) {
        setError(result.error)
      } else {
        onSuccess()
        onClose()
      }
    } catch (error) {
      setError("Error inesperado. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">{dish ? "Editar Plato" : "Agregar Nuevo Plato"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form action={handleSubmit} className="p-6 space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Nombre del Plato *</label>
              <input
                type="text"
                name="name"
                required
                defaultValue={dish?.name}
                className="form-input"
                placeholder="Tacos al Pastor"
              />
            </div>

            <div>
              <label className="form-label">Categoría *</label>
              <select name="categoryId" required defaultValue={dish?.category_id} className="form-input">
                <option value="">Seleccionar categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Descripción *</label>
            <textarea
              name="description"
              required
              rows={3}
              defaultValue={dish?.description}
              className="form-input"
              placeholder="Describe tu plato, ingredientes principales, preparación..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Precio (MXN) *</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="0.01"
                defaultValue={dish?.price}
                className="form-input"
                placeholder="150.00"
              />
            </div>

            <div>
              <label className="form-label">Calorías</label>
              <input
                type="number"
                name="calories"
                min="0"
                defaultValue={dish?.calories}
                className="form-input"
                placeholder="450"
              />
            </div>

            <div>
              <label className="form-label">Tiempo de preparación (min)</label>
              <input
                type="number"
                name="prepTime"
                min="0"
                defaultValue={dish?.prep_time_minutes}
                className="form-input"
                placeholder="15"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Ingredientes</label>
            <input
              type="text"
              name="ingredients"
              defaultValue={dish?.ingredients?.join(", ")}
              className="form-input"
              placeholder="Carne de cerdo, piña, cebolla, cilantro, tortilla"
            />
            <p className="text-xs text-gray-500 mt-1">Separa los ingredientes con comas</p>
          </div>

          <div>
            <label className="form-label">Alérgenos</label>
            <input
              type="text"
              name="allergens"
              defaultValue={dish?.allergens?.join(", ")}
              className="form-input"
              placeholder="Gluten, lácteos, frutos secos"
            />
            <p className="text-xs text-gray-500 mt-1">Separa los alérgenos con comas</p>
          </div>

          <div>
            <label className="form-label">Nivel de picante</label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setSpiceLevel(Math.max(0, spiceLevel - 1))}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <Minus size={16} />
              </button>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-4 h-4 rounded-full ${i < spiceLevel ? "bg-red-500" : "bg-gray-200"}`} />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setSpiceLevel(Math.min(5, spiceLevel + 1))}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <Plus size={16} />
              </button>
              <span className="text-sm text-gray-600">
                {spiceLevel === 0 && "Sin picante"}
                {spiceLevel === 1 && "Suave"}
                {spiceLevel === 2 && "Medio"}
                {spiceLevel === 3 && "Picante"}
                {spiceLevel === 4 && "Muy picante"}
                {spiceLevel === 5 && "Extremo"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="form-label">Características dietéticas</label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isVegetarian"
                  value="true"
                  defaultChecked={dish?.is_vegetarian}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm">Vegetariano</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isVegan"
                  value="true"
                  defaultChecked={dish?.is_vegan}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm">Vegano</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isGlutenFree"
                  value="true"
                  defaultChecked={dish?.is_gluten_free}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm">Sin Gluten</span>
              </label>
              {dish && (
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    value="true"
                    defaultChecked={dish?.is_available}
                    className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-sm">Disponible</span>
                </label>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <label className="form-label">Imágenes del plato</label>
            <ImageUpload
              entityType="dish"
              entityId={dish?.id || "temp"}
              existingImages={images}
              maxImages={5}
              onImagesChange={setImages}
            />
            <p className="text-xs text-gray-500">
              Sube hasta 5 imágenes de tu plato. La primera imagen será la principal.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="btn-primary flex items-center space-x-2">
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>{dish ? "Actualizando..." : "Creando..."}</span>
                </>
              ) : (
                <span>{dish ? "Actualizar Plato" : "Crear Plato"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
