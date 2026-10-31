import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { usePageContent } from "@/hooks/usePageContent";
import { defaultData } from "@/lib/defaults";

const defaultCareer = defaultData.career;

const Career = () => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", position: "" });
  const [resume, setResume] = useState<File | null>(null);
  const { toast } = useToast();
  const { data: careerData } = usePageContent("career", defaultCareer);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || !form.position) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    try {
      const { ref, get, set } = await import("firebase/database");
      const { rtdb, RTDB_ROOT } = await import("@/lib/firebase");
      const appsRef = ref(rtdb, `${RTDB_ROOT}/website_content/applications`);
      const snapshot = await get(appsRef);
      const currentApps = snapshot.exists() ? (snapshot.val()?.items || []) : [];
      const updatedApps = [...currentApps, { ...form, resumeName: resume?.name || "", date: new Date().toISOString() }];
      await set(appsRef, { items: updatedApps });
      const rootAppsRef = ref(rtdb, `${RTDB_ROOT}/applications/all_applications`);
      await set(rootAppsRef, { items: updatedApps });
      toast({ title: "Application submitted successfully!" });
      setForm({ name: "", phone: "", email: "", position: "" });
      setResume(null);
    } catch (err) {
      toast({ title: "Failed to submit application", variant: "destructive" });
    }
  };

  return (
    <div className="pt-20">
      <section className="relative py-24 px-4 overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <img 
            src={careerData.hero?.image || defaultCareer.hero.image} 
            alt="Career" 
            className="w-full h-full object-cover scale-105 transition-transform duration-1000 group-hover:scale-100 opacity-40"
          />
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gold-metallic" />
        </div>
        <div className="container mx-auto text-center relative z-10">
          <motion.h1 className="font-heading font-black text-5xl md:text-7xl text-white mb-6 uppercase tracking-widest drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {(careerData.hero?.heading || defaultCareer.hero.heading).includes(" ") ? (
              <>
                {(careerData.hero?.heading || defaultCareer.hero.heading).split(" ").slice(0, -1).join(" ")} <span className="text-gold-metallic">{(careerData.hero?.heading || defaultCareer.hero.heading).split(" ").slice(-1)}</span>
              </>
            ) : (
              <span className="text-gold-metallic">{(careerData.hero?.heading || defaultCareer.hero.heading)}</span>
            )}
          </motion.h1>
          <p className="text-white/80 max-w-2xl mx-auto font-bold text-xl tracking-wide text-shadow-strong">
            {careerData.hero?.subtext || defaultCareer.hero.subtext}
          </p>
        </div>
      </section>

      <section className="py-24 px-4 bg-black border-y border-gold-metallic/20">
        <div className="container mx-auto max-w-xl">
          <div className="bg-white/5 border border-gold-metallic/20 rounded-3xl p-6 sm:p-10 md:p-14 shadow-gold relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-metallic/5 rounded-full blur-3xl group-hover:bg-gold-metallic/10 transition-colors" />
            <h2 className="font-heading font-black text-3xl text-white mb-10 text-center uppercase tracking-widest border-b-2 border-gold-metallic/30 pb-4">Job Inquiry</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gold-metallic uppercase tracking-[0.2em] ml-1">Full Identity *</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-black/40 border-gold-metallic/10 text-white placeholder:text-white/20 h-14 font-black uppercase text-xs tracking-widest rounded-xl focus:border-gold-metallic/50" placeholder="e.g. AR. SHARMA" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gold-metallic uppercase tracking-[0.2em] ml-1">Secure Contact *</label>
                <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-black/40 border-gold-metallic/10 text-white placeholder:text-white/20 h-14 font-black uppercase text-xs tracking-widest rounded-xl focus:border-gold-metallic/50" placeholder="+91 XXXX XXXX XX" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gold-metallic uppercase tracking-[0.2em] ml-1">Digital Address *</label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-black/40 border-gold-metallic/10 text-white placeholder:text-white/20 h-14 font-black uppercase text-xs tracking-widest rounded-xl focus:border-gold-metallic/50" placeholder="PROFESSIONAL@EMAIL.COM" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gold-metallic uppercase tracking-[0.2em] ml-1">Proposed Position *</label>
                <Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="bg-black/40 border-gold-metallic/10 text-white placeholder:text-white/20 h-14 font-black uppercase text-xs tracking-widest rounded-xl focus:border-gold-metallic/50" placeholder="e.g. PROJECT DIRECTOR" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gold-metallic uppercase tracking-[0.2em] ml-1">Master Portfolio (PDF) *</label>
                <Input type="file" accept=".pdf" onChange={(e) => setResume(e.target.files?.[0] || null)} className="bg-black/40 border-gold-metallic/10 text-white h-14 font-black text-xs tracking-widest rounded-xl file:bg-gold-metallic file:text-black file:font-black file:mr-6 file:px-6 file:py-2 file:h-full file:border-none hover:file:bg-white transition-all focus:border-gold-metallic/50" />
              </div>
              <Button type="submit" className="w-full bg-gold-metallic text-black font-heading font-black py-8 text-sm uppercase tracking-[0.3em] rounded-xl shadow-gold hover:brightness-110 transition-all animate-shine mt-6">TRANSMIT APPLICATION</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Career;
