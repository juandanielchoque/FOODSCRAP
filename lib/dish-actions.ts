"use server"

import { executeQuery, generateUUID } from "./database"
import { getCurrentUser } from "./auth-actions"
import { revalidatePath } from "next/cache"

export interface Dish {
  id: string
  establishment_id: string
  category_id: string
  name: string
  description: string
  price: number
  currency: string
  ingredients: string[]
  allergens: string[]
  is_vegetarian: boolean
  is_vegan: boolean
  is_gluten_free: boolean
  calories?: number
  prep_time_minutes?: number
  spice_level?: number
  average_rating: number
  total_reviews: number
  is_available: boolean
  created_at: string
  updated_at: string
  // Datos del establecimiento
  business_name?: string
  city?: string
  cuisine_type?: string
  // Datos de la categoría
  category_name?: string
  // Imagen principal
  primary_image_url?: string
}

export interface DishCategory {
  id: string
  name: string
  description: string
}

export async function getDishes(filters?: {
  search?: string
  category?: string
  city?: string
  minPrice?: number
  maxPrice?: number
  isVegetarian?: boolean
  isVegan?: boolean
  isGlutenFree?: boolean
  sortBy?: "price" | "rating" | "name"
  sortOrder?: "asc" | "desc"
  limit?: number
  offset?: number
}) {
  try {
    // Consulta que incluye la imagen principal con COALESCE para fallback
    let query = `
      SELECT 
        d.id,
        d.establishment_id,
        d.category_id,
        d.name,
        d.description,
        d.price,
        d.currency,
        d.ingredients,
        d.allergens,
        d.is_vegetarian,
        d.is_vegan,
        d.is_gluten_free,
        d.calories,
        d.prep_time_minutes,
        d.spice_level,
        d.average_rating,
        d.total_reviews,
        d.is_available,
        d.created_at,
        d.updated_at,
        e.business_name,
        e.city,
        e.cuisine_type,
        dc.name as category_name,
        COALESCE(
          img.url, 
          CONCAT('/placeholder.svg?height=400&width=600&text=', REPLACE(d.name, ' ', '+'))
        ) as primary_image_url
      FROM dishes d
      JOIN establishments e ON d.establishment_id = e.id
      LEFT JOIN dish_categories dc ON d.category_id = dc.id
      LEFT JOIN images img ON d.id = img.entity_id AND img.entity_type = 'dish' AND img.is_primary = 1
      WHERE d.is_available = 1 AND e.is_active = 1
    `

    const params: any[] = []

    if (filters?.search) {
      query += ` AND (d.name LIKE ? OR d.description LIKE ? OR e.business_name LIKE ?)`
      const searchTerm = `%${filters.search}%`
      params.push(searchTerm, searchTerm, searchTerm)
    }

    if (filters?.category) {
      query += ` AND dc.name = ?`
      params.push(filters.category)
    }

    if (filters?.city) {
      query += ` AND e.city = ?`
      params.push(filters.city)
    }

    if (filters?.minPrice !== undefined && filters.minPrice !== null) {
      query += ` AND d.price >= ?`
      params.push(filters.minPrice)
    }

    if (filters?.maxPrice !== undefined && filters.maxPrice !== null) {
      query += ` AND d.price <= ?`
      params.push(filters.maxPrice)
    }

    if (filters?.isVegetarian) {
      query += ` AND d.is_vegetarian = 1`
    }

    if (filters?.isVegan) {
      query += ` AND d.is_vegan = 1`
    }

    if (filters?.isGlutenFree) {
      query += ` AND d.is_gluten_free = 1`
    }

    // Ordenamiento
    const sortBy = filters?.sortBy || "average_rating"
    const sortOrder = filters?.sortOrder || "desc"

    let orderColumn = "d.average_rating"
    if (sortBy === "price") orderColumn = "d.price"
    else if (sortBy === "name") orderColumn = "d.name"
    else if (sortBy === "rating") orderColumn = "d.average_rating"

    query += ` ORDER BY ${orderColumn} ${sortOrder.toUpperCase()}`

    // Paginación
    const limit = filters?.limit && filters.limit > 0 ? filters.limit : 50
    query += ` LIMIT ${limit}`

    if (filters?.offset && filters.offset > 0) {
      query += ` OFFSET ${filters.offset}`
    }

    console.log("Final SQL Query:", query)
    console.log("Final SQL Params:", params)

    const dishes = (await executeQuery(query, params)) as any[]

    return dishes.map((dish) => ({
      ...dish,
      ingredients: dish.ingredients
        ? typeof dish.ingredients === "string"
          ? JSON.parse(dish.ingredients)
          : dish.ingredients
        : [],
      allergens: dish.allergens
        ? typeof dish.allergens === "string"
          ? JSON.parse(dish.allergens)
          : dish.allergens
        : [],
      average_rating: Number(dish.average_rating) || 0,
      total_reviews: Number(dish.total_reviews) || 0,
      price: Number(dish.price) || 0,
    })) as Dish[]
  } catch (error) {
    console.error("Error getting dishes:", error)
    return []
  }
}

