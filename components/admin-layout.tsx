"use client"

import type React from "react"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Shield } from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900">
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="text-white" />
              <Separator orientation="vertical" className="mr-2 h-4 bg-slate-600" />
              <Shield className="w-5 h-5 text-red-500" />
              <h1 className="text-xl font-semibold text-white">Panneau d'Administration</h1>
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}