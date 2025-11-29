"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Lamp,
  LayoutGrid,
  FolderClosed,
  FolderOpen,
  Clock,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  Plus,
  Menu,
  X,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { mockFolders, mockUser } from "@/lib/mock-data";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [foldersExpanded, setFoldersExpanded] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navigation = [
    { name: "Recent Files", href: "/dashboard", icon: LayoutGrid },
    { name: "Uncategorized", href: "/dashboard/uncategorized", icon: FileText },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-4 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-lamp">
            <Lamp className="h-5 w-5 text-lamp-dark" />
          </div>
          {sidebarOpen && (
            <span className="text-lg font-bold tracking-tight">LampScribe</span>
          )}
        </Link>
      </div>

      {/* Plan Badge */}
      {sidebarOpen && (
        <div className="px-3 py-4">
          <div className="flex items-center gap-2 rounded-lg gradient-lamp px-3 py-2">
            <Crown className="h-4 w-4 text-lamp-dark" />
            <span className="text-sm font-semibold text-lamp-dark">
              {mockUser.plan === "unlimited" ? "Unlimited" : "Free Plan"}
            </span>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 px-3">
        {/* Shortcuts */}
        <div className="py-2">
          {sidebarOpen && (
            <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Shortcuts
            </p>
          )}
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {sidebarOpen && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Folders */}
        <div className="py-2">
          {sidebarOpen && (
            <button
              onClick={() => setFoldersExpanded(!foldersExpanded)}
              className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
            >
              <span>Folders</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  foldersExpanded && "rotate-180"
                )}
              />
            </button>
          )}
          {(!sidebarOpen || foldersExpanded) && (
            <nav className="space-y-1">
              {mockFolders.map((folder) => {
                const isActive = pathname === `/dashboard/folder/${folder.id}`;
                return (
                  <Link
                    key={folder.id}
                    href={`/dashboard/folder/${folder.id}`}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    {isActive ? (
                      <FolderOpen className="h-4 w-4 shrink-0" />
                    ) : (
                      <FolderClosed className="h-4 w-4 shrink-0" />
                    )}
                    {sidebarOpen && (
                      <>
                        <span className="flex-1 truncate">{folder.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {folder.transcriptCount}
                        </span>
                      </>
                    )}
                  </Link>
                );
              })}
              {sidebarOpen && (
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>New Folder</span>
                </button>
              )}
            </nav>
          )}
        </div>
      </ScrollArea>

      {/* User Menu */}
      <div className="border-t border-sidebar-border p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-sidebar-accent/50 transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {mockUser.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              {sidebarOpen && (
                <>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium truncate">{mockUser.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {mockUser.email}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 flex flex-col bg-sidebar border-r border-sidebar-border">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between h-16 px-4 border-b border-border bg-background">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-muted"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-lamp">
              <Lamp className="h-4 w-4 text-lamp-dark" />
            </div>
            <span className="font-bold">LampScribe</span>
          </Link>
          <div className="w-10" />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

