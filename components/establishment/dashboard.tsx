"use client"

import { useState, useEffect } from "react"
import type { User } from "@/lib/auth-actions"
import { getEstablishmentDishes, getCategories, type Dish, type DishCategory } from "@/lib/dish-actions"
import { Plus, Star, Eye, TrendingUp, ChefHat, LogOut, Settings, Edit, Trash2 } from "lucide-react"
import { logoutUser } from "@/lib/auth-actions"
import { DishForm } from "@/components/dishes/dish-form"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { formatCurrency } from "@/lib/utils"

interface EstablishmentDashboardProps {
  user: User
}

export function EstablishmentDashboard({ user }: EstablishmentDashboardProps) {
  const [activeTab, setActiveTab] = useState("dishes")
  const [dishes, setDishes] = useState<Dish[]>([])
  const [categories, setCategories] = useState<DishCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDishForm, setShowDishForm] = useState(false)
  const [editingDish, setEditingDish] = useState<Dish | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setIsLoading(true)
    try {
      const [dishesData, categoriesData] = await Promise.all([getEstablishmentDishes(), getCategories()])

      setDishes(dishesData)
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleDishSuccess() {
    loadData()
    setShowDishForm(false)
    setEditingDish(null)
  }

  function handleEditDish(dish: Dish) {
    setEditingDish(dish)
    setShowDishForm(true)
  }

  async function handleDeleteDish(dishId: string) {
    if (!confirm("¿Estás seguro de que quieres eliminar este plato?")) return

    try {
      const { deleteDish } = await import("@/lib/dish-actions")
      const result = await deleteDish(dishId)

      if (result.error) {
        alert(result.error)
      } else {
        loadData()
      }
    } catch (error) {
      alert("Error al eliminar el plato")
    }
  }

  const stats = {
    totalDishes: dishes.length,
    averageRating:
      dishes.length > 0
        ? (dishes.reduce((sum, dish) => sum + (Number(dish.average_rating) || 0), 0) / dishes.length).toFixed(1)
        : "0.0",
    totalViews: dishes.reduce((sum, dish) => sum + (dish.total_reviews || 0) * 10, 0), // Estimado
    totalReviews: dishes.reduce((sum, dish) => sum + (dish.total_reviews || 0), 0),
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-500 p-2 rounded-lg">
                <ChefHat className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-900">FoodScrap Business</h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Hola, {user.name}</span>
              <button className="text-gray-600 hover:text-gray-900 transition-colors">
                <Settings size={16} />
              </button>
              <button
                onClick={() => logoutUser()}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">Panel de Control</h2>
          <p className="text-primary-100 mb-6">Gestiona tu restaurante y platos</p>

          <button
            onClick={() => setShowDishForm(true)}
            className="bg-white text-primary-600 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Agregar Nuevo Plato</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Platos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDishes}</p>
              </div>
              <ChefHat className="text-primary-500" size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Calificación Promedio</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
              </div>
              <Star className="text-yellow-500" size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vistas Estimadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="text-blue-500" size={24} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reseñas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
              </div>
              <TrendingUp className="text-green-500" size={24} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("dishes")}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "dishes"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <ChefHat size={16} />
                <span>Mis Platos ({dishes.length})</span>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : dishes.length === 0 ? (
              <div className="text-center py-12">
                <ChefHat size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes platos registrados</h3>
                <p className="text-gray-500 mb-4">Comienza agregando tu primer plato al menú</p>
                <button onClick={() => setShowDishForm(true)} className="btn-primary">
                  Agregar Primer Plato
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Mis Platos</h3>
                  <button onClick={() => setShowDishForm(true)} className="btn-primary flex items-center space-x-2">
                    <Plus size={16} />
                    <span>Agregar Plato</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {dishes.map((dish) => (
                    <div
                      key={dish.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <img
                        src={dish.primary_image_url || "/placeholder.svg?height=80&width=80&text=Sin+Imagen"}
                        alt={dish.name}
                        className="w-20 h-20 rounded-lg object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=80&width=80&text=Error"
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 truncate">{dish.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{dish.category_name}</p>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{dish.description}</p>
                          </div>

                          <div className="flex items-center space-x-4 ml-4">
                            <div className="text-right">
                              <div className="text-lg font-bold text-primary-500">{formatCurrency(dish.price)}</div>
                              <div className="flex items-center space-x-1 text-sm text-gray-600">
                                <Star className="text-yellow-400 fill-current" size={14} />
                                <span>{(Number(dish.average_rating) || 0).toFixed(1)}</span>
                                <span>({dish.total_reviews || 0})</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  dish.is_available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                              >
                                {dish.is_available ? "Disponible" : "No disponible"}
                              </span>

                              <button
                                onClick={() => handleEditDish(dish)}
                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                title="Editar plato"
                              >
                                <Edit size={16} />
                              </button>

                              <button
                                onClick={() => handleDeleteDish(dish.id)}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                title="Eliminar plato"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                          {dish.ingredients && dish.ingredients.length > 0 && (
                            <span>
                              Ingredientes: {dish.ingredients.slice(0, 3).join(", ")}
                              {dish.ingredients.length > 3 ? "..." : ""}
                            </span>
                          )}
                          {dish.calories && <span>{dish.calories} cal</span>}
                          {dish.prep_time_minutes && <span>{dish.prep_time_minutes} min</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dish Form Modal */}
      {showDishForm && (
        <DishForm
          categories={categories}
          dish={editingDish}
          onClose={() => {
            setShowDishForm(false)
            setEditingDish(null)
          }}
          onSuccess={handleDishSuccess}
        />
      )}
    </div>
  )
}
