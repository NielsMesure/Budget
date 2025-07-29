"use client"

import { BarChart3, CreditCard, Home, PlusCircle, Settings, Target, TrendingUp } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
    title: "Comptes",
    url: "/dashboard/accounts",
    icon: CreditCard,
  },
  {
    title: "Budgets",
    url: "/dashboard/budgets",
    icon: Target,
  },
  {
    title: "Transactions",
    url: "/dashboard/transactions",
    icon: PlusCircle,
  },
  {
    title: "Analyse",
    url: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Objectifs",
    url: "/dashboard/goals",
    icon: TrendingUp,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

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
          <SidebarMenuItem>
            <SidebarMenuButton className="text-slate-300 hover:text-white hover:bg-slate-700">
              <Settings className="w-4 h-4" />
              <span>Paramètres</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
