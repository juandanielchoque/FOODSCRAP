"use client"

import { useState } from "react"
import { createReview } from "@/lib/review-actions"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Star, X } from "lucide-react"

interface ReviewFormProps {
  dishId: string
  establishmentId: string
  dishName: string
  onClose: () => void
  onSuccess: () => void
}

export function ReviewForm({ dishId, establishmentId, dishName, onClose, onSuccess }: ReviewFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [foodRating, setFoodRating] = useState(0)
  const [serviceRating, setServiceRating] = useState(0)
  const [ambianceRating, setAmbianceRating] = useState(0)
  const [valueRating, setValueRating] = useState(0)

  async function handleSubmit(formData: FormData) {
    if (rating === 0) {
      setError("Por favor selecciona una calificación")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      formData.append("dishId", dishId)
      formData.append("establishmentId", establishmentId)
      formData.append("rating", rating.toString())
      formData.append("foodRating", foodRating.toString())
      formData.append("serviceRating", serviceRating.toString())
      formData.append("ambianceRating", ambianceRating.toString())
      formData.append("valueRating", valueRating.toString())

      const result = await createReview(formData)

      if (result.error) {
        setError(result.error)
      } else {
        onSuccess()
      }
    } catch (error) {
      setError("Error inesperado. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const StarRating = ({
    value,
    onChange,
    onHover,
    onLeave,
  }: {
    value: number
    onChange: (rating: number) => void
    onHover?: (rating: number) => void
    onLeave?: () => void
  }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => onHover?.(star)}
          onMouseLeave={() => onLeave?.()}
          className="focus:outline-none"
        >
          <Star
            size={24}
            className={`transition-colors ${
              star <= value ? "text-yellow-400 fill-current" : "text-gray-300 hover:text-yellow-200"
            }`}
          />
        </button>
      ))}
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Escribir Reseña</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form action={handleSubmit} className="p-6 space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Reseñando: {dishName}</h3>
          </div>

          <div>
            <label className="form-label">Calificación General *</label>
            <div className="flex items-center space-x-3">
              <StarRating
                value={hoverRating || rating}
                onChange={setRating}
                onHover={setHoverRating}
                onLeave={() => setHoverRating(0)}
              />
              <span className="text-sm text-gray-600">
                {(hoverRating || rating) === 0 && "Selecciona una calificación"}
                {(hoverRating || rating) === 1 && "Muy malo"}
                {(hoverRating || rating) === 2 && "Malo"}
                {(hoverRating || rating) === 3 && "Regular"}
                {(hoverRating || rating) === 4 && "Bueno"}
                {(hoverRating || rating) === 5 && "Excelente"}
              </span>
            </div>
          </div>

          <div>
            <label className="form-label">Título de la reseña</label>
            <input type="text" name="title" className="form-input" placeholder="Resumen de tu experiencia" />
          </div>

          <div>
            <label className="form-label">Comentario</label>
            <textarea
              name="comment"
              rows={4}
              className="form-input"
              placeholder="Cuéntanos sobre tu experiencia con este plato..."
            />
          </div>

          <div>
            <label className="form-label">Fecha de visita</label>
            <input type="date" name="visitDate" className="form-input" />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Calificaciones Detalladas (Opcional)</h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Comida</label>
                <StarRating value={foodRating} onChange={setFoodRating} />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Servicio</label>
                <StarRating value={serviceRating} onChange={setServiceRating} />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Ambiente</label>
                <StarRating value={ambianceRating} onChange={setAmbianceRating} />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Precio/Calidad</label>
                <StarRating value={valueRating} onChange={setValueRating} />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || rating === 0}
              className="btn-primary flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Publicando...</span>
                </>
              ) : (
                <span>Publicar Reseña</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
