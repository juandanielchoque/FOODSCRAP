import { getCurrentUser } from "@/lib/auth-actions"
import { redirect } from "next/navigation"
import { ConsumerDashboard } from "@/components/consumer/dashboard"

export default async function ConsumerDashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/")
  }

  if (user.user_type !== "consumer") {
    redirect("/establishment/dashboard")
  }

  return <ConsumerDashboard user={user} />
}