export async function getDishById(id: string): Promise<Dish | null> {
  try {
    const query = `
      SELECT 
        d.id,
        d.establishment_id,
        d.category_id,
        d.name,
        d.description,
        d.price,
        d.currency,
        d.ingredients,
        d.allergens,
        d.is_vegetarian,
        d.is_vegan,
        d.is_gluten_free,
        d.calories,
        d.prep_time_minutes,
        d.spice_level,
        d.average_rating,
        d.total_reviews,
        d.is_available,
        d.created_at,
        d.updated_at,
        e.business_name,
        e.city,
        e.cuisine_type,
        e.address,
        e.phone,
        dc.name as category_name,
        COALESCE(
          img.url, 
          CONCAT('/placeholder.svg?height=400&width=600&text=', REPLACE(d.name, ' ', '+'))
        ) as primary_image_url
      FROM dishes d
      JOIN establishments e ON d.establishment_id = e.id
      LEFT JOIN dish_categories dc ON d.category_id = dc.id
      LEFT JOIN images img ON d.id = img.entity_id AND img.entity_type = 'dish' AND img.is_primary = 1
      WHERE d.id = ?
    `

    const dishes = (await executeQuery(query, [id])) as any[]

    if (dishes.length === 0) return null

    const dish = dishes[0]
    return {
      ...dish,
      ingredients: dish.ingredients
        ? typeof dish.ingredients === "string"
          ? JSON.parse(dish.ingredients)
          : dish.ingredients
        : [],
      allergens: dish.allergens
        ? typeof dish.allergens === "string"
          ? JSON.parse(dish.allergens)
          : dish.allergens
        : [],
      average_rating: Number(dish.average_rating) || 0,
      total_reviews: Number(dish.total_reviews) || 0,
      price: Number(dish.price) || 0,
    } as Dish
  } catch (error) {
    console.error("Error getting dish by id:", error)
    return null
  }
}

export async function getCategories(): Promise<DishCategory[]> {
  try {
    const categories = (await executeQuery("SELECT * FROM dish_categories ORDER BY name")) as DishCategory[]
    return categories
  } catch (error) {
    console.error("Error getting categories:", error)
    return []
  }
}

export async function createDish(formData: FormData) {
  const user = await getCurrentUser()

  if (!user || user.user_type !== "establishment") {
    return { error: "No tienes permisos para crear platos" }
  }

  try {
    // Obtener el establishment_id del usuario
    const establishments = (await executeQuery("SELECT id FROM establishments WHERE user_id = ?", [user.id])) as any[]

    if (establishments.length === 0) {
      return { error: "No se encontró el establecimiento asociado" }
    }

    const establishmentId = establishments[0].id

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const categoryId = formData.get("categoryId") as string
    const ingredients = formData.get("ingredients") as string
    const allergens = formData.get("allergens") as string
    const isVegetarian = formData.get("isVegetarian") === "true"
    const isVegan = formData.get("isVegan") === "true"
    const isGlutenFree = formData.get("isGlutenFree") === "true"
    const calories = formData.get("calories") ? Number.parseInt(formData.get("calories") as string) : null
    const prepTime = formData.get("prepTime") ? Number.parseInt(formData.get("prepTime") as string) : null
    const spiceLevel = formData.get("spiceLevel") ? Number.parseInt(formData.get("spiceLevel") as string) : null

    if (!name || !description || !price || !categoryId) {
      return { error: "Todos los campos obligatorios deben ser completados" }
    }

    const dishId = generateUUID()
    const ingredientsArray = ingredients ? ingredients.split(",").map((i) => i.trim()) : []
    const allergensArray = allergens ? allergens.split(",").map((a) => a.trim()) : []

    await executeQuery(
      `
      INSERT INTO dishes (
        id, establishment_id, category_id, name, description, price,
        ingredients, allergens, is_vegetarian, is_vegan, is_gluten_free,
        calories, prep_time_minutes, spice_level
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        dishId,
        establishmentId,
        categoryId,
        name,
        description,
        price,
        JSON.stringify(ingredientsArray),
        JSON.stringify(allergensArray),
        isVegetarian,
        isVegan,
        isGlutenFree,
        calories,
        prepTime,
        spiceLevel,
      ],
    )

    // Crear imagen placeholder por defecto
    const imageId = generateUUID()
    const placeholderUrl = `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(name)}`

    await executeQuery(
      `
      INSERT INTO images (id, url, alt_text, uploaded_by, entity_type, entity_id, is_primary)
      VALUES (?, ?, ?, ?, 'dish', ?, TRUE)
    `,
      [imageId, placeholderUrl, `Imagen de ${name}`, user.id, dishId],
    )

    revalidatePath("/establishment/dashboard")
    return { success: true, dishId }
  } catch (error) {
    console.error("Error creating dish:", error)
    return { error: "Error al crear el plato" }
  }
}

export async function updateDish(dishId: string, formData: FormData) {
  const user = await getCurrentUser()

  if (!user || user.user_type !== "establishment") {
    return { error: "No tienes permisos para editar platos" }
  }

  try {
    // Verificar que el plato pertenece al establecimiento del usuario
    const dishes = (await executeQuery(
      `
      SELECT d.id FROM dishes d
      JOIN establishments e ON d.establishment_id = e.id
      WHERE d.id = ? AND e.user_id = ?
    `,
      [dishId, user.id],
    )) as any[]

    if (dishes.length === 0) {
      return { error: "No tienes permisos para editar este plato" }
    }

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const categoryId = formData.get("categoryId") as string
    const ingredients = formData.get("ingredients") as string
    const allergens = formData.get("allergens") as string
    const isVegetarian = formData.get("isVegetarian") === "true"
    const isVegan = formData.get("isVegan") === "true"
    const isGlutenFree = formData.get("isGlutenFree") === "true"
    const isAvailable = formData.get("isAvailable") === "true"
    const calories = formData.get("calories") ? Number.parseInt(formData.get("calories") as string) : null
    const prepTime = formData.get("prepTime") ? Number.parseInt(formData.get("prepTime") as string) : null
    const spiceLevel = formData.get("spiceLevel") ? Number.parseInt(formData.get("spiceLevel") as string) : null

    const ingredientsArray = ingredients ? ingredients.split(",").map((i) => i.trim()) : []
    const allergensArray = allergens ? allergens.split(",").map((a) => a.trim()) : []

    await executeQuery(
      `
      UPDATE dishes SET
        name = ?, description = ?, price = ?, category_id = ?,
        ingredients = ?, allergens = ?, is_vegetarian = ?, is_vegan = ?,
        is_gluten_free = ?, is_available = ?, calories = ?,
        prep_time_minutes = ?, spice_level = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [
        name,
        description,
        price,
        categoryId,
        JSON.stringify(ingredientsArray),
        JSON.stringify(allergensArray),
        isVegetarian,
        isVegan,
        isGlutenFree,
        isAvailable,
        calories,
        prepTime,
        spiceLevel,
        dishId,
      ],
    )

    revalidatePath("/establishment/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error updating dish:", error)
    return { error: "Error al actualizar el plato" }
  }
}

