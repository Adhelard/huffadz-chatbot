import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth, createUserWithEmailAndPassword, updateProfile, signInWithGoogle } from '../lib/firebase'
import { api } from '../lib/api'
import { FcGoogle } from 'react-icons/fc'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setIsLoading(true)
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password)
      if (name) await updateProfile(cred.user, { displayName: name })
      await api.registerUserProfile({ username: name || email.split('@')[0], photo_url: null })
      navigate('/chat')
    } catch (err) {
      alert(err.message || 'Gagal mendaftar')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true)
    try {
      await signInWithGoogle()
      const user = auth.currentUser
      const username = user.displayName || user.email?.split('@')[0] || 'User'
      const photo_url = user.photoURL || null
      await api.registerUserProfile({ username, photo_url })
      navigate('/chat')
    } catch (err) {
      alert(err.message || 'Gagal mendaftar dengan Google')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A2327] text-[#E0E0D6] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2B3B36] via-[#1A2327] to-[#1A2327]" />
      <div className="absolute top-0 right-0 h-80 w-80 bg-[#B8860B]/10 blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-0 h-96 w-96 bg-[#2B3B36]/30 blur-3xl rounded-full" />

      <div className="relative w-full max-w-md p-8 rounded-2xl bg-[#2B3B36]/40 backdrop-blur-xl border border-[#B8860B]/30 shadow-xl">
        <h1 className="text-2xl font-semibold mb-6 text-center text-[#B8860B]">
          Daftar ke <span className="text-[#E0E0D6]">Huffadz AI</span>
        </h1>

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center rounded-xl border border-[#B8860B]/40 bg-[#1A2327]/60 py-3 mb-5 hover:bg-[#2B3B36]/60 transition disabled:opacity-50"
        >
          <FcGoogle className="w-5 h-5 mr-2" /> 
          <span>Daftar dengan Google</span>
        </button>

        <div className="flex items-center mb-5">
          <div className="flex-grow border-t border-[#B8860B]/30"></div>
          <span className="mx-3 text-sm text-[#C9C9B8]">ATAU</span>
          <div className="flex-grow border-t border-[#B8860B]/30"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-[#C9C9B8]">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              className="w-full rounded-xl border border-[#B8860B]/30 bg-[#1A2327]/60 px-4 py-3 outline-none text-[#E0E0D6] focus:ring-2 focus:ring-[#B8860B]"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[#C9C9B8]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full rounded-xl border border-[#B8860B]/30 bg-[#1A2327]/60 px-4 py-3 outline-none text-[#E0E0D6] focus:ring-2 focus:ring-[#B8860B]"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[#C9C9B8]">Kata Sandi</label>
            <input
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full rounded-xl border border-[#B8860B]/30 bg-[#1A2327]/60 px-4 py-3 outline-none text-[#E0E0D6] focus:ring-2 focus:ring-[#B8860B]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-[#B8860B] text-[#1A2327] font-semibold hover:bg-[#d4a017] transition disabled:opacity-50 active:scale-[.98]"
          >
            {isLoading ? 'Memuat...' : 'Daftar'}
          </button>
        </form>

        <p className="mt-5 text-sm text-center text-[#C9C9B8]">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-[#B8860B] hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  )
}
