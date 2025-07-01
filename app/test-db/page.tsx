import { executeQuery } from "@/lib/database"

export default async function TestDB() {
  try {
    const result = await executeQuery("SELECT 1 as test")
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-green-600">✅ Conexión exitosa!</h1>
        <pre className="mt-4 p-4 bg-gray-100 rounded">{JSON.stringify(result, null, 2)}</pre>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">❌ Error de conexión</h1>
        <pre className="mt-4 p-4 bg-red-100 rounded text-red-800">
          {error instanceof Error ? error.message : "Error desconocido"}
        </pre>
      </div>
    )
  }
}
