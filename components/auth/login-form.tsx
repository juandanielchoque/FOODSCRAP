"use client"

import { useState } from "react"
import { loginUser } from "@/lib/auth-actions"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError("")

    try {
      const result = await loginUser(formData)

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
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" />
            <span>Iniciando sesión...</span>
          </>
        ) : (
          <span>Iniciar Sesión</span>
        )}
      </button>
    </form>
  )
}
