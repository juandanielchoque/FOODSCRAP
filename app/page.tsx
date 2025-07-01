"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { ChefHat, Star, Users, TrendingUp } from "lucide-react"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-500 p-2 rounded-lg">
                <ChefHat className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">FoodScrap</h1>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Star className="text-primary-500" size={16} />
                <span>Compara platos</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="text-primary-500" size={16} />
                <span>Reseñas reales</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="text-primary-500" size={16} />
                <span>Mejores precios</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
        {/* Left Side - Hero */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
          <div className="max-w-md text-center lg:text-left">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Descubre los mejores
              <span className="text-primary-500 block">platos del Perú</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Compara precios, lee reseñas auténticas y encuentra tu próxima comida favorita. Únete a la comunidad
              gastronómica más grande del Perú.
            </p>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-primary-500">500+</div>
                <div className="text-sm text-gray-600">Restaurantes</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-primary-500">2000+</div>
                <div className="text-sm text-gray-600">Platos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {/* Tab Navigation */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
                <button
                  onClick={() => setActiveTab("login")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "login" ? "bg-white text-primary-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => setActiveTab("register")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "register"
                      ? "bg-white text-primary-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Registrarse
                </button>
              </div>

              {/* Form Content */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {activeTab === "login" ? "¡Bienvenido de vuelta!" : "¡Únete a FoodScrap!"}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {activeTab === "login"
                      ? "Inicia sesión para continuar explorando"
                      : "Crea tu cuenta y comienza a descubrir"}
                  </p>
                </div>

                {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-6 text-sm text-gray-500">
              Al continuar, aceptas nuestros{" "}
              <a href="#" className="text-primary-500 hover:text-primary-600">
                Términos de Servicio
              </a>{" "}
              y{" "}
              <a href="#" className="text-primary-500 hover:text-primary-600">
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
