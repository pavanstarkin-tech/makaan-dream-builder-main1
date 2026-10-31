import { motion } from "framer-motion";
import { Target, Eye, Award, Users, Heart, Shield, CheckCircle2, Star, Clock, Loader2, Zap } from "lucide-react";
import modernPlanningImg from "@/assets/modern-planning-user.jpg";
import { usePageContent } from "@/hooks/usePageContent";
import { defaultData } from "@/lib/defaults";

const FALLBACK_IMG = "/placeholder.svg";
const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = FALLBACK_IMG; };

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const defaultAbout = defaultData.about;

const getIcon = (name: string) => {
  const icons: Record<string, any> = { Heart, Award, Clock, Shield, Users, Star, Zap, Eye, Target };
  return icons[name] || CheckCircle2;
};

const About = () => {
  const { data: aboutData, loading } = usePageContent("about", defaultAbout);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-gold-metallic"><Loader2 className="animate-spin mr-2" /> Loading Royal Developers...</div>;
  }

  return (
    <div className="pt-20">
      <section className="relative py-24 px-4 overflow-hidden group bg-gold-metallic">
        <div className="absolute inset-0 z-0">
          <img 
            src={aboutData.hero?.image || defaultAbout.hero.image} 
            alt="About Us"
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
            {(aboutData.hero?.heading || defaultAbout.hero.heading).includes(" ") ? (
              <>
                {(aboutData.hero?.heading || defaultAbout.hero.heading).split(" ").slice(0, -1).join(" ")} <span className="text-gold-metallic">{(aboutData.hero?.heading || defaultAbout.hero.heading).split(" ").slice(-1)}</span>
              </>
            ) : (
              <span className="text-gold-metallic">{(aboutData.hero?.heading || defaultAbout.hero.heading)}</span>
            )}
          </motion.h1>
          <motion.p className="text-white/90 font-medium max-w-2xl mx-auto text-xl leading-relaxed text-shadow-strong"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          >
            {aboutData.hero?.subtext || defaultAbout.hero.subtext}
          </motion.p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-4 bg-black border-b border-gold-metallic/20">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <span className="text-gold-metallic font-heading font-black text-xs tracking-[0.4em] uppercase block mb-6">OUR ODYSSEY</span>
              <h2 className="font-heading font-black text-4xl md:text-5xl text-white mt-2 mb-8 uppercase tracking-tight">Visionary <span className="text-gold-metallic">Engineering</span></h2>
              <div className="text-white/70 font-medium leading-relaxed mb-8 text-xl italic border-l-2 border-gold-metallic/30 pl-6 whitespace-pre-wrap">
                {aboutData.story}
              </div>
            </motion.div>
            <motion.div className="grid grid-cols-2 gap-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              {(aboutData.stats || defaultAbout.stats).map((s: any) => (
                <div key={s.label} className="bg-white/5 border border-gold-metallic/10 rounded-2xl p-8 text-center hover:border-gold-metallic transition-all group">
                  <div className="font-heading font-black text-4xl text-gold-metallic group-hover:scale-110 transition-transform">{s.val}</div>
                  <div className="text-white/40 text-[10px] uppercase font-black tracking-widest mt-2">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 px-4 bg-[#050505]">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <motion.div className="bg-white/5 border border-gold-metallic/20 rounded-3xl p-12 shadow-gold group hover:border-gold-metallic/40 transition-all" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <div className="w-16 h-16 rounded-2xl bg-black border border-gold-metallic/30 flex items-center justify-center mb-8 group-hover:shadow-gold transition-all">
                <Eye className="text-gold-metallic" size={32} />
              </div>
              <h3 className="font-heading font-black text-2xl text-white mb-6 uppercase tracking-widest">The Vision</h3>
              <p className="text-white/70 font-medium leading-relaxed text-lg italic">
                {aboutData.vision}
              </p>
            </motion.div>
            <motion.div className="bg-white/5 border border-gold-metallic/20 rounded-3xl p-12 shadow-gold group hover:border-gold-metallic/40 transition-all" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              <div className="w-16 h-16 rounded-2xl bg-black border border-gold-metallic/30 flex items-center justify-center mb-8 group-hover:shadow-gold transition-all">
                <Target className="text-gold-metallic" size={32} />
              </div>
              <h3 className="font-heading font-black text-2xl text-white mb-6 uppercase tracking-widest">The Mission</h3>
              <p className="text-white/70 font-medium leading-relaxed text-lg italic">
                {aboutData.mission}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-4 bg-black border-y border-gold-metallic/10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold-metallic font-heading font-black text-xs tracking-[0.4em] uppercase block mb-4">OUR PRINCIPLES</span>
            <h2 className="font-heading font-black text-4xl md:text-5xl text-white uppercase tracking-tighter">The Royal Standard</h2>
            <div className="w-16 h-1 bg-gold-metallic mx-auto mt-6 rounded-full" />
          </div>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {(aboutData.values || defaultAbout.values).map((v: any, i: number) => {
              const ValueIcon = getIcon(v.icon);
              return (
                <motion.div key={i} className="bg-white/5 border border-gold-metallic/10 rounded-2xl p-10 hover:border-gold-metallic/40 transition-all duration-500 group"
                  variants={fadeUp} whileHover={{ y: -10 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-metallic/10 flex items-center justify-center mb-6 group-hover:bg-gold-metallic transition-colors">
                    <ValueIcon className="text-gold-metallic group-hover:text-black transition-colors" size={24} />
                  </div>
                  <h3 className="font-heading font-black text-xl text-white mb-3 uppercase tracking-wider">{v.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{v.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-4 bg-[#080808]">
        <div className="container mx-auto max-w-4xl relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold-metallic/5 blur-[120px]" />
          <div className="relative z-10">
            <div className="text-center mb-16">
              <span className="text-gold-metallic font-heading font-black text-xs tracking-[0.4em] uppercase block mb-4">ADVANTAGES</span>
              <h2 className="font-heading font-black text-4xl md:text-5xl text-white uppercase tracking-tighter">Why Royal Developers?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {(aboutData.whyChoose || defaultAbout.whyChoose).map((item: string, i: number) => (
                <motion.div key={i} className="flex items-center gap-6 p-6 rounded-2xl border border-gold-metallic/10 bg-white/5 hover:border-gold-metallic/30 hover:shadow-gold transition-all group"
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-metallic/10 flex items-center justify-center shrink-0 group-hover:bg-gold-metallic transition-all border border-gold-metallic/20">
                    <CheckCircle2 className="text-gold-metallic group-hover:text-black transition-colors" size={24} />
                  </div>
                  <span className="text-white font-black text-xs uppercase tracking-widest">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
