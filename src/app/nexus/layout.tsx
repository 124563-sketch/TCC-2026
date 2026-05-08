
"use client";

import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarInset, SidebarTrigger } from "@/ui-forge/ui/sidebar";
import { BrainCircuit, LayoutDashboard, BarChart3, BookOpen, Settings, BookMarked, Eye, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionTimer } from "./_components/session-timer";
import { useSession } from "next-auth/react";

const navigation = [
  { name: "Visão Geral", href: "/nexus", icon: LayoutDashboard },
  { name: "Trilhas Técnicas", href: "/nexus/journeys", icon: BookOpen },
  { name: "Progresso", href: "/nexus/trophies", icon: BarChart3 },
  { name: "Glossário Técnico", href: "/nexus/codex", icon: BookMarked },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userName = session?.user?.name || session?.user?.email || "Estudante ML";
  const isSupervisor = session?.user?.role === "SUPERVISOR";
  const roleLabel = isSupervisor ? "Supervisor" : "Estudante";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar className="border-r border-slate-200" collapsible="icon">
          <SidebarHeader className="p-6 border-b border-slate-100">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform shrink-0">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-headline font-bold text-slate-900 tracking-tight group-data-[collapsible=icon]:hidden">ML Ascent</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="px-3 py-4">
            <SidebarGroup>
              <SidebarGroupLabel className="font-headline uppercase tracking-widest text-[10px] text-slate-400 mb-4 px-3 group-data-[collapsible=icon]:hidden">Plataforma de Engenharia</SidebarGroupLabel>
              <SidebarMenu className="gap-1">
                {navigation.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.name}
                      className="h-11 rounded-xl px-3 data-[active=true]:bg-primary/5 data-[active=true]:text-primary"
                    >
                      <Link href={item.href}>
                        <item.icon className="w-5 h-5" />
                        <span className="font-body font-semibold text-sm group-data-[collapsible=icon]:hidden">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                {isSupervisor && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/nexus/supervisor"}
                      tooltip="Supervisor"
                      className="h-11 rounded-xl px-3 data-[active=true]:bg-primary/5 data-[active=true]:text-primary"
                    >
                      <Link href="/nexus/supervisor">
                        <Eye className="w-5 h-5" />
                        <span className="font-body font-semibold text-sm group-data-[collapsible=icon]:hidden">Supervisor</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup className="mt-auto">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/nexus/settings"} className="h-11 rounded-xl px-3 hover:bg-slate-50" tooltip="Configurações">
                    <Link href="/nexus/settings">
                      <Settings className="w-5 h-5 text-slate-500" />
                      <span className="font-body font-semibold text-sm text-slate-600 group-data-[collapsible=icon]:hidden">Configurações</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <header className="h-16 border-b flex items-center px-4 md:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-30 justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-2" />
              <h1 className="font-headline font-bold text-slate-800 text-sm md:text-base line-clamp-1">
                {pathname === "/nexus/supervisor" ? "Painel do Supervisor" : navigation.find(item => pathname === item.href)?.name || "Módulo de Estudo"}
              </h1>
            </div>
            <div className="flex items-center gap-3 md:gap-6">
              <SessionTimer />
              <Link href="/nexus/settings" className="flex items-center gap-2 group">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-900 group-hover:text-primary transition-colors">{userName}</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-slate-400">{roleLabel}</span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                  <UserCircle className="w-6 h-6 text-slate-300" />
                </div>
              </Link>
            </div>
          </header>
          <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
