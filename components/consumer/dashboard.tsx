"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { User } from "@/lib/auth-actions"
import { getDishes, getCategories, type Dish, type DishCategory } from "@/lib/dish-actions"
import { Search, ChefHat, LogOut, SlidersHorizontal } from "lucide-react"
import { logoutUser } from "@/lib/auth-actions"
import { DishCard } from "@/components/dishes/dish-card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface ConsumerDashboardProps {
  user: User
}

export function ConsumerDashboard({ user }: ConsumerDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [dishes, setDishes] = useState<Dish[]>([])
  const [categories, setCategories] = useState<DishCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<{
    category: string
    minPrice: string
    maxPrice: string
    isVegetarian: boolean
    isVegan: boolean
    isGlutenFree: boolean
    sortBy: "price" | "rating" | "name" | "average_rating"
    sortOrder: "asc" | "desc"
  }>({
    category: "",
    minPrice: "",
    maxPrice: "",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    sortBy: "rating",
    sortOrder: "desc",
  })

  useEffect(() => {
    loadData()
  }, [filters, searchQuery])

  async function loadData() {
    setIsLoading(true)
    try {
      const [dishesData, categoriesData] = await Promise.all([
        getDishes({
          search: searchQuery || undefined,
          category: filters.category || undefined,
          minPrice: filters.minPrice ? Number.parseFloat(filters.minPrice) : undefined,
          maxPrice: filters.maxPrice ? Number.parseFloat(filters.maxPrice) : undefined,
          isVegetarian: filters.isVegetarian || undefined,
          isVegan: filters.isVegan || undefined,
          isGlutenFree: filters.isGlutenFree || undefined,
          sortBy: filters.sortBy === "rating" ? "average_rating" : filters.sortBy,
          sortOrder: filters.sortOrder,
          limit: 20,
        }),
        getCategories(),
      ])

      setDishes(dishesData)
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    loadData()
  }

  function clearFilters() {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      sortBy: "rating",
      sortOrder: "desc",
    })
    setSearchQuery("")
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
              <h1 className="text-xl font-bold text-gray-900">FoodScrap</h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Hola, {user.name}</span>
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
          <h2 className="text-3xl font-bold mb-2">¡Bienvenido, {user.name}!</h2>
          <p className="text-primary-100 mb-6">Descubre los mejores platos cerca de ti</p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar platos, restaurantes o cocinas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-20 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <SlidersHorizontal size={20} />
            </button>
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-lg transition-colors"
            >
              <Search size={16} />
            </button>
          </form>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filtros</h3>
              <button onClick={clearFilters} className="text-primary-500 hover:text-primary-600 text-sm font-medium">
                Limpiar filtros
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="form-label">Categoría</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="form-input"
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Precio mínimo</label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="form-input"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="form-label">Precio máximo</label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="form-input"
                  placeholder="1000"
                />
              </div>

              <div>
                <label className="form-label">Ordenar por</label>
                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split("-")
                    setFilters({ ...filters, sortBy: sortBy as any, sortOrder: sortOrder as any })
                  }}
                  className="form-input"
                >
                  <option value="average_rating-desc">Mejor calificados</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                  <option value="name-asc">Nombre: A-Z</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.isVegetarian}
                  onChange={(e) => setFilters({ ...filters, isVegetarian: e.target.checked })}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm">Vegetariano</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.isVegan}
                  onChange={(e) => setFilters({ ...filters, isVegan: e.target.checked })}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm">Vegano</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.isGlutenFree}
                  onChange={(e) => setFilters({ ...filters, isGlutenFree: e.target.checked })}
                  className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm">Sin Gluten</span>
              </label>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {searchQuery ? `Resultados para "${searchQuery}"` : "Platos Destacados"}
              <span className="text-lg font-normal text-gray-500 ml-2">({dishes.length} platos)</span>
            </h3>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : dishes.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron platos</h3>
              <p className="text-gray-500">Intenta ajustar tus filtros de búsqueda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} />
              ))}
            </div>
          )}
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Explorar por Categoría</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 12).map((category) => (
              <button
                key={category.id}
                onClick={() => setFilters({ ...filters, category: category.name })}
                className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="text-3xl mb-2">🍽️</div>
                <h4 className="font-medium text-gray-900 text-sm">{category.name}</h4>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
