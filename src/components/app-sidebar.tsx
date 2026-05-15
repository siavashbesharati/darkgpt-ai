import React, { useState, useEffect } from "react";
import { MessageSquarePlus, Trash2, Code2, Zap, History } from "lucide-react";
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
import { SessionInfo } from "../../worker/types";
export function AppSidebar(): JSX.Element {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  // Zustand Zero-Tolerance Rule: Select primitives individually
  const userCredits = useStore(s => s.user?.credits ?? 0);
  const userTier = useStore(s => s.user?.tier ?? 'Free');
  const currentSessionId = chatService.getSessionId();
  const loadSessions = async () => {
    const res = await chatService.listSessions();
    if (res.success && res.data) {
      setSessions(res.data);
    }
  };
  useEffect(() => {
    loadSessions();
  }, [currentSessionId]);
  const handleNewChat = () => {
    chatService.newSession();
    window.location.reload();
  };
  const handleDeleteSession = async (id: string) => {
    const res = await chatService.deleteSession(id);
    if (res.success) {
      toast.success("Session deleted");
      if (id === currentSessionId) {
        handleNewChat();
      } else {
        loadSessions();
      }
    }
  };
  const handleSwitchSession = (id: string) => {
    chatService.switchSession(id);
    window.location.reload();
  };
  return (
    <Sidebar className="border-r border-slate-200 dark:border-white/5">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-600">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">AetherCode</span>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleNewChat}
              className="bg-cyan-500 hover:bg-cyan-600 text-white dark:text-slate-950 font-semibold"
            >
              <MessageSquarePlus className="w-4 h-4 mr-2" />
              <span>New Workspace</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <History className="w-3 h-3" />
            Recent Sessions
          </SidebarGroupLabel>
          <SidebarMenu className="px-2 mt-2">
            {sessions.map((session) => (
              <SidebarMenuItem key={session.id}>
                <SidebarMenuButton
                  isActive={currentSessionId === session.id}
                  onClick={() => handleSwitchSession(session.id)}
                  className="rounded-lg py-5"
                >
                  <div className="flex flex-col items-start gap-0.5 overflow-hidden">
                    <span className="text-sm font-medium truncate w-full">{session.title}</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(session.lastActive).toLocaleDateString()}
                    </span>
                  </div>
                </SidebarMenuButton>
                <SidebarMenuAction
                  onClick={() => handleDeleteSession(session.id)}
                  className="hover:text-red-500"
                >
                  <Trash2 className="size-4" />
                </SidebarMenuAction>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-cyan-500/10">
                <Zap className="w-3.5 h-3.5 text-cyan-500" />
              </div>
              <span className="text-xs font-medium">{userCredits} Tokens</span>
            </div>
            <span className="text-[10px] font-bold uppercase text-cyan-500/70">{userTier}</span>
          </div>
          <div className="text-[10px] text-slate-500 px-2 leading-tight">
            AI limits apply across shared resources.
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}