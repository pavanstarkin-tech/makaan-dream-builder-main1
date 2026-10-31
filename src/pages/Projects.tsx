import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Building2, Loader2 } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import imgHeroBg from "@/assets/hero-bg.jpg";
import imgProject1 from "@/assets/project-1.jpg";
import imgProject2 from "@/assets/project-2.jpg";
import imgProject3 from "@/assets/project-3.jpg";
import imgProject4 from "@/assets/project-4.jpg";
import imgProject5 from "@/assets/project-5.jpg";
import imgLakeview from "@/assets/lakeview.png";
import imgTechpark from "@/assets/techpark.png";
import imgProject6 from "@/assets/project-6.jpg";
import imgConstruction from "@/assets/hero-construction.jpg";

import { defaultData } from "@/lib/defaults";

const FALLBACK_IMG = "/placeholder.svg";
const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = FALLBACK_IMG; };

const tabs = ["All", "Ongoing", "Completed", "Upcoming"] as const;

const defaultProjects = defaultData.projects;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Projects = () => {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("All");
  const { data: projectsData, loading } = usePageContent("projects", defaultProjects);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-gold-metallic"><Loader2 className="animate-spin mr-2" /> Loading Royal Developers...</div>;
  }

  const currentProjects = projectsData || defaultProjects;
  const filteredProjects = activeTab === "All" ? currentProjects.items : currentProjects.items.filter((p: any) => p.category === activeTab);

  return (
    <div className="pt-20">
      <section className="relative py-24 px-4 overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <img 
            src={projectsData.heroImage || defaultProjects.heroImage} 
            alt="HQ Construction"
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
          {projectsData.heroHeading.includes(" ") ? (
            <>
              {projectsData.heroHeading.split(" ").slice(0, -1).join(" ")} <span className="text-gold-metallic">{projectsData.heroHeading.split(" ").slice(-1)}</span>
            </>
          ) : (
            <span className="text-gold-metallic">{projectsData.heroHeading}</span>
          )}
        </motion.h1>
        <motion.p className="text-white/90 font-medium max-w-2xl mx-auto text-xl leading-relaxed text-shadow-strong"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        >
          {projectsData.heroSubtext}
        </motion.p>
        </div>
      </section>

      <section className="py-24 px-4 bg-black border-y border-gold-metallic/20 min-h-screen">
        <div className="container mx-auto">
          {/* Tabs */}
          <div className="flex justify-center flex-wrap gap-2 sm:gap-4 mb-12 sm:mb-20">
            {tabs.map((t) => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-4 py-2 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-heading font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] transition-all duration-500 ${
                  activeTab === t ? "bg-gold-metallic text-black shadow-gold" : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10 border border-white/10"
                }`}
              >{t}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProjects.map((p: any, i: number) => (
              <motion.div key={i}
                className="group relative overflow-hidden rounded-3xl border border-gold-metallic/10 bg-white/5 hover:border-gold-metallic/40 transition-all duration-700"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              >
                <div className="overflow-hidden aspect-[4/3]">
                  <img src={p.image || imgProject1} alt={p.title} onError={handleImgError} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                </div>
                <div className="absolute top-6 right-6 z-20">
                  <span className="text-[10px] font-black uppercase bg-gold-metallic text-black px-5 py-2 rounded-xl shadow-gold">{p.category}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-10 z-10 transition-transform duration-500 group-hover:-translate-y-2">
                  <h3 className="font-heading font-black text-2xl text-white uppercase tracking-tighter mb-4 group-hover:text-gold-metallic transition-colors">{p.title}</h3>
                  <div className="flex flex-col gap-3">
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2"><MapPin size={14} className="text-gold-metallic" />{p.location}</p>
                    <p className="text-white/60 text-xs font-medium leading-relaxed italic border-l border-gold-metallic/30 pl-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">{p.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {filteredProjects.length === 0 && (
              <div className="col-span-full py-40 text-center">
                <Building2 size={64} className="mx-auto mb-6 text-gold-metallic/20 animate-pulse" />
                <p className="text-white/20 font-black uppercase tracking-[0.3em] text-xs">No ventures listed in this category</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
