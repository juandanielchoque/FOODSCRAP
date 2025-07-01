"use server"

import { executeQuery, generateUUID } from "./database"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export interface User {
  id: string
  email: string
  name: string
  user_type: "consumer" | "establishment"
  phone?: string
  profile_image_url?: string
  is_verified: boolean
}

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const userType = formData.get("userType") as "consumer" | "establishment"

  if (!email || !password || !name || !userType) {
    return { error: "Todos los campos son obligatorios" }
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = (await executeQuery("SELECT id FROM users WHERE email = ?", [email])) as any[]

    if (existingUser.length > 0) {
      return { error: "El email ya está registrado" }
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)
    const userId = generateUUID()

    // Formatear teléfono peruano
    const formattedPhone = phone ? formatPeruvianPhone(phone) : null

    // Insertar nuevo usuario
    await executeQuery(
      "INSERT INTO users (id, email, password_hash, user_type, name, phone) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, email, hashedPassword, userType, name, formattedPhone],
    )

    // Si es un establecimiento, crear registro en establishments
    if (userType === "establishment") {
      const establishmentId = generateUUID()
      await executeQuery(
        "INSERT INTO establishments (id, user_id, business_name, address, city, country) VALUES (?, ?, ?, ?, ?, ?)",
        [establishmentId, userId, name, "Dirección pendiente", "Lima", "Perú"],
      )
    }

    // Crear sesión
    const cookieStore = await cookies()
    cookieStore.set(
      "user_session",
      JSON.stringify({
        id: userId,
        email,
        name,
        user_type: userType,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 días
      },
    )

    return { success: true, user: { id: userId, email, name, user_type: userType } }
  } catch (error) {
    console.error("Error registering user:", error)
    return { error: "Error al registrar usuario" }
  }
}

function formatPeruvianPhone(phone: string): string {
  // Limpiar el número
  const cleaned = phone.replace(/\D/g, "")

  // Si ya tiene código de país
  if (cleaned.startsWith("51") && cleaned.length === 11) {
    return `+51-${cleaned.substring(2, 5)}-${cleaned.substring(5, 8)}-${cleaned.substring(8)}`
  }

  // Si es un número de 9 dígitos (celular peruano)
  if (cleaned.length === 9 && cleaned.startsWith("9")) {
    return `+51-${cleaned.substring(0, 3)}-${cleaned.substring(3, 6)}-${cleaned.substring(6)}`
  }

  // Formato por defecto
  return `+51-${phone}`
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email y contraseña son obligatorios" }
  }

  try {
    const users = (await executeQuery(
      "SELECT id, email, password_hash, name, user_type, phone, profile_image_url, is_verified FROM users WHERE email = ?",
      [email],
    )) as any[]

    if (users.length === 0) {
      return { error: "Usuario no encontrado" }
    }

    const user = users[0]
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return { error: "Contraseña incorrecta" }
    }

    // Crear sesión
    const cookieStore = await cookies()
    cookieStore.set(
      "user_session",
      JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        user_type: user.user_type,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 días
      },
    )

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        user_type: user.user_type,
        phone: user.phone,
        profile_image_url: user.profile_image_url,
        is_verified: user.is_verified,
      },
    }
  } catch (error) {
    console.error("Error logging in user:", error)
    return { error: "Error al iniciar sesión" }
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("user_session")

    if (!sessionCookie) {
      return null
    }

    const session = JSON.parse(sessionCookie.value)

    // Verificar que el usuario aún existe en la base de datos
    const users = (await executeQuery(
      "SELECT id, email, name, user_type, phone, profile_image_url, is_verified FROM users WHERE id = ?",
      [session.id],
    )) as any[]

    if (users.length === 0) {
      return null
    }

    return users[0] as User
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function logoutUser() {
  const cookieStore = await cookies()
  cookieStore.delete("user_session")
  redirect("/")
}
