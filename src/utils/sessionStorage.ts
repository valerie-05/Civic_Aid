export function getUserId(): string {
  let userId = localStorage.getItem('chat_user_id');

  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('chat_user_id', userId);
  }

  return userId;
}

export function getCurrentSessionId(): string | null {
  return sessionStorage.getItem('current_chat_session_id');
}

export function setCurrentSessionId(sessionId: string): void {
  sessionStorage.setItem('current_chat_session_id', sessionId);
}

export function clearCurrentSession(): void {
  sessionStorage.removeItem('current_chat_session_id');
}
