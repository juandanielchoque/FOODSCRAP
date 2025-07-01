import mysql from "mysql2/promise"

if (
  !process.env.DB_HOST ||
  !process.env.DB_USER ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_NAME ||
  !process.env.DB_PORT
) {
  throw new Error("🚨 Faltan variables de entorno para conectarse a la base de datos.")
}

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT), // 👈 importante convertirlo a número
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}


let pool: mysql.Pool | null = null

export function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig)
  }
  return pool
}

export async function executeQuery(query: string, params: any[] = []) {
  const connection = getPool()
  try {
    console.log("Executing query:", query)
    console.log("With params:", params)

    const [results] = await connection.execute(query, params)
    return results
  } catch (error) {
    console.error("Database query error:", error)
    console.error("Query was:", query)
    console.error("Params were:", params)
    throw error
  }
}

// Función para generar UUID (compatible con MySQL)
export function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
