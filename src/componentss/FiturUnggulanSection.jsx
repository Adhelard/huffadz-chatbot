import { motion } from "framer-motion";
import { Brain, Book, MessageCircle } from "lucide-react";

export default function FiturUnggulanSection() {
  const features = [
    {
      icon: <Book className="w-8 h-8 text-[#B8860B]" />,
      title: "Murajaah Interaktif",
      desc: "Ulangi hafalan dengan bimbingan AI yang memahami tempo dan tajwid.",
    },
    {
      icon: <Brain className="w-8 h-8 text-[#B8860B]" />,
      title: "Pembelajaran Kontekstual",
      desc: "Pelajari makna ayat dengan penjelasan tematik dan tafsir sederhana.",
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-[#B8860B]" />,
      title: "Asisten Pintar",
      desc: "Diskusikan hafalanmu dengan AI layaknya mentor pribadi.",
    },
  ];

  return (
    <section className="py-28 bg-gradient-to-br from-[#141C1F] via-[#1A2327] to-[#0F1416] text-center relative overflow-hidden">
      {/* Ornamen Background */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(184,134,11,0.1),transparent_60%)]"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-bold mb-10 text-[#FFD700]"
        >
          Fitur Unggulan IslamAI
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="grid md:grid-cols-3 gap-10 mt-12"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="bg-[#1E2A2F]/80 backdrop-blur-md border border-[#B8860B]/20 rounded-2xl p-8 shadow-lg hover:shadow-[#B8860B]/20 transition"
            >
              <div className="flex justify-center mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-[#FFD700]">
                {f.title}
              </h3>
              <p className="text-[#E0E0D6]/80">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
