import type { Message, ChatState, SessionInfo } from '../../worker/types';
import { useStore } from './store';
export interface ChatResponse {
  success: boolean;
  data?: ChatState;
  error?: string;
}
export const MODELS = [
  { id: 'google-ai-studio/gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
  { id: 'google-ai-studio/gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
  { id: 'google-ai-studio/gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
];
class ChatService {
  private getBaseUrl(sessionId: string) {
    return `/api/chat/${sessionId}`;
  }
  async sendMessage(
    sessionId: string,
    message: string,
    model?: string,
    onChunk?: (chunk: string) => void,
    token?: string
  ): Promise<ChatResponse> {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = token;
      }
      const response = await fetch(`${this.getBaseUrl(sessionId)}/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message, model, stream: !!onChunk }),
      });
      if (response.status === 402) {
        return { success: false, error: 'OUT_OF_CREDITS' };
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      if (onChunk && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            if (chunk) {
              onChunk(chunk);
            }
          }
        } finally {
          reader.releaseLock();
        }
        return { success: true };
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to send message:', error);
      return { success: false, error: 'Failed to send message' };
    }
  }
  async getMessages(sessionId: string, token?: string): Promise<ChatResponse> {
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = token;
      const response = await fetch(`${this.getBaseUrl(sessionId)}/messages`, { headers });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to get messages:', error);
      return { success: false, error: 'Failed to load messages' };
    }
  }
  async clearMessages(sessionId: string, token?: string): Promise<ChatResponse> {
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = token;
      const response = await fetch(`${this.getBaseUrl(sessionId)}/clear`, {
        method: 'DELETE',
        headers
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to clear messages:', error);
      return { success: false, error: 'Failed to clear messages' };
    }
  }
  async updateSessionTitle(sessionId: string, title: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/title`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      return await response.json();
    } catch (error) {
      return { success: false };
    }
  }
  async listSessions(): Promise<{ success: boolean; data?: SessionInfo[]; error?: string }> {
    try {
      const response = await fetch('/api/sessions');
      const json = await response.json();
      return {
        success: json.success,
        data: Array.isArray(json.data) ? json.data : []
      };
    } catch (error) {
      return { success: false, error: 'Failed to list sessions', data: [] };
    }
  }
  async deleteSession(sessionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, { method: 'DELETE' });
      return await response.json();
    } catch (error) {
      return { success: false, error: 'Failed to delete session' };
    }
  }
}
export const chatService = new ChatService();
export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
};