import mysql from "mysql2/promise"

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "danny",
  database: process.env.DB_NAME || "foodscrap",
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
