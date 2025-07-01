"use client"

import { useState } from "react"
import { Star, ThumbsUp, ThumbsDown } from "lucide-react"
import type { Review } from "@/lib/review-actions"
import type { User } from "@/lib/auth-actions"
import { formatDate } from "@/lib/utils"
import { voteReview } from "@/lib/review-actions"

interface ReviewCardProps {
  review: Review
  currentUser: User | null
}

export function ReviewCard({ review, currentUser }: ReviewCardProps) {
  const [isVoting, setIsVoting] = useState(false)

  async function handleVote(isHelpful: boolean) {
    if (!currentUser || isVoting) return

    setIsVoting(true)
    try {
      await voteReview(review.id, isHelpful)
      window.location.reload() // Simple refresh for now
    } catch (error) {
      console.error("Error voting:", error)
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-gray-900">{review.reviewer_name}</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}
                />
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {formatDate(review.created_at)}
            {review.visit_date && ` • Visitó el ${formatDate(review.visit_date)}`}
          </div>
        </div>
      </div>

      {review.title && <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>}

      {review.comment && <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>}

      {/* Detailed Ratings */}
      {(review.food_rating || review.service_rating || review.ambiance_rating || review.value_rating) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          {review.food_rating && (
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">Comida</div>
              <div className="flex justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i < review.food_rating! ? "text-yellow-400 fill-current" : "text-gray-300"}
                  />
                ))}
              </div>
            </div>
          )}
          {review.service_rating && (
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">Servicio</div>
              <div className="flex justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i < review.service_rating! ? "text-yellow-400 fill-current" : "text-gray-300"}
                  />
                ))}
              </div>
            </div>
          )}
          {review.ambiance_rating && (
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">Ambiente</div>
              <div className="flex justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i < review.ambiance_rating! ? "text-yellow-400 fill-current" : "text-gray-300"}
                  />
                ))}
              </div>
            </div>
          )}
          {review.value_rating && (
            <div className="text-center">
              <div className="text-xs text-gray-600 mb-1">Precio/Calidad</div>
              <div className="flex justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i < review.value_rating! ? "text-yellow-400 fill-current" : "text-gray-300"}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vote buttons */}
      {currentUser && currentUser.id !== review.user_id && (
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">¿Te fue útil esta reseña?</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleVote(true)}
              disabled={isVoting}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600 transition-colors disabled:opacity-50"
            >
              <ThumbsUp size={16} />
              <span>Sí</span>
            </button>
            <button
              onClick={() => handleVote(false)}
              disabled={isVoting}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              <ThumbsDown size={16} />
              <span>No</span>
            </button>
          </div>
          {review.helpful_count > 0 && (
            <span className="text-sm text-gray-500">{review.helpful_count} personas encontraron esto útil</span>
          )}
        </div>
      )}
    </div>
  )
}
