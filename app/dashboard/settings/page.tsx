import { DashboardLayout } from "@/components/dashboard-layout"
import { UserSettings } from "@/components/user-settings"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Paramètres du compte</h1>
          <p className="text-slate-300 mt-2">Gérez vos informations personnelles et paramètres de sécurité</p>
        </div>
        <UserSettings />
      </div>
    </DashboardLayout>
  )
}