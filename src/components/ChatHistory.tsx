import { Clock, MessageSquare, Trash2, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase, ChatSession, ChatMessage } from '../lib/supabase';
import { getUserId } from '../utils/sessionStorage';

interface ChatHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSession: (sessionId: string, messages: ChatMessage[]) => void;
}

export function ChatHistory({ isOpen, onClose, onLoadSession }: ChatHistoryProps) {
  const [sessions, setSessions] = useState<(ChatSession & { messageCount: number })[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen]);

  const loadSessions = async () => {
    setLoading(true);
    const userId = getUserId();

    const { data: sessionsData } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('last_message_at', { ascending: false })
      .limit(20);

    if (sessionsData) {
      const sessionsWithCounts = await Promise.all(
        sessionsData.map(async (session) => {
          const { count } = await supabase
            .from('chat_messages')
            .select('*', { count: 'exact', head: true })
            .eq('session_id', session.id);

          return {
            ...session,
            messageCount: count || 0,
          };
        })
      );

      setSessions(sessionsWithCounts);
    }

    setLoading(false);
  };

  const handleLoadSession = async (sessionId: string) => {
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (messages) {
      onLoadSession(sessionId, messages);
      onClose();
    }
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this chat history?')) {
      return;
    }

    await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId);

    setSessions(sessions.filter(s => s.id !== sessionId));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex justify-between items-center rounded-t-2xl">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <h3 className="font-semibold">Chat History</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No chat history yet</p>
              <p className="text-sm mt-1">Start a conversation with the AI assistant</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleLoadSession(session.id)}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <MessageSquare className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">
                          Chat Session
                        </span>
                        <span className="text-xs text-gray-500">
                          ({session.messageCount} messages)
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatDate(session.last_message_at)}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Language: {session.language.toUpperCase()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className="text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete chat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
