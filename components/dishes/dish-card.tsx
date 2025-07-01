"use client"

import { Star, MapPin, Heart, Clock, Utensils } from "lucide-react"
import Link from "next/link"
import type { Dish } from "@/lib/dish-actions"
import { formatCurrency } from "@/lib/utils"

interface DishCardProps {
  dish: Dish
  showEstablishment?: boolean
}

export function DishCard({ dish, showEstablishment = true }: DishCardProps) {
  // Usar la imagen real de la base de datos o un placeholder
  const dishImage = dish.primary_image_url || "/placeholder.svg?height=200&width=300&text=Sin+Imagen"

  console.log("DishCard - Dish:", dish.name, "Image URL:", dish.primary_image_url)

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 group">
      <div className="relative">
        <img
          src={dishImage || "/placeholder.svg"}
          alt={dish.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            console.error("Error loading dish image:", dishImage)
            const target = e.target as HTMLImageElement
            target.src = "/placeholder.svg?height=200&width=300&text=Error+Imagen"
          }}
          onLoad={() => {
            console.log("Dish image loaded successfully:", dishImage)
          }}
        />
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
          <Heart size={16} className="text-gray-600 hover:text-red-500" />
        </button>
        {!dish.is_available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">No disponible</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">{dish.name}</h3>
          <div className="flex items-center space-x-1 ml-2">
            <Star className="text-yellow-400 fill-current" size={16} />
            <span className="text-sm font-medium">{(Number(dish.average_rating) || 0).toFixed(1)}</span>
            <span className="text-xs text-gray-500">({dish.total_reviews})</span>
          </div>
        </div>

        {showEstablishment && (
          <div className="flex items-center space-x-1 text-gray-600 mb-2">
            <Utensils size={14} />
            <span className="text-sm">{dish.business_name}</span>
          </div>
        )}

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{dish.description}</p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {dish.city && (
              <div className="flex items-center space-x-1 text-gray-500">
                <MapPin size={12} />
                <span className="text-xs">{dish.city}</span>
              </div>
            )}
            {dish.prep_time_minutes && (
              <div className="flex items-center space-x-1 text-gray-500">
                <Clock size={12} />
                <span className="text-xs">{dish.prep_time_minutes} min</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-wrap gap-1">
            {dish.is_vegetarian && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Vegetariano</span>
            )}
            {dish.is_vegan && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Vegano</span>
            )}
            {dish.is_gluten_free && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Sin Gluten</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-primary-500">{formatCurrency(dish.price)}</span>
            {dish.calories && <span className="text-xs text-gray-500">{dish.calories} cal</span>}
          </div>
          <Link
            href={`/dish/${dish.id}`}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  )
}
