"use server"

import { executeQuery, generateUUID } from "./database"
import { getCurrentUser } from "./auth-actions"
import { revalidatePath } from "next/cache"

export interface Review {
  id: string
  user_id: string
  establishment_id: string
  dish_id?: string
  rating: number
  title?: string
  comment?: string
  food_rating?: number
  service_rating?: number
  ambiance_rating?: number
  value_rating?: number
  visit_date?: string
  is_verified_purchase: boolean
  helpful_count: number
  created_at: string
  updated_at: string
  // Datos del usuario
  reviewer_name?: string
  // Datos del plato
  dish_name?: string
  // Datos del establecimiento
  business_name?: string
}

export async function getReviewsByDish(dishId: string): Promise<Review[]> {
  try {
    const reviews = (await executeQuery(
      `
      SELECT 
        r.*,
        u.name as reviewer_name,
        d.name as dish_name,
        e.business_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN dishes d ON r.dish_id = d.id
      JOIN establishments e ON r.establishment_id = e.id
      WHERE r.dish_id = ?
      ORDER BY r.created_at DESC
    `,
      [dishId],
    )) as Review[]

    return reviews
  } catch (error) {
    console.error("Error getting reviews by dish:", error)
    return []
  }
}

export async function getReviewsByEstablishment(establishmentId: string): Promise<Review[]> {
  try {
    const reviews = (await executeQuery(
      `
      SELECT 
        r.*,
        u.name as reviewer_name,
        d.name as dish_name,
        e.business_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN dishes d ON r.dish_id = d.id
      JOIN establishments e ON r.establishment_id = e.id
      WHERE r.establishment_id = ?
      ORDER BY r.created_at DESC
    `,
      [establishmentId],
    )) as Review[]

    return reviews
  } catch (error) {
    console.error("Error getting reviews by establishment:", error)
    return []
  }
}

export async function createReview(formData: FormData) {
  const user = await getCurrentUser()

  if (!user || user.user_type !== "consumer") {
    return { error: "Solo los consumidores pueden escribir reseñas" }
  }

  try {
    const dishId = formData.get("dishId") as string
    const establishmentId = formData.get("establishmentId") as string
    const rating = Number.parseInt(formData.get("rating") as string)
    const title = formData.get("title") as string
    const comment = formData.get("comment") as string
    const foodRating = formData.get("foodRating") ? Number.parseInt(formData.get("foodRating") as string) : null
    const serviceRating = formData.get("serviceRating")
      ? Number.parseInt(formData.get("serviceRating") as string)
      : null
    const ambianceRating = formData.get("ambianceRating")
      ? Number.parseInt(formData.get("ambianceRating") as string)
      : null
    const valueRating = formData.get("valueRating") ? Number.parseInt(formData.get("valueRating") as string) : null
    const visitDate = formData.get("visitDate") as string

    if (!rating || rating < 1 || rating > 5) {
      return { error: "La calificación debe ser entre 1 y 5 estrellas" }
    }

    if (!establishmentId) {
      return { error: "ID del establecimiento es requerido" }
    }

    // Verificar que el usuario no haya reseñado ya este plato
    const existingReviews = (await executeQuery(
      `
      SELECT id FROM reviews 
      WHERE user_id = ? AND establishment_id = ? AND dish_id = ?
    `,
      [user.id, establishmentId, dishId || null],
    )) as any[]

    if (existingReviews.length > 0) {
      return { error: "Ya has reseñado este plato" }
    }

    const reviewId = generateUUID()

    await executeQuery(
      `
      INSERT INTO reviews (
        id, user_id, establishment_id, dish_id, rating, title, comment,
        food_rating, service_rating, ambiance_rating, value_rating, visit_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        reviewId,
        user.id,
        establishmentId,
        dishId || null,
        rating,
        title,
        comment,
        foodRating,
        serviceRating,
        ambianceRating,
        valueRating,
        visitDate || null,
      ],
    )

    // Actualizar calificación promedio del plato
    if (dishId) {
      await updateDishRating(dishId)
    }

    // Actualizar calificación promedio del establecimiento
    await updateEstablishmentRating(establishmentId)

    revalidatePath(`/dish/${dishId}`)
    return { success: true, reviewId }
  } catch (error) {
    console.error("Error creating review:", error)
    return { error: "Error al crear la reseña" }
  }
}

async function updateDishRating(dishId: string) {
  try {
    const result = (await executeQuery(
      `
      SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews
      FROM reviews WHERE dish_id = ?
    `,
      [dishId],
    )) as any[]

    if (result.length > 0) {
      const { avg_rating, total_reviews } = result[0]
      await executeQuery(
        `
        UPDATE dishes 
        SET average_rating = ?, total_reviews = ?
        WHERE id = ?
      `,
        [avg_rating || 0, total_reviews || 0, dishId],
      )
    }
  } catch (error) {
    console.error("Error updating dish rating:", error)
  }
}

async function updateEstablishmentRating(establishmentId: string) {
  try {
    const result = (await executeQuery(
      `
      SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews
      FROM reviews WHERE establishment_id = ?
    `,
      [establishmentId],
    )) as any[]

    if (result.length > 0) {
      const { avg_rating, total_reviews } = result[0]
      await executeQuery(
        `
        UPDATE establishments 
        SET average_rating = ?, total_reviews = ?
        WHERE id = ?
      `,
        [avg_rating || 0, total_reviews || 0, establishmentId],
      )
    }
  } catch (error) {
    console.error("Error updating establishment rating:", error)
  }
}

export async function voteReview(reviewId: string, isHelpful: boolean) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "Debes iniciar sesión para votar" }
  }

  try {
    // Verificar si ya votó
    const existingVotes = (await executeQuery(
      `
      SELECT id FROM review_votes 
      WHERE user_id = ? AND review_id = ?
    `,
      [user.id, reviewId],
    )) as any[]

    if (existingVotes.length > 0) {
      // Actualizar voto existente
      await executeQuery(
        `
        UPDATE review_votes 
        SET is_helpful = ?
        WHERE user_id = ? AND review_id = ?
      `,
        [isHelpful, user.id, reviewId],
      )
    } else {
      // Crear nuevo voto
      const voteId = generateUUID()
      await executeQuery(
        `
        INSERT INTO review_votes (id, user_id, review_id, is_helpful)
        VALUES (?, ?, ?, ?)
      `,
        [voteId, user.id, reviewId, isHelpful],
      )
    }

    // Actualizar contador de votos útiles
    const helpfulCount = (await executeQuery(
      `
      SELECT COUNT(*) as count FROM review_votes 
      WHERE review_id = ? AND is_helpful = TRUE
    `,
      [reviewId],
    )) as any[]

    await executeQuery(
      `
      UPDATE reviews SET helpful_count = ? WHERE id = ?
    `,
      [helpfulCount[0]?.count || 0, reviewId],
    )

    return { success: true }
  } catch (error) {
    console.error("Error voting review:", error)
    return { error: "Error al votar la reseña" }
  }
}
