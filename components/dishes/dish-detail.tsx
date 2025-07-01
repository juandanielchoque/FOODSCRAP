"use client"

import { useState } from "react"
import { Star, MapPin, Clock, Users, Heart, Share2, ChefHat, Utensils } from "lucide-react"
import type { Dish } from "@/lib/dish-actions"
import type { Review } from "@/lib/review-actions"
import type { User } from "@/lib/auth-actions"
import { formatCurrency } from "@/lib/utils"
import { ReviewForm } from "@/components/reviews/review-form"
import { ReviewCard } from "@/components/reviews/review-card"
import Link from "next/link"

interface DishDetailProps {
  dish: Dish
  reviews: Review[]
  currentUser: User | null
}

export function DishDetail({ dish, reviews, currentUser }: DishDetailProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)

  // Usar la imagen real de la base de datos o un placeholder
  const dishImage = dish.primary_image_url || "/placeholder.svg?height=400&width=600&text=Sin+Imagen"

  console.log("DishDetail - Dish:", dish.name, "Image URL:", dish.primary_image_url)

  const canReview =
    currentUser?.user_type === "consumer" && !reviews.some((review) => review.user_id === currentUser.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-primary-500 p-2 rounded-lg">
                <ChefHat className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">FoodScrap</h1>
            </Link>

            {currentUser && (
              <Link
                href={currentUser.user_type === "consumer" ? "/consumer/dashboard" : "/establishment/dashboard"}
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                Mi Dashboard
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary-500">
            Inicio
          </Link>
          <span>/</span>
          <Link href={`/search?category=${dish.category_name}`} className="hover:text-primary-500">
            {dish.category_name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{dish.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dish Images */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <img
                src={dishImage || "/placeholder.svg"}
                alt={dish.name}
                className="w-full h-64 md:h-80 object-cover"
                onError={(e) => {
                  console.error("Error loading dish detail image:", dishImage)
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=400&width=600&text=Error+Imagen"
                }}
                onLoad={() => {
                  console.log("Dish detail image loaded successfully:", dishImage)
                }}
              />
            </div>

            {/* Dish Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{dish.name}</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Utensils size={16} />
                      <span>{dish.business_name}</span>
                    </div>
                    {dish.city && (
                      <div className="flex items-center space-x-1">
                        <MapPin size={16} />
                        <span>{dish.city}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart size={20} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={
                          i < Math.floor(Number(dish.average_rating) || 0)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{(Number(dish.average_rating) || 0).toFixed(1)}</span>
                  <span className="text-gray-500">({dish.total_reviews} reseñas)</span>
                </div>

                {dish.prep_time_minutes && (
                  <div className="flex items-center space-x-1 text-gray-600">
                    <Clock size={16} />
                    <span>{dish.prep_time_minutes} min</span>
                  </div>
                )}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">{dish.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {dish.is_vegetarian && (
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">Vegetariano</span>
                )}
                {dish.is_vegan && (
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">Vegano</span>
                )}
                {dish.is_gluten_free && (
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">Sin Gluten</span>
                )}
                {dish.spice_level && dish.spice_level > 0 && (
                  <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                    Picante {dish.spice_level}/5
                  </span>
                )}
              </div>

              {/* Ingredients */}
              {dish.ingredients && dish.ingredients.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Ingredientes</h3>
                  <div className="flex flex-wrap gap-2">
                    {dish.ingredients.map((ingredient, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Allergens */}
              {dish.allergens && dish.allergens.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Alérgenos</h3>
                  <div className="flex flex-wrap gap-2">
                    {dish.allergens.map((allergen, index) => (
                      <span key={index} className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Reseñas ({reviews.length})</h2>
                {canReview && (
                  <button onClick={() => setShowReviewForm(true)} className="btn-primary">
                    Escribir Reseña
                  </button>
                )}
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Aún no hay reseñas para este plato.</p>
                  {canReview && <p className="mt-2">¡Sé el primero en escribir una!</p>}
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} currentUser={currentUser} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price & Order */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary-500 mb-2">{formatCurrency(dish.price)}</div>
                {dish.calories && <div className="text-sm text-gray-500">{dish.calories} calorías</div>}
              </div>

              {dish.is_available ? (
                <div className="space-y-3">
                  <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                    Ordenar Ahora
                  </button>
                  <button className="w-full border border-primary-500 text-primary-500 hover:bg-primary-50 font-semibold py-3 px-4 rounded-lg transition-colors">
                    Agregar al Carrito
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">
                    No disponible
                  </span>
                </div>
              )}
            </div>

            {/* Restaurant Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Sobre el Restaurante</h3>
              <div className="space-y-3">
                <div>
                  <div className="font-medium text-gray-900">{dish.business_name}</div>
                  <div className="text-sm text-gray-600">{dish.cuisine_type}</div>
                </div>

                {dish.city && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin size={16} />
                    <span className="text-sm">{dish.city}</span>
                  </div>
                )}

                <Link
                  href={`/restaurant/${dish.establishment_id}`}
                  className="block w-full text-center border border-gray-300 hover:border-primary-500 text-gray-700 hover:text-primary-500 py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                >
                  Ver Restaurante
                </Link>
              </div>
            </div>

            {/* Nutritional Info */}
            {(dish.calories || dish.prep_time_minutes) && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Información Nutricional</h3>
                <div className="space-y-2">
                  {dish.calories && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Calorías</span>
                      <span className="font-medium">{dish.calories}</span>
                    </div>
                  )}
                  {dish.prep_time_minutes && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tiempo de preparación</span>
                      <span className="font-medium">{dish.prep_time_minutes} min</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          dishId={dish.id}
          establishmentId={dish.establishment_id}
          dishName={dish.name}
          onClose={() => setShowReviewForm(false)}
          onSuccess={() => {
            setShowReviewForm(false)
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}
