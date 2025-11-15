import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { auth, waitForCurrentUser, signOut } from "./lib/firebase";
import { Book, Brain, MessageCircle } from "lucide-react";
import ScrollShowcase from "./componentss/ScrollShowcase";
import FiturUnggulanSection from "./componentss/FiturUnggulanSection";
import { ArrowRight } from "lucide-react";


// ==============================
// ANIMASI VARIANTS
// ==============================
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.2, ease: "easeOut" } },
};

// ==============================
// KOMPONEN UTAMA
// ==============================
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
    <div className="min-h-screen w-full bg-[#1A2327] text-[#E0E0D6] overflow-x-hidden scroll-smooth">
      {/* ==================== HEADER ==================== */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-16 py-4 bg-[#1A2327]/70 backdrop-blur border-b border-[#B8860B]/20">
        <div className="text-2xl font-bold text-[#B8860B] tracking-tight">
          HuffadzAI
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                to="/chat"
                className="px-4 py-2 rounded-full text-sm bg-[#B8860B] text-[#1A2327] font-medium hover:bg-[#d6a72d] transition"
              >
                Chat
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full text-sm border border-[#E0E0D6]/40 hover:bg-[#2B3B36] transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-full text-sm bg-[#B8860B] text-[#1A2327] font-medium hover:bg-[#d6a72d] transition"
            >
              Login
            </Link>
          )}
        </div>
      </header>

      {/* ==================== HERO SECTION ==================== */}
      <motion.section
        initial="hidden"
        animate="show"
        variants={fadeIn}
        className="min-h-screen flex flex-col justify-center items-center text-center px-6 md:px-16 bg-gradient-to-br from-[#1A2327] via-[#2B3B36] to-[#1A2327] pt-24 relative overflow-hidden"
      >
        {/* PARALLAX LIGHT EFFECT */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#B8860B22_0%,transparent_70%)] animate-pulse-slow"></div>

        <motion.h1
          variants={fadeUp}
          className="text-4xl md:text-6xl font-bold text-[#E0E0D6] leading-tight z-10"
        >
          Belajar Al-Quran & Hadis jadi lebih mudah bersama{" "}
          <span className="text-[#B8860B]">HuffadzAI</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-6 text-[#E0E0D6]/80 max-w-2xl text-lg z-10"
        >
          Asisten Islami berbasis kecerdasan buatan yang membantu
          memahami makna Al-Quran dan mendukung pembelajaran agama dengan
          cara yang modern.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-wrap justify-center gap-3 z-10"
        >
          <Link
            to="/chat"
            className="px-6 py-3 rounded-full bg-[#B8860B] text-[#1A2327] font-semibold hover:bg-[#d6a72d] transition"
          >
            Mulai Chat
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 rounded-full border border-[#E0E0D6]/40 hover:bg-[#2B3B36] transition"
          >
            Daftar
          </Link>
        </motion.div>
      </motion.section>

      {/* ==================== ABOUT SECTION ==================== */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-10 px-6 md:px-20 py-20 bg-gradient-to-br from-[#2B3B36] via-[#1A2327] to-[#2B3B36] relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#B8860B22_0%,transparent_70%)]"></div>

        {/* VIDEO */}
        <motion.div
          variants={fadeIn}
          className="w-full md:w-2/3 flex justify-center z-10"
        >
          <video
            src="/videos/huffadzAI.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="rounded-2xl shadow-2xl w-[90%] md:w-[80%] border border-[#B8860B]/30"
          />
        </motion.div>

        {/* TEXT */}
        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-[#B8860B]">
            Tentang HuffadzAI
          </h2>
          <p className="text-lg text-[#E0E0D6]/90 leading-relaxed">
          Tujuan utama HuffadzAI adalah untuk menyediakan akses cepat, mudah, dan terverifikasi
          terhadap pengetahuan Islam dengan merujuk langsung pada kitab suci Al-Qur'an dan kumpulan
          Hadis (seperti Sahih al-Bukhari, Sahih Muslim, dll.).
          </p>
          <p className="text-sm text-[#E0E0D6]/70">
            Didesain dengan ketenangan dan kemudahan dalam setiap interaksi,
            HuffadzAI menjadi teman belajar yang memahami nilai-nilai keislaman
            di era digital.
          </p>
        </div>
      </motion.section>

      {/* ==================== FITUR UNGGULAN ==================== */}
<motion.section
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.3 }}
  variants={fadeUp}
  className="relative bg-gradient-to-br from-[#1A2327] via-[#2B3B36] to-[#1A2327] text-[#E0E0D6] py-24 px-6 md:px-20 overflow-hidden"
>
  {/* Ornamen cahaya dan pola */}
  <div className="absolute top-0 right-0 w-72 h-72 bg-[#B8860B]/20 blur-3xl rounded-full"></div>
  <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B8860B]/10 blur-3xl rounded-full"></div>
  <div className="absolute inset-0 bg-[url('/patterns/islamic-pattern.svg')] opacity-5"></div>

  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
    {/* TEKS */}
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="md:w-1/2 space-y-6"
    >
      <h2 className="text-3xl md:text-5xl font-bold text-[#B8860B] leading-tight">
        Fitur Unggulan HuffadzAI
      </h2>
      <p className="text-[#E0E0D6]/80 text-lg leading-relaxed">
        HuffadzAI tidak hanya membantu hafalan, tetapi juga mendampingi
        perjalanan spiritualmu melalui berbagai fitur canggih dan bermanfaat.
      </p>

      <ul className="space-y-4 text-left">
        <li className="flex items-start gap-3">
          <div className="mt-1 w-3 h-3 bg-[#B8860B] rounded-full"></div>
          <p>
            <span className="text-[#B8860B] font-semibold">
            Teks Lengkap Al-Qur'an
            </span>{" "}
            – Termasuk ayat-ayat dan terjemahannya
          </p>
        </li>
        <li className="flex items-start gap-3">
          <div className="mt-1 w-3 h-3 bg-[#B8860B] rounded-full"></div>
          <p>
            <span className="text-[#B8860B] font-semibold">
              Asisten Islami Pintar
            </span>{" "}
            – Mampu menjawab pertanyaan seputar akidah, ibadah, muamalah, sejarah islam, dan etika
          </p>
        </li>
        <li className="flex items-start gap-3">
          <div className="mt-1 w-3 h-3 bg-[#B8860B] rounded-full"></div>
          <p>
            <span className="text-[#B8860B] font-semibold">
            Memperluas Pertanyaan 
            </span>{" "}
            – Menggunakan AI untuk mengembangkan pertanyaan pengguna agar pencarian di basis data menjadi lebih komprehensif dan akurat.
          </p>
        </li>
      </ul>

      <p className="mt-6 text-[#E0E0D6]/70 italic">
        “Sesungguhnya orang yang paling mulia di antara kamu di sisi Allah
        ialah orang yang paling bertakwa.” <br />
        <span className="text-[#B8860B]">(QS. Al-Hujurat: 13)</span>
      </p>

      <div className="mt-8">
        <button className="px-8 py-3 bg-[#B8860B] text-[#1A2327] font-semibold rounded-full hover:bg-[#d6a72d] transition shadow-lg">
          Coba Sekarang
        </button>
      </div>
    </motion.div>

    {/* GAMBAR ILUSTRASI */}
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="md:w-1/2 flex justify-center relative"
    >
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-[#B8860B]/10 blur-2xl rounded-full"></div>
      <img
        src="https://image.lexica.art/full_webp/75095b98-fe40-49e6-9d94-0590f4c412b8"
        alt="Fitur HuffadzAI"
        className="rounded-2xl shadow-2xl border border-[#B8860B]/20 w-full max-w-md z-10"
      />
    </motion.div>
  </div>
</motion.section>

      {/* ==================== KEUTAMAAN MENGHAFAL ==================== */}
<motion.section
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.3 }}
  variants={fadeUp}
  className="bg-gradient-to-br from-[#2B3B36] via-[#1A2327] to-[#2B3B36] text-[#E0E0D6] py-20 px-6 md:px-20 relative overflow-hidden"
>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,#B8860B22_0%,transparent_70%)]"></div>

  <div className="relative z-10 text-center mb-16">
    <div className="h-[2px] w-24 bg-[#B8860B] mx-auto mb-4"></div>
    <h2 className="text-3xl md:text-5xl font-bold text-[#B8860B]">
      Keutamaan Menghafal Al-Quran
    </h2>
  </div>

  {/* Timeline Container */}
  <div className="relative z-10 max-w-5xl mx-auto">
    {/* Garis Tengah */}
    <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 w-[2px] bg-[#B8860B]/40"></div>

    {[
      {
        num: 1,
        title: "Dinaikkan Derajatnya",
        desc: "Rasulullah ﷺ bersabda: 'Sebaik-baik kalian adalah yang belajar Al-Quran dan mengajarkannya.' (HR. Bukhari)",
        arab: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
      },
      {
        num: 2,
        title: "Dikumpulkan Bersama Malaikat",
        desc: "Penghafal Al-Qur’an akan ditempatkan bersama para malaikat yang mulia dan taat. (HR. Bukhari & Muslim)",
        arab: "الَّذِي يَقْرَأُ الْقُرْآنَ وَهُوَ مَاهِرٌ بِهِ مَعَ السَّفَرَةِ الْكِرَامِ الْبَرَرَةِ",
      },
      {
        num: 3,
        title: "Pemberi Syafaat",
        desc: "Al-Qur’an akan datang memberi syafaat kepada penghafalnya pada hari kiamat. (HR. Muslim)",
        arab: "اقْرَؤُوا الْقُرْآنَ، فَإِنَّهُ يَأْتِي يَوْمَ الْقِيَامَةِ شَفِيعًا لِأَصْحَابِهِ",
      },
      {
        num: 4,
        title: "Mahkota untuk Orang Tua",
        desc: "Orang tua penghafal Al-Qur’an akan diberi mahkota cahaya di hari kiamat. (HR. Abu Dawud)",
        arab: "يُكْسَى وَالِدَاهُ يَوْمَ الْقِيَامَةِ تَاجًا نُورُهُ أَضْوَأُ مِنَ الشَّمْسِ",
      },
      {
        num: 5,
        title: "Ketenangan Hati",
        desc: "Menghafal dan membaca Al-Qur’an mendatangkan ketenangan dan ketenteraman jiwa. (QS. Ar-Ra’d: 28)",
        arab: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
      },
    ].map((item, index) => (
      <motion.div
        key={index}
        variants={fadeUp}
        className={`relative flex flex-col md:flex-row items-center mb-20 ${
          index % 2 === 0 ? "md:flex-row-reverse" : ""
        }`}
      >
        {/* Teks */}
        <div className="md:w-1/2 px-6 text-center md:text-left">
          <h3 className="text-2xl font-semibold text-[#B8860B] mb-3">{item.title}</h3>
          <p className="text-[#E0E0D6]/80 mb-3 leading-relaxed">{item.desc}</p>
          <p className="text-2xl md:text-3xl font-arabic text-[#E0E0D6] leading-snug">{item.arab}</p>
        </div>

        {/* Nomor di Tengah */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <div className="bg-[#B8860B] text-[#1A2327] w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md">
            {item.num}
          </div>
        </div>
      </motion.div>
    ))}
  </div>
</motion.section>


      {/* ==================== FOOTER ==================== */}
      <footer className="bg-[#1A2327] border-t border-[#B8860B]/20 text-center py-10 text-[#E0E0D6]/70">
        <p className="mb-3">Ikuti kami di</p>
        <div className="flex justify-center gap-6 mb-4">
          <a href="#" className="hover:text-[#B8860B] transition">
            Instagram
          </a>
          <a href="#" className="hover:text-[#B8860B] transition">
            YouTube
          </a>
          <a href="#" className="hover:text-[#B8860B] transition">
            GitHub
          </a>
        </div>
        <p className="text-sm">© 2025 HuffadzAI. Semua Hak Dilindungi.</p>
      </footer>
    </div>
  );
}

export default App;
