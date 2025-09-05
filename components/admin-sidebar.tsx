"use client"

import { 
  BarChart3, 
  Users, 
  Settings, 
  Shield, 
  Database, 
  Activity,
  LogOut,
  Home,
  ChevronLeft,
  Mail
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"

const adminMenuItems = [
  {
    title: "Tableau de bord",
    url: "/admin",
    icon: BarChart3,
  },
  {
    title: "Utilisateurs",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Configuration Email",
    url: "/admin/email",
    icon: Mail,
  },
  {
    title: "Paramètres système",
    url: "/admin/system",
    icon: Settings,
  },
  {
    title: "Sécurité",
    url: "/admin/security",
    icon: Shield,
  },
  {
    title: "Base de données",
    url: "/admin/database",
    icon: Database,
  },
  {
    title: "Activité",
    url: "/admin/activity",
    icon: Activity,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("userId")
    localStorage.removeItem("userData")
    router.push("/")
  }

  const goToDashboard = () => {
    router.push("/dashboard")
  }

  return (
    <Sidebar className="bg-slate-800 border-slate-700">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold">Administration</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Panneau d'administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="text-slate-300 hover:text-white hover:bg-slate-700 data-[active=true]:bg-red-600 data-[active=true]:text-white"
                  >
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={goToDashboard} 
              className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Retour au dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout} 
              className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}