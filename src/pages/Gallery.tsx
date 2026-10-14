import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import { defaultData } from "@/lib/defaults";
import imgProject1 from "@/assets/project-1.jpg";

const FALLBACK_IMG = "/placeholder.svg";
const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = FALLBACK_IMG; };

const defaultGallery = defaultData.gallery;

const CATEGORIES = ["All", "Residential", "Commercial", "Infrastructure", "Interior"];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const Gallery = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: galleryData, loading } = usePageContent("gallery", defaultGallery);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-gold-metallic"><Loader2 className="animate-spin mr-2" /> Loading Makaan Infra...</div>;
  }

  // Assign categories to items if missing (fallback round-robin)
  const categorized = galleryData.items.map((img: any, i: number) => ({
    ...img,
    category: img.category || CATEGORIES[1 + (i % (CATEGORIES.length - 1))]
  }));

  const filtered = activeCategory === "All" ? categorized : categorized.filter((img: any) => img.category === activeCategory);

  const openLightbox = (index: number) => setSelected(index);
  const closeLightbox = () => setSelected(null);
  const prev = () => setSelected((s) => s !== null ? (s - 1 + filtered.length) % filtered.length : null);
  const next = () => setSelected((s) => s !== null ? (s + 1) % filtered.length : null);

  return (
    <div className="pt-20">
      <section className="relative py-24 px-4 overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <img 
            src={galleryData.hero?.image || defaultGallery.hero.image} 
            alt="Gallery"
            onError={handleImgError}
            className="w-full h-full object-cover scale-105 transition-transform duration-1000 group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-black/80" />
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gold-metallic" />
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <motion.h1 className="font-heading font-extrabold text-5xl md:text-7xl text-white mb-6 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {(galleryData.hero?.heading || defaultGallery.hero.heading).includes(" ") ? (
              <>
                {(galleryData.hero?.heading || defaultGallery.hero.heading).split(" ").slice(0, -1).join(" ")} <span className="text-gold-metallic">{(galleryData.hero?.heading || defaultGallery.hero.heading).split(" ").slice(-1)}</span>
              </>
            ) : (
              <span className="text-gold-metallic">{(galleryData.hero?.heading || defaultGallery.hero.heading)}</span>
            )}
          </motion.h1>
          <motion.p className="text-white/90 font-medium max-w-2xl mx-auto text-xl leading-relaxed text-shadow-strong"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          >
            {galleryData.hero?.subtext || defaultGallery.hero.subtext}
          </motion.p>
        </div>
      </section>

      <section className="py-24 px-4 bg-black border-y border-gold-metallic/20">
        <div className="container mx-auto">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full font-heading font-black text-xs uppercase tracking-widest transition-all duration-300 border ${
                  activeCategory === cat
                    ? "bg-gold-metallic text-black border-gold-metallic shadow-gold"
                    : "bg-white/5 text-white/60 border-gold-metallic/20 hover:border-gold-metallic/50 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((img: any, i: number) => (
                <motion.div key={i}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-gold-metallic/10 bg-white/5 hover:border-gold-metallic/40 transition-all duration-700"
                  onClick={() => openLightbox(i)}
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                >
                  <div className="relative overflow-hidden aspect-square">
                    <img src={img.image || imgProject1} alt={img.title} onError={handleImgError} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-95 group-hover:scale-100 bg-black/40 backdrop-blur-[2px]">
                      <span className="text-gold-metallic font-heading font-black text-2xl uppercase tracking-tighter mb-2 text-center">{img.title}</span>
                      <span className="text-gold-metallic/60 font-black text-[10px] uppercase tracking-[0.3em] bg-gold-metallic/10 px-3 py-1 rounded-full border border-gold-metallic/20 mb-2">{img.category}</span>
                      <span className="text-white/60 font-black text-[10px] uppercase tracking-[0.2em] text-center">{img.desc}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-white/40 font-black uppercase tracking-widest">No images in this category yet.</div>
          )}
        </div>
      </section>

      {/* Lightbox with navigation */}
      <AnimatePresence>
        {selected !== null && filtered[selected] && (
          <motion.div
            className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
              className="relative max-w-5xl w-full"
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={closeLightbox} className="absolute -top-12 md:-top-16 right-0 text-white hover:text-gold-metallic transition-colors z-10">
                <X size={40} />
              </button>
              {/* Prev/Next */}
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-2 md:left-0 top-1/2 -translate-y-1/2 md:-translate-x-16 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/70 border border-gold-metallic/30 flex items-center justify-center text-white hover:text-gold-metallic hover:border-gold-metallic transition-all z-10"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-2 md:right-0 top-1/2 -translate-y-1/2 md:translate-x-16 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/70 border border-gold-metallic/30 flex items-center justify-center text-white hover:text-gold-metallic hover:border-gold-metallic transition-all z-10"
              >
                <ChevronRight size={28} />
              </button>
              <img
                src={filtered[selected].image || imgProject1}
                alt={filtered[selected].title}
                onError={handleImgError}
                className="w-full rounded-2xl border-4 border-gold-metallic shadow-gold-premium object-contain max-h-[80vh]"
              />
              <div className="text-center mt-6 flex flex-col items-center gap-2">
                <p className="text-gold-metallic font-heading font-black text-2xl uppercase tracking-widest drop-shadow-md">{filtered[selected].title}</p>
                <span className="text-[10px] font-black uppercase tracking-widest text-gold-metallic/60 bg-gold-metallic/10 px-3 py-1 rounded-full border border-gold-metallic/20">{filtered[selected].category}</span>
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider">{selected + 1} / {filtered.length}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
