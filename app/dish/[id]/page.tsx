import { getDishById } from "@/lib/dish-actions"
import { getReviewsByDish } from "@/lib/review-actions"
import { getCurrentUser } from "@/lib/auth-actions"
import { DishDetail } from "@/components/dishes/dish-detail"
import { notFound } from "next/navigation"

interface DishPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function DishPage({ params }: DishPageProps) {
  // Await params in Next.js 15
  const { id } = await params

  const dish = await getDishById(id)

  if (!dish) {
    notFound()
  }

  const reviews = await getReviewsByDish(id)
  const user = await getCurrentUser()

  return <DishDetail dish={dish} reviews={reviews} currentUser={user} />
}
