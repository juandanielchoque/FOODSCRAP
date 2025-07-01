"use client"
import { Users, Store } from "lucide-react"

interface UserTypeSelectorProps {
  onSelect: (type: "consumer" | "establishment") => void
  selectedType?: "consumer" | "establishment"
}

export function UserTypeSelector({ onSelect, selectedType }: UserTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <button
        type="button"
        onClick={() => onSelect("consumer")}
        className={`p-6 rounded-xl border-2 transition-all duration-200 ${
          selectedType === "consumer"
            ? "border-primary-500 bg-primary-50 text-primary-700"
            : "border-gray-200 hover:border-primary-300 hover:bg-primary-25"
        }`}
      >
        <div className="flex flex-col items-center space-y-3">
          <div
            className={`p-3 rounded-full ${
              selectedType === "consumer" ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            <Users size={24} />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg">Soy Consumidor</h3>
            <p className="text-sm text-gray-600 mt-1">Quiero descubrir y comparar platos de restaurantes</p>
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={() => onSelect("establishment")}
        className={`p-6 rounded-xl border-2 transition-all duration-200 ${
          selectedType === "establishment"
            ? "border-primary-500 bg-primary-50 text-primary-700"
            : "border-gray-200 hover:border-primary-300 hover:bg-primary-25"
        }`}
      >
        <div className="flex flex-col items-center space-y-3">
          <div
            className={`p-3 rounded-full ${
              selectedType === "establishment" ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            <Store size={24} />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg">Soy Restaurante</h3>
            <p className="text-sm text-gray-600 mt-1">Quiero mostrar mis platos y gestionar mi negocio</p>
          </div>
        </div>
      </button>
    </div>
  )
}
