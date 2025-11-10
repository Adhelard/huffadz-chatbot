// App.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, waitForCurrentUser, signOut } from "./lib/firebase";

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      const u = await waitForCurrentUser();
      setUser(u);
    })();
  }, []);

  async function handleLogout() {
    await signOut(auth);
    setUser(null);
    navigate("/");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1A2327] via-[#2B3B36] to-[#1A2327] text-[#E0E0D6]">
      {/* ===== Hero Section ===== */}
      <header className="h-16 flex items-center justify-between px-6 backdrop-blur-md bg-[#1A2327]/40 border-b border-[#B8860B]/20 shadow-lg sticky top-0 z-40">
        <div className="font-semibold tracking-wide text-[#B8860B] text-lg">
          Huffadz<span className="text-[#E0E0D6]">AI</span>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/chat"
                className="rounded-full px-4 py-2 text-sm bg-[#B8860B] text-[#1A2327] hover:bg-[#d4a017] font-medium transition"
              >
                Chat
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full px-4 py-2 text-sm border border-[#B8860B]/50 hover:bg-[#B8860B]/10 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-full px-4 py-2 text-sm bg-[#B8860B] text-[#1A2327] hover:bg-[#d4a017] font-medium transition"
            >
              Login
            </Link>
          )}
        </div>
      </header>

      {/* ===== Hero Section ===== */}
      <section className="relative flex flex-col items-center justify-center text-center py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] bg-[#B8860B]/10 rounded-full blur-3xl opacity-40" />
          <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-[#2B3B36]/80 rounded-full blur-3xl opacity-30" />
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold leading-tight">
          Belajar, Hafalan, dan <span className="text-[#B8860B]">Tanya Jawab Islami</span>  
          <br /> dengan Sentuhan AI Modern
        </h1>
        <p className="mt-6 max-w-2xl text-[#E0E0D6]/80">
          HuffadzAI membantu Anda memahami dan menghafal Al-Qur'an dengan cara yang tenang, cepat, dan interaktif.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/chat"
            className="rounded-full px-6 py-3 bg-[#B8860B] text-[#1A2327] font-semibold hover:bg-[#d4a017] transition"
          >
            Mulai Chat
          </Link>
          <Link
            to="/register"
            className="rounded-full px-6 py-3 border border-[#B8860B]/60 hover:bg-[#B8860B]/10 transition"
          >
            Daftar Sekarang
          </Link>
        </div>
      </section>

      {/* ===== Tentang HuffadzAI ===== */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#1A2327] via-[#24302C] to-[#1A2327]">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold text-[#B8860B]">Tentang HuffadzAI</h2>
          <p className="text-[#E0E0D6]/80 leading-relaxed max-w-3xl mx-auto">
            HuffadzAI adalah asisten Islami berbasis kecerdasan buatan yang dirancang untuk membantu umat dalam hafalan Al-Qur'an, memahami tafsir, dan memperdalam ilmu agama dengan teknologi terkini.  
            <br />Tenang, sederhana, dan bermanfaat.
          </p>
          <img
            src="https://images.unsplash.com/photo-1612178993483-b2e4b5e8f8e1?auto=format&fit=crop&w=1000&q=80"
            alt="HuffadzAI illustration"
            className="mx-auto rounded-3xl shadow-2xl border border-[#B8860B]/30 w-full max-w-3xl object-cover"
          />
        </div>
      </section>

      {/* ===== Fitur Utama ===== */}
      <section className="py-20 px-6 bg-[#1A2327]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#B8860B] mb-12">Fitur Unggulan</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Tanya Jawab Islami", desc: "Jawaban cepat dan akurat seputar Al-Qur'an & Hadits." },
              { title: "Bantu Hafalan", desc: "Fitur murajaah cerdas untuk membantu hafalan ayat." },
              { title: "Tafsir & Referensi", desc: "Sumber rujukan Islami terpercaya dan terverifikasi." },
              { title: "Desain Spiritual", desc: "Warna lembut, nuansa tenang, dan mudah dibaca." },
            ].map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[#2B3B36]/70 backdrop-blur-md border border-[#B8860B]/20 hover:border-[#B8860B]/40 hover:scale-[1.03] transition-all shadow-lg"
              >
                <h3 className="font-semibold text-lg text-[#B8860B] mb-2">{f.title}</h3>
                <p className="text-[#E0E0D6]/80 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="py-20 text-center bg-gradient-to-r from-[#2B3B36] to-[#1A2327]">
        <h2 className="text-3xl font-bold mb-6">Siap Memulai Perjalanan Anda?</h2>
        <Link
          to="/chat"
          className="inline-block px-8 py-3 rounded-full bg-[#B8860B] text-[#1A2327] font-semibold hover:bg-[#d4a017] transition"
        >
          Mulai Sekarang
        </Link>
      </section>

      {/* ===== Footer ===== */}
      <footer className="py-6 text-center border-t border-[#B8860B]/20 text-sm text-[#E0E0D6]/70">
        <div className="flex justify-center gap-4 mb-2">
          <a href="#" className="hover:text-[#B8860B] transition">Instagram</a>
          <a href="#" className="hover:text-[#B8860B] transition">YouTube</a>
          <a href="#" className="hover:text-[#B8860B] transition">GitHub</a>
        </div>
        © 2025 HuffadzAI. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
