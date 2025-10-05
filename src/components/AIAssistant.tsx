import { MessageSquare, Send, Loader2, X, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase, ChatMessage } from '../lib/supabase';
import { getUserId, getCurrentSessionId, setCurrentSessionId, clearCurrentSession } from '../utils/sessionStorage';
import { ChatHistory } from './ChatHistory';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantProps {
  onScenarioMatch: (scenarioId: string) => void;
  language: string;
  t: (key: string) => string;
}

export function AIAssistant({ onScenarioMatch, language, t }: AIAssistantProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionIdState] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const sessionId = getCurrentSessionId();
      if (sessionId) {
        setCurrentSessionIdState(sessionId);
      }
    }
  }, [isOpen, messages.length]);

  const saveMessageToDb = async (sessionId: string, role: 'user' | 'assistant', content: string, scenarioId?: string) => {
    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      role,
      content,
      matched_scenario_id: scenarioId,
    });

    await supabase
      .from('chat_sessions')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', sessionId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage = query.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setQuery('');
    setIsLoading(true);

    let sessionId = currentSessionId;

    if (!sessionId) {
      const userId = getUserId();
      const { data: newSession } = await supabase
        .from('chat_sessions')
        .insert({ user_id: userId, language })
        .select()
        .single();

      if (newSession) {
        sessionId = newSession.id;
        setCurrentSessionIdState(sessionId);
        setCurrentSessionId(sessionId);
      }
    }

    if (sessionId) {
      await saveMessageToDb(sessionId, 'user', userMessage);
    }

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-guidance`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ query: userMessage, language }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      if (data.matched && data.scenario) {
        const assistantMessage = data.response;
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: assistantMessage
        }]);

        if (sessionId) {
          await saveMessageToDb(sessionId, 'assistant', assistantMessage, data.scenario.id);
        }

        setTimeout(() => {
          onScenarioMatch(data.scenario.id);
          setIsOpen(false);
          setMessages([]);
          clearCurrentSession();
          setCurrentSessionIdState(null);
        }, 1500);
      } else {
        const assistantMessage = data.response || 'I can help you with immigration and crisis situations. Please describe your situation in more detail.';
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: assistantMessage
        }]);

        if (sessionId) {
          await saveMessageToDb(sessionId, 'assistant', assistantMessage);
        }
      }
    } catch (error) {
      console.error('AI Assistant error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I\'m having trouble connecting. Please try selecting a crisis scenario from the main page or try again later.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setMessages([]);
    setQuery('');
  };

  const handleLoadSession = (sessionId: string, loadedMessages: ChatMessage[]) => {
    setCurrentSessionIdState(sessionId);
    setCurrentSessionId(sessionId);
    setMessages(loadedMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    })));
  };

  const handleNewChat = () => {
    clearCurrentSession();
    setCurrentSessionIdState(null);
    setMessages([]);
    setQuery('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-96 max-h-[600px] overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold">AI Guidance Assistant</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowHistory(true)}
                className="text-white hover:text-gray-200 transition-colors"
                title="View chat history"
              >
                <Clock className="w-5 h-5" />
              </button>
              {messages.length > 0 && (
                <button
                  onClick={handleNewChat}
                  className="text-white hover:text-gray-200 transition-colors text-sm px-2 py-1 bg-white bg-opacity-20 rounded"
                  title="Start new chat"
                >
                  New
                </button>
              )}
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
            {messages.length === 0 ? (
              <div className="text-sm text-gray-600">
                <p className="mb-2">Hi! I'm here to help you navigate crisis situations.</p>
                <p className="mb-3">You can ask me things like:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>"My dad was taken by ICE"</li>
                  <li>"My visa is expiring soon"</li>
                  <li>"I need asylum help"</li>
                  <li>"Government shutdown affected me"</li>
                </ul>
              </div>
            ) : (
              messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe your situation..."
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110"
          title="AI Guidance Assistant"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      <ChatHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onLoadSession={handleLoadSession}
      />
    </div>
  );
}
