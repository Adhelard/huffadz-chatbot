import { getIdToken } from './firebase'

// const API_BASE = import.meta.env.VITE_API_BASE_URL || `https://huffadz.portalsi.com/api/v1/`


const API_BASE = import.meta.env.VITE_API_BASE_URL || `http://${location.hostname}:8000/api/v1/`

async function authFetch(path, options = {}) {
  const token = await getIdToken()
  
  // 🔥 TAMBAHKAN INI UNTUK DEBUGGING
  if (!token) {
     console.error("DEBUG API: Token tidak ditemukan!");
     // Anda bisa membiarkan error ini terlempar atau menangkapnya.
  } else {
     console.log("DEBUG API: Token berhasil diambil (panjang:", token.length, ")");
  }
  // 🔥 AKHIR DEBUGGING
  
  if (!token) throw new Error('Not authenticated')
  const headers = new Headers(options.headers || {})
  headers.set('Authorization', `Bearer ${token}`)
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
    throw new Error(`Gagal fetch ke API: ${e.message}`)
  }
}

export const api = {
  registerUserProfile: (profile) => authFetch('/users/register', { method: 'POST', body: JSON.stringify(profile) }),
  getMyProfile: () => authFetch('/users/me'),
  listConversations: () => authFetch('/conversations'),
  createConversation: (data) => authFetch('/conversations', { method: 'POST', body: JSON.stringify(data) }),
  postPrompt: (data) => authFetch('/prompts', { method: 'POST', body: JSON.stringify(data) }),
  getHistory: (conversationId) => authFetch(`/history/${conversationId}`),
}


