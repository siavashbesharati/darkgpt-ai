import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, Zap, LayoutDashboard, MessageSquarePlus, LogOut, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
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
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md h-16">
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
            <Link to="/editor" className={cn("px-4 py-2 text-sm font-medium rounded-md", location.pathname === '/editor' ? "text-cyan-500" : "text-slate-500 hover:text-slate-900")}>Workspace</Link>
            <Link to="/pricing" className={cn("px-4 py-2 text-sm font-medium rounded-md", location.pathname === '/pricing' ? "text-cyan-500" : "text-slate-500 hover:text-slate-900")}>Pricing</Link>
            {user?.isAdmin && (
              <Link to="/admin" className={cn("px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2", location.pathname === '/admin' ? "text-cyan-500" : "text-slate-500 hover:text-slate-900")}>
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
                <span className="text-xs font-medium">{user?.credits} Tokens</span>
                <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-none px-1.5 text-[10px]">
                  {user?.tier}
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full bg-slate-100 dark:bg-slate-900">
                    <UserIcon className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-500">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button onClick={() => setAuthOpen(true)} className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full px-6">
              Sign In
            </Button>
          )}
          <ThemeToggle className="relative top-0 right-0" />
        </div>
      </div>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </nav>
  );
}