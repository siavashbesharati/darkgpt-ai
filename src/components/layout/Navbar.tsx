import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, Zap, LayoutDashboard, LogOut, User as UserIcon, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { AuthModal } from '@/components/auth/AuthModal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
export function Navbar() {
  const location = useLocation();
  const user = useStore(s => s.user);
  const isAuthenticated = useStore(s => s.isAuthenticated);
  const logout = useStore(s => s.logout);
  const [authOpen, setAuthOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-[60] w-full border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-600">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
              AetherCode
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <Link to="/editor" className={cn(
              "px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors",
              location.pathname === '/editor' ? "text-cyan-500 bg-cyan-500/5" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            )}>
              <History className="w-4 h-4" /> Workspace
            </Link>
            <Link to="/pricing" className={cn(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              location.pathname === '/pricing' ? "text-cyan-500 bg-cyan-500/5" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            )}>
              Pricing
            </Link>
            {user?.isAdmin && (
              <Link to="/admin" className={cn(
                "px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors",
                location.pathname === '/admin' ? "text-cyan-500 bg-cyan-500/5" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              )}>
                <LayoutDashboard className="w-4 h-4" /> Admin
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5">
                <Zap className="w-3.5 h-3.5 text-cyan-500" />
                <span className="text-xs font-bold tracking-tight">{user?.credits}</span>
                <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-none px-1.5 text-[10px] font-bold uppercase">
                  {user?.tier}
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 h-10 w-10">
                    <UserIcon className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuLabel className="flex flex-col">
                    <span className="text-sm font-bold truncate">{user?.email}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">{user?.tier} Member</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/editor" className="cursor-pointer">Workspace</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/pricing" className="cursor-pointer">Upgrade Plan</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button onClick={() => setAuthOpen(true)} className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold rounded-full px-8 shadow-lg shadow-cyan-500/20">
              Launch
            </Button>
          )}
          <div className="border-l border-slate-200 dark:border-white/10 pl-4 h-6 flex items-center">
            <ThemeToggle className="relative top-0 right-0" />
          </div>
        </div>
      </div>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </nav>
  );
}