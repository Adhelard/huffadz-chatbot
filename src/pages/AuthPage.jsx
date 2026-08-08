import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  signInWithEmailAndPassword, 
  auth, 
  signInWithGoogle, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from '../lib/firebase' 
import { api } from '../lib/api' 
import { FcGoogle } from 'react-icons/fc'
import { 
  LogIn, 
  UserPlus, 
  BookOpen, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { Helmet } from 'react-helmet-async';

// --- STYLES & ANIMATIONS (Sama dengan Chat Page) ---
const animationStyles = `
@keyframes shimmer-text {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
}
.shimmer-text {
    background: linear-gradient(to right, #B8860B 20%, #FFD700 40%, #FFD700 60%, #B8860B 80%);
    background-size: 200% auto;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    animation: shimmer-text 3s linear infinite;
}
@keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
}
.animate-float {
    animation: float 6s ease-in-out infinite;
}
`;

const AUTH_MODES = {
  LOGIN: 'login',
  REGISTER: 'register'
}

function getFirebaseAuthErrorMessage(error) {
  switch (error.code) {
    case 'auth/user-not-found': return 'Email not found.';
    case 'auth/wrong-password': return 'Wrong password.';
    case 'auth/invalid-email': return 'Invalid email format.';
    case 'auth/email-already-in-use': return 'Email already registered.';
    case 'auth/weak-password': return 'Password must be at least 6 characters.';
    case 'auth/too-many-requests': return 'Too many attempts. Please try again later.';
    default: return error.message || 'An error occurred.';
  }
}

// --- KOMPONEN INPUT CUSTOM (REUSABLE) ---
function InputField({ label, icon: Icon, type, value, onChange, placeholder, isPassword = false, showPassword, togglePassword }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#B8860B] uppercase tracking-wider ml-1">{label}</label>
            <div className="relative group">
                {/* Ikon Kiri */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#FFD700] transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                </div>
                
                {/* Input */}
                <input
                    type={isPassword ? (showPassword ? 'text' : 'password') : type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full bg-[#141414] border border-white/10 text-[#E0E0D6] placeholder:text-white/20 text-sm rounded-xl py-3.5 pl-12 pr-12 focus:outline-none focus:border-[#B8860B]/50 focus:ring-1 focus:ring-[#B8860B]/20 transition-all shadow-inner"
                    required
                />

                {/* Toggle Password (Kanan) */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={togglePassword}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}
            </div>
        </div>
    );
}

// --- GOOGLE BUTTON ---
function GoogleSignInButton({ setIsLoading, navigate, setError }) {
  async function handleGoogleSignIn() {
    setIsLoading(true); setError(null);
    try {
      await signInWithGoogle();
      const user = auth.currentUser;
      const username = user.displayName || user.email?.split('@')[0] || 'User';
      const photo_url = user.photoURL || null;
      await api.registerUserProfile({ username, photo_url });
      navigate('/');
    } catch (err) {
      setError(getFirebaseAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      className="w-full py-3.5 rounded-xl border border-white/10 bg-white/5 text-[#E0E0D6] flex items-center justify-center gap-3 hover:bg-white/10 hover:border-[#B8860B]/30 transition-all duration-300 group"
    >
      <FcGoogle className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span className="font-medium text-sm">Continue with Google</span>
    </button>
  );
}

// --- LOGIN COMPONENT ---
function LoginComponent({ toggleMode, setIsLoading, isLoading, navigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true); setError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;
      const username = user.displayName || user.email?.split('@')[0] || 'User';
      const photo_url = user.photoURL || null;
      await api.registerUserProfile({ username, photo_url });
      navigate('/');
    } catch (err) {
      setError(getFirebaseAuthErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#B8860B] to-[#FFD700] rounded-2xl flex items-center justify-center shadow-lg shadow-[#B8860B]/20 mb-4 rotate-3 hover:rotate-6 transition-transform duration-500">
             <LogIn className="w-8 h-8 text-[#1A2327]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
        <p className="text-sm text-white/50">Log in to continue your study.</p>
      </div>

      <div className="space-y-4">
        <InputField 
            label="Email" 
            icon={Mail} 
            type="email" 
            value={email} 
            onChange={(e) => { setEmail(e.target.value); setError(null); }} 
            placeholder="nama@email.com" 
        />
        <InputField 
            label="Password" 
            icon={Lock} 
            isPassword={true} 
            value={password} 
            onChange={(e) => { setPassword(e.target.value); setError(null); }} 
            placeholder="••••••••" 
            showPassword={showPassword}
            togglePassword={() => setShowPassword(!showPassword)}
        />
      </div>

      <AnimatePresence>
        {error && (
            <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs flex items-center gap-2"
            >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
            </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#FFD700] text-[#1A2327] font-bold text-sm shadow-[0_0_20px_rgba(184,134,11,0.3)] hover:shadow-[0_0_30px_rgba(184,134,11,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Log In Now <ArrowRight className="w-4 h-4" /></>}
      </button>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10"></span></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0F0F0F] px-2 text-white/30">Or</span></div>
      </div>

      <GoogleSignInButton setIsLoading={setIsLoading} navigate={navigate} setError={setError} />

      <p className="text-center text-sm text-white/40">
        Don't have an account?{' '}
        <button type="button" onClick={() => toggleMode(AUTH_MODES.REGISTER)} className="text-[#FFD700] hover:text-[#fff] font-medium transition-colors">
          Register for Free
        </button>
      </p>
    </form>
  );
}

// --- REGISTER COMPONENT ---
function RegisterComponent({ toggleMode, setIsLoading, isLoading, navigate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault(); setError(null);
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
      await api.registerUserProfile({ username: name || email.split('@')[0], photo_url: null });
      navigate('/');
    } catch (err) { setError(getFirebaseAuthErrorMessage(err)); } 
    finally { setIsLoading(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto bg-[#1A1A1A] border border-[#B8860B]/30 rounded-2xl flex items-center justify-center shadow-lg mb-4 group">
             <UserPlus className="w-8 h-8 text-[#FFD700] group-hover:scale-110 transition-transform" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">Create New Account</h2>
        <p className="text-sm text-white/50">Start your digital spiritual journey.</p>
      </div>
      
      <div className="space-y-4">
        <InputField 
            label="Name (Optional)" 
            icon={User} 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Nickname" 
        />
        <InputField 
            label="Email" 
            icon={Mail} 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="nama@email.com" 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField 
                label="Password" 
                icon={Lock} 
                isPassword={true} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Min. 6 Characters" 
                showPassword={showPassword}
                togglePassword={() => setShowPassword(!showPassword)}
            />
            <InputField 
                label="Confirm" 
                icon={Check} 
                isPassword={true} 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Repeat Password" 
                showPassword={showConfirmPassword}
                togglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            />
        </div>
      </div>

      <AnimatePresence>
        {error && (
            <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-200 text-xs flex items-center gap-2"
            >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
            </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B8860B] to-[#FFD700] text-[#1A2327] font-bold text-sm shadow-[0_0_20px_rgba(184,134,11,0.3)] hover:shadow-[0_0_30px_rgba(184,134,11,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Registering...' : 'Register Now'}
      </button>

      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10"></span></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0F0F0F] px-2 text-white/30">Or</span></div>
      </div>

      <GoogleSignInButton setIsLoading={setIsLoading} navigate={navigate} setError={setError} />

      <p className="text-center text-sm text-white/40">
        Already have an account?{' '}
        <button type="button" onClick={() => toggleMode(AUTH_MODES.LOGIN)} className="text-[#FFD700] hover:text-[#fff] font-medium transition-colors">
          Log In
        </button>
      </p>
    </form>
  );
}

// --- ICONS HELPER ---
function Check(props) { return <Sparkles {...props} /> } // Reuse Sparkles for aesthetic check

function Loader2({ className }) {
    return (
        <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    )
}

// --- VISUAL PANEL (RIGHT SIDE) ---
function VisualPanel({ isRegister }) {
  const content = isRegister
    ? {
        key: 'register',
        imageSrc: '/daftar.png',
        title: "Unlock Full Access to Islamic Knowledge",
        desc: "Register now for Multi-Dalil, Murajaah, and Personal Fiqh Assistant features."
      }
    : {
        key: 'login',
        imageSrc: '/login.png',
        title: "Back to Your Study",
        desc: "Continue your last Tafsir, Hadith, or Fiqh discussion."
      };
  
  return (
    <motion.div
      key={content.key}
      className="hidden lg:flex flex-col justify-center items-center text-center p-12 relative z-10"
      initial={{ opacity: 0, x: isRegister ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Background Glow Effect Behind Image */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#B8860B]/10 rounded-full blur-[100px] -z-10"></div>

      <motion.div 
        className="relative animate-float"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Placeholder jika gambar tidak ada, tetap terlihat bagus */}
        <div className="relative z-10">
             <img
                src={content.imageSrc}
                alt={content.title}
                className="h-[500px] object-contain drop-shadow-2xl" 
                onError={(e) => {
                    e.target.style.display = 'none'; // Sembunyikan jika error, tampilkan icon
                }}
            />
            {/* Fallback Icon jika gambar gagal load (untuk development) */}
            <div className="h-[400px] w-[400px] flex items-center justify-center text-[#B8860B]/20 absolute top-0 left-0 -z-10">
                <BookOpen size={200} />
            </div>
        </div>
      </motion.div>

      <h3 className="text-4xl font-bold mt-8 mb-4 shimmer-text">{content.title}</h3>
      <p className="text-[#E0E0D6]/60 text-lg max-w-md leading-relaxed">{content.desc}</p>
    </motion.div>
  );
}

// --- MAIN PAGE ---
export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState(AUTH_MODES.REGISTER); 
  const [isLoading, setIsLoading] = useState(false);
  const isRegister = mode === AUTH_MODES.REGISTER;

  function toggleMode(newMode) {
    if (newMode === AUTH_MODES.LOGIN || newMode === AUTH_MODES.REGISTER) {
      setMode(newMode);
    }
  }

  // Inject Styles
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = animationStyles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0a0a0a] text-[#E0E0D6] overflow-hidden relative font-sans">
      <Helmet>
        <title>Log In / Register | Islamic AI</title>
      </Helmet>
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#B8860B]/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FFD700]/5 rounded-full blur-[120px]"></div>
      </div>

      <motion.div
        className="w-full max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-2 justify-between items-center gap-10 lg:gap-20 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        
        {/* KOLOM FORM */}
        <motion.div
          layout
          className={`w-full flex justify-center transition-all duration-700 ease-in-out ${isRegister ? 'lg:order-1' : 'lg:order-2'}`}
        >
          <div className="w-full max-w-lg p-8 sm:p-10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] bg-[#0F0F0F]/80 backdrop-blur-xl border border-white/10 relative overflow-hidden">
            {/* Top Border Gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#B8860B] opacity-50"></div>
            
            <AnimatePresence mode='wait'>
                <motion.div
                    key={mode}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {isRegister ? (
                    <RegisterComponent toggleMode={toggleMode} setIsLoading={setIsLoading} isLoading={isLoading} navigate={navigate} />
                    ) : (
                    <LoginComponent toggleMode={toggleMode} setIsLoading={setIsLoading} isLoading={isLoading} navigate={navigate} />
                    )}
                </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* KOLOM VISUAL */}
        <div className={`w-full ${isRegister ? 'lg:order-2' : 'lg:order-1'}`}>
          <VisualPanel isRegister={isRegister} />
        </div>

      </motion.div>
    </div>
  )
}