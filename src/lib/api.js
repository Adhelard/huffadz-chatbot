import { getIdToken } from './firebase'

const API_BASE = import.meta.env.VITE_API_BASE_URL || `https://api.ai-islami.com/api/v1`

// const API_BASE = import.meta.env.VITE_API_BASE_URL || `http://${location.hostname}:8000/api/v1/`

async function authFetch(path, options = {}) {
  const token = await getIdToken()
  
  if (!token) {
     console.error("DEBUG API: Token not found!");
  } else {
     console.log("DEBUG API: Token successfully retrieved (length:", token.length, ")");
  }
  
  if (!token) throw new Error('Not authenticated')
  const headers = new Headers(options.headers || {})
  headers.set('Authorization', `Bearer ${token}`)
  headers.set('Content-Type', 'application/json')
  try {
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
    if (!res.ok) {
      // Jika status 204 (No Content), kembalikan null saja
      if (res.status === 204) return null;
      const text = await res.text().catch(() => '')
      throw new Error(text || `Request failed: ${res.status}`)
    }
    // Handle 204 No Content
    if (res.status === 204) return null;
    
    const contentType = res.headers.get('content-type') || ''
    return contentType.includes('application/json') ? res.json() : res.text()
  } catch (e) {
    throw new Error(`Failed to fetch from API: ${e.message}`)
  }
}

async function guestFetch(path, options = {}) {
  // ... (fungsi guestFetch tidak berubah)
  const headers = new Headers(options.headers || {})
  headers.set('Content-Type', 'application/json')
  
  try {
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
    if (!res.ok) {
      const text = await res.text().catch(() => '')
      throw new Error(text || `Request failed: ${res.status}`)
    }
    const contentType = res.headers.get('content-type') || ''
    return contentType.includes('application/json') ? res.json() : res.text()
  } catch (e) {
    throw new Error(`Failed to fetch from API: ${e.message}`)
  }
}


export const api = {
  // User (Auth)
  registerUserProfile: (profile) => authFetch('/users/register', { method: 'POST', body: JSON.stringify(profile) }),
  getMyProfile: () => authFetch('/users/me'),
  
  // Conversations (Auth)
  listConversations: () => authFetch('/conversations'),
  createConversation: (data) => authFetch('/conversations', { method: 'POST', body: JSON.stringify(data) }),
  getHistory: (conversationId) => authFetch(`/history/${conversationId}`),
  deleteConversation: (conversationId) => authFetch(`/conversations/${conversationId}`, { method: 'DELETE' }), // <-- 櫨 BARU

  // Prompts (Auth)
  postPrompt: (data) => authFetch('/prompts', { method: 'POST', body: JSON.stringify(data) }),
  
  // Prompts (Guest)
  postPromptGuest: (data) => guestFetch('/prompts/guest', { method: 'POST', body: JSON.stringify(data) }),
}