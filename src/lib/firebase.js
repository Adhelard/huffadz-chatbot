// firebase.js
import { initializeApp } from 'firebase/app'
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut,
  // Tambahan untuk Google Sign-In
  GoogleAuthProvider, 
  signInWithPopup,
  // Tambahan untuk Register
  createUserWithEmailAndPassword,
  updateProfile, 
} from 'firebase/auth'

// Pastikan variabel lingkungan (VITE_FIREBASE_...) sudah diatur
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

// --- FUNGSI UTAMA UNTUK API ---

export function waitForCurrentUser() {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub()
      resolve(user)
    })
  })
}

export async function getIdToken(forceRefresh = false) {
  const user = auth.currentUser || (await waitForCurrentUser())
  if (!user) return null
  return user.getIdToken(forceRefresh)
}

// --- EKSPOR FUNGSI AUTH LAINNYA ---

export const googleProvider = new GoogleAuthProvider()

export async function signInWithGoogle() {
  // Menggunakan signInWithPopup untuk pop-up Google Sign-In
  await signInWithPopup(auth, googleProvider)
}

export { 
  signInWithEmailAndPassword, 
  signOut,
  createUserWithEmailAndPassword, 
  updateProfile
}