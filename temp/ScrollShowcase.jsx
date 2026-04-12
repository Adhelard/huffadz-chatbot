import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useRef } from "react";

const scenes = [
  { img: "/videos/vidio1.mp4" },
  { img: "/videos/vidio2.mp4" },
  { img: "/videos/vidio3.mp4" },
];

export default function ScrollShowcase() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <section
      ref={containerRef}
      className="h-[300vh] relative bg-[#0F1416] scroll-smooth"
      style={{
        scrollSnapType: "y mandatory",
      }}
    >
      {scenes.map((scene, i) => (
        <Scene key={i} img={scene.img} index={i} y={y} />
      ))}
    </section>
  );
}

function Scene({ img, y }) {
  const ref = useRef(null);
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.5,
  });

  const setRefs = (node) => {
    ref.current = node;
    inViewRef(node);
  };

  return (
    <div
      ref={setRefs}
      className="h-screen flex items-center justify-center snap-center relative overflow-hidden"
    >
      {/* Aura cahaya lembut */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,134,11,0.08),transparent_70%)]"
        animate={{ opacity: inView ? [0.2, 0.5, 0.2] : 0 }}
        transition={{ duration: 3, repeat: inView ? Infinity : 0 }}
      />

      {/* Media utama di tengah */}
      <motion.div
        style={{ y }}
        className="relative flex justify-center items-center"
      >
        <motion.div
          className="absolute inset-0 rounded-full blur-3xl bg-[#B8860B]/20"
          animate={
            inView
              ? { opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }
              : { opacity: 0 }
          }
          transition={{ duration: 4, repeat: inView ? Infinity : 0 }}
        />

        {img.endsWith(".mp4") ? (
          <motion.video
            src={img}
            autoPlay
            muted
            loop
            playsInline
            className="rounded-3xl shadow-2xl max-h-[600px] md:max-h-[700px] object-cover relative z-10"
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0.5, scale: 0.9 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        ) : (
          <motion.img
            src={img}
            alt="showcase visual"
            className="rounded-3xl shadow-2xl max-h-[600px] md:max-h-[700px] object-cover relative z-10"
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0.5, scale: 0.9 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        )}
      </motion.div>
    </div>
  );
}
