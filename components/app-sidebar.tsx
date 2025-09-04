"use client"

import { BarChart3, CreditCard, Home, PlusCircle, Settings, Target, TrendingUp, LogOut, Shield } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

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

const menuItems = [
  {
    title: "Synthèse",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Transactions",
    url: "/dashboard/transactions",
    icon: PlusCircle,
  },
  {
    title: "Budgets",
    url: "/dashboard/budgets",
    icon: Target,
  },
  {
    title: "Analyse",
    url: "/dashboard/analytics",
    icon: BarChart3,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const userDataString = localStorage.getItem('userData')
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString)
        setIsAdmin(userData.isAdmin || false)
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  const handleLogout = () => {
    console.log('Logout clicked')
    localStorage.removeItem("userId")
    localStorage.removeItem("userData")
    router.push("/")
  }

  return (
    <Sidebar className="bg-slate-800 border-slate-700">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">MT</span>
          </div>
          <span className="text-white font-semibold">MoneyTracker</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="text-slate-300 hover:text-white hover:bg-slate-700 data-[active=true]:bg-purple-600 data-[active=true]:text-white"
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
          {isAdmin && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="text-slate-300 hover:text-white hover:bg-slate-700">
                <Link href="/admin">
                  <Shield className="w-4 h-4" />
                  <span>Administration</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-slate-300 hover:text-white hover:bg-slate-700">
              <Link href="/dashboard/settings">
                <Settings className="w-4 h-4" />
                <span>Paramètres</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer">
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
