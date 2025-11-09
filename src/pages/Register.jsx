// Register.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// Import fungsi yang diperbarui dari firebase.js
import { auth, createUserWithEmailAndPassword, updateProfile, signInWithGoogle } from '../lib/firebase' 
import { api } from '../lib/api'
import { FcGoogle } from 'react-icons/fc' // Asumsi ikon tersedia

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // --- Register Email/Password ---
  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      // Simpan Display Name (opsional)
      if (name) {
        await updateProfile(cred.user, { displayName: name })
      }
      // Panggil endpoint FastAPI untuk menyimpan profil
      await api.registerUserProfile({ username: name || email.split('@')[0], photo_url: null })
      navigate('/chat')
    } catch (err) {
      alert(err.message || 'Gagal mendaftar')
    } finally {
      setIsLoading(false)
    }
  }

  // --- Register Google ---
  async function handleGoogleSignIn() {
    setIsLoading(true)
    try {
      // Panggil fungsi Firebase Auth untuk Google Sign-In
      await signInWithGoogle() 
      const user = auth.currentUser
      // Ambil data dari user yang baru login/daftar
      const username = (user.displayName || user.email?.split('@')[0] || 'User')
      const photo_url = user.photoURL || null
      
      // Panggil endpoint FastAPI untuk menyimpan/update profil
      await api.registerUserProfile({ username, photo_url }) 
      
      navigate('/chat')
    } catch (err) {
      console.error(err)
      alert(err.message || 'Gagal mendaftar dengan Google')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl shadow-xl p-6">
        <h1 className="text-xl font-semibold tracking-tight mb-6">Daftar Huffadz</h1>

        {/* Tombol Google Sign-In */}
        <button 
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center rounded-xl border border-slate-300 bg-white py-3 mb-4 hover:bg-slate-50 disabled:opacity-50 active:scale-[.99] transition"
        >
          <FcGoogle className="w-5 h-5 mr-2" /> <span>Daftar dengan Google</span>
        </button>

        <div className="flex items-center my-4">
            <div className="flex-grow border-t border-slate-300"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-sm">ATAU</span>
            <div className="flex-grow border-t border-slate-300"></div>
        </div>

        {/* Form Email/Password */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Nama</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} type="text" className="w-full rounded-xl border border-white/60 bg-white/80 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
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
            {isLoading ? 'Memuat...' : 'Daftar'}
          </button>
        </form>
        <div className="mt-4 text-sm text-slate-600">
          Sudah punya akun? <Link to="/login" className="text-blue-600 hover:underline">Masuk</Link>
        </div>
      </div>
    </div>
  )
}