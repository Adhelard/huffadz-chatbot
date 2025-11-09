// Login.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// Import signInWithGoogle yang baru
import { signInWithEmailAndPassword, auth, signInWithGoogle } from '../lib/firebase' 
import { api } from '../lib/api'
import { FcGoogle } from 'react-icons/fc' // Asumsi ikon tersedia

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // --- Login Email/Password ---
  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password)
      const user = cred.user
      const username = (user.displayName || user.email?.split('@')[0] || 'User')
      const photo_url = user.photoURL || null
      // Panggil endpoint FastAPI untuk menyimpan/update profil
      await api.registerUserProfile({ username, photo_url })
      navigate('/chat')
    } catch (err) {
      alert(err.message || 'Gagal masuk')
    } finally {
      setIsLoading(false)
    }
  }

  // --- Login Google ---
  async function handleGoogleSignIn() {
    setIsLoading(true)
    try {
      // Panggil fungsi Firebase Auth untuk Google Sign-In
      await signInWithGoogle() 
      const user = auth.currentUser
      // Ambil data dari user yang baru login
      const username = (user.displayName || user.email?.split('@')[0] || 'User')
      const photo_url = user.photoURL || null
      
      // Panggil endpoint FastAPI untuk menyimpan/update profil
      await api.registerUserProfile({ username, photo_url }) 
      
      navigate('/chat')
    } catch (err) {
      console.error(err)
      alert(err.message || 'Gagal masuk dengan Google')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-xl p-6">
        <h1 className="text-xl font-semibold tracking-tight mb-6">Masuk ke Huffadz</h1>
        
        {/* Tombol Google Sign-In */}
        <button 
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center rounded-xl border border-slate-300 bg-white py-3 mb-4 hover:bg-slate-50 disabled:opacity-50 active:scale-[.99] transition"
        >
          <FcGoogle className="w-5 h-5 mr-2" /> <span>Masuk dengan Google</span>
        </button>
        
        <div className="flex items-center my-4">
            <div className="flex-grow border-t border-slate-300"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-sm">ATAU</span>
            <div className="flex-grow border-t border-slate-300"></div>
        </div>

        {/* Form Email/Password */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm mb-1">Kata Sandi</label>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full rounded-xl bg-blue-600 text-white py-3 hover:bg-blue-700 disabled:opacity-50 active:scale-[.99] transition">
            {isLoading ? 'Memuat...' : 'Masuk'}
          </button>
        </form>
        
        <div className="mt-4 text-sm text-slate-600">
          Belum punya akun? <Link to="/register" className="text-blue-600 hover:underline">Daftar</Link>
        </div>
      </div>
    </div>
  )
}