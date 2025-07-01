import { getCurrentUser } from "@/lib/auth-actions"
import { redirect } from "next/navigation"
import { EstablishmentDashboard } from "@/components/establishment/dashboard"

export default async function EstablishmentDashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/")
  }

  if (user.user_type !== "establishment") {
    redirect("/consumer/dashboard")
  }

  return <EstablishmentDashboard user={user} />
}
