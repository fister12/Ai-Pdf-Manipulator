"use client";

import { MessageSquare, Clock, Trash2 } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";

export interface ChatSession {
  id: string;
  title: string;
  timestamp: string;
  preview?: string;
}

interface ChatHistoryProps {
  sessions: ChatSession[];
  activeSessionId?: string;
  onSelectSession: (id: string) => void;
  onDeleteSession?: (id: string) => void;
}

export function ChatHistory({
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
}: ChatHistoryProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <MessageSquare className="mr-2 h-4 w-4" />
        Study Sessions
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {sessions.length === 0 ? (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              No previous sessions
            </div>
          ) : (
            sessions.map((session) => (
              <SidebarMenuItem key={session.id}>
                <SidebarMenuButton
                  isActive={session.id === activeSessionId}
                  onClick={() => onSelectSession(session.id)}
                  tooltip={session.title}
                  className="group/item"
                >
                  <MessageSquare className="h-4 w-4 shrink-0 text-primary/70" />
                  <div className="flex flex-1 flex-col overflow-hidden">
                    <span className="truncate font-medium">{session.title}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {session.timestamp}
                    </span>
                  </div>
                </SidebarMenuButton>
                {onDeleteSession && (
                  <SidebarMenuAction
                    showOnHover
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </SidebarMenuAction>
                )}
              </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
