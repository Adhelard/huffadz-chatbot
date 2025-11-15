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

// Efek masuk halus dari bawah
const smoothUp = {
  hidden: { opacity: 0, y: 80, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// Efek muncul berurutan
const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

// Efek fade lembut
const fadeSoft = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 1.2, ease: "easeOut" },
  },
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
          IslamAI
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
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="min-h-screen flex flex-col justify-center items-center text-center px-6 md:px-16 bg-gradient-to-br from-[#1A2327] via-[#2B3B36] to-[#1A2327] pt-24 relative overflow-hidden"
          >
        {/* PARALLAX LIGHT EFFECT */}
        <motion.div
          variants={fadeSoft}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,#B8860B22_0%,transparent_70%)] animate-pulse-slow"
        ></motion.div>

        <motion.h1
          variants={smoothUp}
          className="text-4xl md:text-6xl font-bold text-[#E0E0D6] leading-tight z-10"
        >
          Belajar Al-Qur’an & Hadits jadi lebih mudah bersama{" "}
          <span className="text-[#B8860B]">IslamAI</span>
        </motion.h1>

        <motion.p
          variants={smoothUp}
          className="mt-6 text-[#E0E0D6]/80 max-w-2xl text-lg z-10"
        >
          Pendamping cerdas yang membantu memahami dan menghafal Al-Qur’an dengan
          mudah, akurat, dan bermakna.
        </motion.p>

        <motion.div
          variants={staggerContainer}
          className="mt-8 flex flex-wrap justify-center gap-3 z-10"
        >
          <motion.div variants={smoothUp}>
            <Link
              to="/chat"
              className="px-6 py-3 rounded-full bg-[#B8860B] text-[#1A2327] font-semibold hover:bg-[#d6a72d] transition shadow-lg hover:shadow-[#B8860B]/40 hover:scale-[1.05] duration-300"
            >
              Mulai Chat
            </Link>
          </motion.div>
          <motion.div variants={smoothUp}>
            <Link
              to="/register"
              className="px-6 py-3 rounded-full border border-[#E0E0D6]/40 hover:bg-[#2B3B36] transition hover:scale-[1.05] duration-300"
            >
              Daftar
            </Link>
          </motion.div>
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
            Tentang IslamAI
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
        {/* Ornamen cahaya */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#B8860B]/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B8860B]/10 blur-3xl rounded-full"></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
          {/* TEKS */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:w-1/2 space-y-6"
          >
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <p>
                  <span className="text-[#B8860B] font-semibold text-3xl md:text-5xl font-bold text-[#B8860B] leading-tight">
                    Teks Lengkap Al-Quran
                    <p className="text-[#E0E0D6]/80 text-lg leading-relaxed">
                    Nikmati kemudahan memahami Al-Qur’an secara lengkap dengan terjemahan dan tafsir terpercaya.
                    Setiap ayat disajikan dengan tampilan yang indah dan mudah dibaca,
                    membantu Anda mendalami makna firman Allah di mana saja dan kapan saja.
                    </p>
                  </span>{" "}
                </p>
              </div>
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
            <motion.img
              src="https://i.pinimg.com/736x/29/1c/0c/291c0c1b2a037997a0d422272c86b977.jpg"
              alt="Fitur HuffadzAI"
              className="rounded-2xl shadow-2xl border border-[#B8860B]/20 w-full max-w-md z-10"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
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
        {/* Ornamen cahaya */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#B8860B]/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B8860B]/10 blur-3xl rounded-full"></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
          {/* TEKS */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:w-1/2 space-y-6"
          >
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <p>
                  <span className="text-[#B8860B] font-semibold text-3xl md:text-5xl font-bold text-[#B8860B] leading-tight">
                    Asisten Islam Pintar
                    <p className="text-[#E0E0D6]/80 text-lg leading-relaxed">
                      IslamAI hadir sebagai teman belajar dan penuntun spiritual Anda.
                      Dengan teknologi kecerdasan buatan,
                      IslamAI membantu menjawab pertanyaan seputar Islam berdasarkan
                      sumber-sumber yang sahih — dari Al-Qur’an, Hadis, hingga pandangan ulama.
                    </p>
                  </span>{" "}
                </p>
              </div>
            </div>
          </motion.div>

{/* GAMBAR ILUSTRASI (diganti dengan video looping) */}
<motion.div
  initial={{ opacity: 0, x: 60 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  className="md:w-1/2 flex justify-center relative"
>
  {/* Efek cahaya blur latar belakang */}
  <div className="absolute -top-10 -left-10 w-72 h-72 bg-[#B8860B]/10 blur-2xl rounded-full"></div>
  {/* Video utama */}
  <motion.div
    variants={fadeIn}
    className="w-full md:w-5/3 flex justify-center z-10"
  >
    <video
      src="/videos/asisten-pintar.mp4"
      autoPlay
      loop
      muted
      playsInline
      className="rounded-2xl shadow-2xl w-[90%] md:w-[80%] border border-[#B8860B]/30"
    />
            </motion.div>
          </motion.div>
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
        {/* Ornamen cahaya */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#B8860B]/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B8860B]/10 blur-3xl rounded-full"></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
          {/* TEKS */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:w-1/2 space-y-6"
          >
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <p>
                  <span className="text-[#B8860B] font-semibold text-3xl md:text-5xl font-bold text-[#B8860B] leading-tight">
                    Memperluas Pertanyaan
                    <p className="text-[#E0E0D6]/80 text-lg leading-relaxed">
                    Tidak hanya menjawab, IslamAI membantu Anda memperdalam pemahaman. Tanyakan apa saja tentang
                    ibadah, akhlak, sejarah Islam, atau kehidupan
                    sehari-hari — dan dapatkan jawaban yang menuntun hati serta menambah ilmu.
                    </p>
                  </span>{" "}
                </p>
              </div>
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
            <motion.img
              src="https://image.lexica.art/full_webp/75095b98-fe40-49e6-9d94-0590f4c412b8"
              alt="Fitur HuffadzAI"
              className="rounded-2xl shadow-2xl border border-[#B8860B]/20 w-full max-w-md z-10"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </motion.section>
      

{/* ==================== APA YANG BISA DILAKUKAN HUFFADZAI ==================== */}
<motion.section
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, amount: 0.3 }}
  variants={fadeUp}
  className="bg-gradient-to-br from-[#1A2327] via-[#2B3B36] to-[#1A2327] text-[#E0E0D6] py-24 px-6 md:px-20 relative overflow-hidden"
>
  {/* Ornamen Background */}
  <div className="absolute inset-0 bg-[url('/patterns/islamic-pattern.svg')] opacity-5"></div>
  <div className="absolute top-0 right-0 w-72 h-72 bg-[#B8860B]/10 blur-3xl rounded-full"></div>
  <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B8860B]/10 blur-3xl rounded-full"></div>

  <div className="relative z-10 text-center mb-16">
    <div className="h-[2px] w-24 bg-[#B8860B] mx-auto mb-4"></div>
    <h2 className="text-3xl md:text-5xl font-bold text-[#B8860B]">
      Apa yang Bisa Dilakukan IslamAI
    </h2>
  </div>

  {/* Card Container */}
  <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
    {/* CARD 1 */}
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-[#2B3B36]/60 border border-[#B8860B]/20 rounded-2xl p-8 text-center shadow-xl hover:shadow-[#B8860B]/30 transition-all duration-300"
    >
      <Book className="w-12 h-12 text-[#B8860B] mx-auto mb-5" />
      <h3 className="text-xl font-semibold text-[#B8860B] mb-3">Belajar Interaktif</h3>
    </motion.div>

    {/* CARD 2 */}
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-[#2B3B36]/60 border border-[#B8860B]/20 rounded-2xl p-8 text-center shadow-xl hover:shadow-[#B8860B]/30 transition-all duration-300"
    >
      <Brain className="w-12 h-12 text-[#B8860B] mx-auto mb-5" />
      <h3 className="text-xl font-semibold text-[#B8860B] mb-3">Asisten Cerdas Islami</h3>
    </motion.div>

    {/* CARD 3 */}
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-[#2B3B36]/60 border border-[#B8860B]/20 rounded-2xl p-8 text-center shadow-xl hover:shadow-[#B8860B]/30 transition-all duration-300"
    >
      <MessageCircle className="w-12 h-12 text-[#B8860B] mx-auto mb-5" />
      <h3 className="text-xl font-semibold text-[#B8860B] mb-3">Konsultasi Islami</h3>
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


<FiturUnggulanSection />
<ScrollShowcase />


     {/* ==================== CALL TO ACTION ==================== */}
<CallToActionSection />

{/* ==================== FOOTER ==================== */}
<footer className="bg-[#1A2327] border-t border-[#B8860B]/20 text-center py-10 text-[#E0E0D6]/70 relative z-10">
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

// ===============================================
// SECTION: CALL TO ACTION
// ===============================================

function CallToActionSection() {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative overflow-hidden py-28 px-6 md:px-20 text-center bg-gradient-to-br from-[#1A2327] via-[#2B3B36] to-[#1A2327] text-[#E0E0D6]"
    >
      {/* Cahaya lembut & pola latar */}
      <div className="absolute inset-0 bg-[url('/patterns/islamic-pattern.svg')] opacity-5"></div>
      <div className="absolute -top-20 -right-32 w-96 h-96 bg-[#B8860B]/10 blur-3xl rounded-full"></div>
      <div className="absolute -bottom-20 -left-32 w-96 h-96 bg-[#B8860B]/10 blur-3xl rounded-full"></div>

      {/* Teks Utama */}
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-extrabold leading-tight mb-6"
        >
          Jadikan Hafalanmu{" "}
          <span className="text-[#B8860B]">Lebih Mudah </span>
          Bersama <span className="text-[#FFD700]">IslamAI</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg text-[#E0E0D6]/80 max-w-2xl mx-auto mb-10"
        >
          IslamAI siap menemani perjalananmu menghafal Al-Qur’an dengan penuh
          semangat, makna, dan kemudahan. Bergabunglah sekarang dan jadilah
          bagian dari para penghafal Qur’an modern yang terinspirasi oleh cahaya
          ilmu dan teknologi.
        </motion.p>

        {/* Tombol Aksi */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex justify-center"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 0px 25px rgba(184, 134, 11, 0.6)",
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/chat")}
            className="relative px-10 py-4 bg-[#B8860B] text-[#1A2327] font-semibold rounded-full text-lg transition-all duration-300"
          >
            Mulai Sekarang
            <span className="absolute inset-0 rounded-full bg-[#FFD700]/40 blur-xl opacity-50 animate-pulse"></span>
          </motion.button>
        </motion.div>
      </div>

      {/* Ornamen Cahaya Animasi */}
      <motion.div
        className="absolute top-0 left-1/3 w-80 h-80 bg-[#B8860B]/10 rounded-full blur-3xl"
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.section>
  );
}

export default App;

