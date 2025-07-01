"use client"

import { useState } from "react"
import { registerUser } from "@/lib/auth-actions"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { UserTypeSelector } from "./user-type-selector"
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react"
import { useRouter } from "next/navigation"

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [userType, setUserType] = useState<"consumer" | "establishment">()
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    if (!userType) {
      setError("Por favor selecciona el tipo de cuenta")
      return
    }

    formData.append("userType", userType)
    setIsLoading(true)
    setError("")

    try {
      const result = await registerUser(formData)

      if (result.error) {
        setError(result.error)
      } else if (result.success && result.user) {
        // Redirigir según el tipo de usuario
        if (result.user.user_type === "consumer") {
          router.push("/consumer/dashboard")
        } else {
          router.push("/establishment/dashboard")
        }
      }
    } catch (error) {
      setError("Error inesperado. Intenta de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">¿Qué tipo de cuenta quieres crear?</h3>
        <UserTypeSelector onSelect={setUserType} selectedType={userType} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            {userType === "establishment" ? "Nombre del Restaurante" : "Nombre Completo"}
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder={userType === "establishment" ? "Restaurante El Buen Sabor" : "Juan Pérez"}
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="tel"
              id="phone"
              name="phone"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="+51 999 123 456"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            placeholder="tu@email.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            required
            minLength={6}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
      </div>

      <button
        type="submit"
        disabled={isLoading || !userType}
        className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" />
            <span>Creando cuenta...</span>
          </>
        ) : (
          <span>Crear Cuenta</span>
        )}
      </button>
    </form>
  )
}