export async function deleteDish(dishId: string) {
  const user = await getCurrentUser()

  if (!user || user.user_type !== "establishment") {
    return { error: "No tienes permisos para eliminar platos" }
  }

  try {
    // Verificar que el plato pertenece al establecimiento del usuario
    const dishes = (await executeQuery(
      `
      SELECT d.id FROM dishes d
      JOIN establishments e ON d.establishment_id = e.id
      WHERE d.id = ? AND e.user_id = ?
    `,
      [dishId, user.id],
    )) as any[]

    if (dishes.length === 0) {
      return { error: "No tienes permisos para eliminar este plato" }
    }

    await executeQuery("DELETE FROM dishes WHERE id = ?", [dishId])

    revalidatePath("/establishment/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting dish:", error)
    return { error: "Error al eliminar el plato" }
  }
}

export async function getEstablishmentDishes(establishmentId?: string) {
  const user = await getCurrentUser()

  if (!user || user.user_type !== "establishment") {
    return []
  }

  try {
    const query = `
      SELECT 
        d.id,
        d.establishment_id,
        d.category_id,
        d.name,
        d.description,
        d.price,
        d.currency,
        d.ingredients,
        d.allergens,
        d.is_vegetarian,
        d.is_vegan,
        d.is_gluten_free,
        d.calories,
        d.prep_time_minutes,
        d.spice_level,
        d.average_rating,
        d.total_reviews,
        d.is_available,
        d.created_at,
        d.updated_at,
        dc.name as category_name,
        COALESCE(
          img.url, 
          CONCAT('/placeholder.svg?height=400&width=600&text=', REPLACE(d.name, ' ', '+'))
        ) as primary_image_url
      FROM dishes d
      JOIN establishments e ON d.establishment_id = e.id
      LEFT JOIN dish_categories dc ON d.category_id = dc.id
      LEFT JOIN images img ON d.id = img.entity_id AND img.entity_type = 'dish' AND img.is_primary = 1
      WHERE e.user_id = ?
      ORDER BY d.created_at DESC
    `

    const dishes = (await executeQuery(query, [user.id])) as any[]

    return dishes.map((dish) => ({
      ...dish,
      ingredients: dish.ingredients
        ? typeof dish.ingredients === "string"
          ? JSON.parse(dish.ingredients)
          : dish.ingredients
        : [],
      allergens: dish.allergens
        ? typeof dish.allergens === "string"
          ? JSON.parse(dish.allergens)
          : dish.allergens
        : [],
      average_rating: Number(dish.average_rating) || 0,
      total_reviews: Number(dish.total_reviews) || 0,
      price: Number(dish.price) || 0,
    })) as Dish[]
  } catch (error) {
    console.error("Error getting establishment dishes:", error)
    return []
  }
}
