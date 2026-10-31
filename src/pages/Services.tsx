import { motion } from "framer-motion";
import { Building2, HardHat, Ruler, Paintbrush, Wrench, CheckCircle2, Loader2 } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import { defaultData } from "@/lib/defaults";

const FALLBACK_IMG = "/placeholder.svg";
const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = FALLBACK_IMG; };

const defaultServices = defaultData.services;

const getIcon = (name: string) => {
  const icons: Record<string, any> = { Building2, HardHat, Ruler, Paintbrush, Wrench, CheckCircle2 };
  return icons[name] || CheckCircle2;
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Services = () => {
  const { data: servicesData, loading } = usePageContent("services", defaultServices);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-gold-metallic"><Loader2 className="animate-spin mr-2" /> Loading Royal Developers...</div>;
  }

  const currentServices = servicesData || defaultServices;

  return (
    <div className="pt-20">
      <section className="relative py-24 px-4 overflow-hidden group bg-gold-metallic">
        <div className="absolute inset-0 z-0">
          <img 
            src={currentServices.hero?.image || defaultServices.hero.image} 
            alt="Services"
            onError={handleImgError}
            className="w-full h-full object-cover scale-105 transition-transform duration-1000 group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gold-metallic" />
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <motion.h1 className="font-heading font-extrabold text-5xl md:text-7xl text-white mb-6 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            {(currentServices.hero?.heading || defaultServices.hero.heading).includes(" ") ? (
              <>
                {(currentServices.hero?.heading || defaultServices.hero.heading).split(" ").slice(0, -1).join(" ")} <span className="text-gold-metallic">{(currentServices.hero?.heading || defaultServices.hero.heading).split(" ").slice(-1)}</span>
              </>
            ) : (
              <span className="text-gold-metallic">{(currentServices.hero?.heading || defaultServices.hero.heading)}</span>
            )}
          </motion.h1>
          <motion.p className="text-white/90 font-medium max-w-2xl mx-auto text-xl leading-relaxed text-shadow-strong"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          >
            {currentServices.hero?.subtext || defaultServices.hero.subtext}
          </motion.p>
        </div>
      </section>

      <section className="py-24 px-4 bg-black">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {(currentServices.cards || defaultServices.cards).map((s: any, i: number) => {
              const ServiceIcon = getIcon(s.icon || "Building2");
              const featureList = typeof s.features === 'string' ? s.features.split(',').map((f: string) => f.trim()).filter(Boolean) : (s.features || []);

              return (
                <motion.div key={i}
                  className="bg-white/5 border border-gold-metallic/10 rounded-3xl overflow-hidden shadow-lg hover:shadow-gold transition-all duration-500 group"
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                >
                  <div className="relative h-72 overflow-hidden">
                    <img src={s.image || defaultServices.cards[0].image} alt={s.title} onError={handleImgError} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                    <div className="absolute bottom-6 left-6 w-16 h-16 rounded-2xl bg-gold-metallic flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform duration-500">
                      <ServiceIcon className="text-black" size={32} />
                    </div>
                  </div>
                  <div className="p-10">
                    <h2 className="font-heading font-black text-2xl text-white mb-6 uppercase tracking-tighter group-hover:text-gold-metallic transition-colors">{s.title || "Elite Service"}</h2>
                    <p className="text-white/40 font-medium mb-10 leading-relaxed text-sm h-24 line-clamp-4 italic border-l border-gold-metallic/30 pl-4">{s.desc}</p>
                    {featureList.length > 0 && (
                      <div className="space-y-4 pt-8 border-t border-white/5">
                        {featureList.slice(0, 4).map((f: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-4">
                            <CheckCircle2 size={16} className="text-gold-metallic shrink-0 opacity-60" />
                            <span className="text-[11px] text-white/60 font-black uppercase tracking-widest">{f}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
