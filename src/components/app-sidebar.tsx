import React, { useState, useEffect, useCallback } from "react";
import { MessageSquarePlus, Trash2, Code2, Zap, History, Edit2, Check, X } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { chatService } from "@/lib/chat";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
export function AppSidebar(): JSX.Element {
  const currentSessionId = useStore(s => s.currentSessionId);
  const setCurrentSessionId = useStore(s => s.setCurrentSessionId);
  const sessions = useStore(s => s.sessions);
  const setSessions = useStore(s => s.setSessions);
  const userCredits = useStore(s => s.user?.credits ?? 0);
  const userTier = useStore(s => s.user?.tier ?? 'Free');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const loadSessions = useCallback(async () => {
    const res = await chatService.listSessions();
    if (res.success && res.data) {
      setSessions(res.data);
    }
  }, [setSessions]);
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);
  const handleNewChat = () => {
    const newId = crypto.randomUUID();
    setCurrentSessionId(newId);
    toast.info("New workspace initialized");
  };
  const handleDeleteSession = async () => {
    if (!deleteConfirmId) return;
    const res = await chatService.deleteSession(deleteConfirmId);
    if (res.success) {
      toast.success("Workspace archived");
      if (deleteConfirmId === currentSessionId) {
        setCurrentSessionId(null);
      }
      loadSessions();
    }
    setDeleteConfirmId(null);
  };
  const handleRename = async (id: string) => {
    if (!editTitle.trim()) {
      setEditingId(null);
      return;
    }
    const res = await chatService.updateSessionTitle(id, editTitle.trim());
    if (res.success) {
      toast.success("Workspace renamed");
      loadSessions();
    }
    setEditingId(null);
  };
  return (
    <Sidebar className="border-r border-border bg-sidebar">
      <SidebarHeader className="p-4 border-b border-border bg-sidebar/50">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-primary">
            <Code2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-foreground">AetherCode</span>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleNewChat}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm h-11"
            >
              <MessageSquarePlus className="w-4 h-4 mr-2" />
              <span>New Workspace</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2 py-4">
            <History className="w-3 h-3" />
            Workspace History
          </SidebarGroupLabel>
          <SidebarMenu className="px-2 gap-1">
            {sessions.map((session) => (
              <SidebarMenuItem key={session.id} className="group/item">
                {editingId === session.id ? (
                  <div className="flex items-center gap-1 px-2 py-1">
                    <Input
                      autoFocus
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename(session.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="h-8 text-xs bg-background border-primary/30"
                    />
                    <button onClick={() => handleRename(session.id)} className="p-1 text-emerald-500 hover:bg-emerald-500/10 rounded">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-1 text-muted-foreground hover:bg-muted rounded">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <SidebarMenuButton
                      isActive={currentSessionId === session.id}
                      onClick={() => setCurrentSessionId(session.id)}
                      className="rounded-lg py-6 data-[active=true]:bg-primary/10 data-[active=true]:text-primary transition-all"
                    >
                      <div className="flex flex-col items-start gap-0.5 overflow-hidden">
                        <span className="text-sm font-bold truncate w-full">{session.title}</span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {new Date(session.lastActive).toLocaleDateString()}
                        </span>
                      </div>
                    </SidebarMenuButton>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                      <SidebarMenuAction
                        onClick={() => {
                          setEditingId(session.id);
                          setEditTitle(session.title);
                        }}
                        className="hover:text-primary"
                      >
                        <Edit2 className="size-3.5" />
                      </SidebarMenuAction>
                      <SidebarMenuAction
                        onClick={() => setDeleteConfirmId(session.id)}
                        className="hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" />
                      </SidebarMenuAction>
                    </div>
                  </>
                )}
              </SidebarMenuItem>
            ))}
            {sessions.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="text-[11px] text-muted-foreground font-medium">No projects saved yet.</p>
              </div>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border bg-muted/30">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-primary/10">
                <Zap className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-xs font-bold text-foreground">{userCredits} Tokens</span>
            </div>
            <span className="text-[10px] font-black uppercase text-primary">{userTier}</span>
          </div>
          <div className="text-[9px] text-muted-foreground px-2 leading-tight font-medium uppercase tracking-tighter opacity-70">
            Resource limits verified by Aether Engine DO.
          </div>
        </div>
      </SidebarFooter>
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Workspace?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this conversation and its associated project snapshots.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Project</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSession} className="bg-destructive hover:bg-destructive/90">Delete Forever</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
}