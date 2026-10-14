import { useState, useEffect } from "react";
import { X, Send, Building2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { usePageContent } from "@/hooks/usePageContent";

const defaultPopups = {
  enabled: true,
  image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5",
  heading: "BUILD WITH MAKAAN INFRA",
  subtext: "Odisha's Most Trusted Construction Experts. Let's discuss your project today.",
  buttonText: "GET FREE CONSULTATION"
};

const LeadPopup = () => {
  const [show, setShow] = useState(false);
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { data: popupData } = usePageContent("popups", defaultPopups);

  useEffect(() => {
    if (popupData && popupData.enabled === false) return;
    const dismissed = sessionStorage.getItem("lead-popup-dismissed");
    if (dismissed) return;
    const timer = setTimeout(() => setShow(true), 3000);
    return () => clearTimeout(timer);
  }, [popupData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast({ title: "Please enter a valid phone number", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { doc, getDoc, setDoc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");
      const leadsRef = doc(db, "leads", "all_leads");
      const snapshot = await getDoc(leadsRef);
      const currentLeads = snapshot.exists() ? snapshot.data().items || [] : [];
      await setDoc(leadsRef, { items: [...currentLeads, { phone, type: "popup", date: new Date().toISOString() }] });
      
      setSubmitted(true);
      toast({ title: "Thank you! Connecting you via WhatsApp..." });
      // Open WhatsApp
      const waPhone = phone.replace(/\s+/g, "").replace(/^\+/, "");
      const msg = encodeURIComponent("Hi Makaan Infra! I'm interested in your construction services. Please contact me.");
      window.open(`https://wa.me/${waPhone.startsWith("91") ? waPhone : "91" + waPhone}?text=${msg}`, "_blank");
      setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("lead-popup-dismissed", "true");
      }, 1500);
    } catch (err) {
      toast({ title: "Failed to submit", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const dismiss = () => {
    setShow(false);
    sessionStorage.setItem("lead-popup-dismissed", "true");
  };

  if (!show || (popupData && popupData.enabled === false)) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-sm bg-black border-2 border-gold-metallic/30 rounded-3xl px-6 pt-16 pb-[45px] shadow-gold-premium overflow-hidden group flex flex-col justify-end min-h-[320px]"
      >
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
           <img src={popupData.image || defaultPopups.image} alt="Background" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2000ms]" />
           <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black" />
        </div>
        <button onClick={dismiss} className="absolute top-4 right-4 text-white/40 hover:text-gold-metallic transition-all z-10 p-1 rounded-full border border-white/5 hover:border-gold-metallic/40">
          <X size={18} />
        </button>
        <div className="relative z-10 text-center mt-auto">

          <h2 className="font-heading font-black text-xl md:text-2xl text-white mb-2 uppercase tracking-tighter leading-tight drop-shadow-lg">
            {popupData.heading || defaultPopups.heading}
          </h2>
          <p className="text-white/60 font-medium text-xs mb-5 px-2 leading-relaxed max-w-xs mx-auto">
            {popupData.subtext || defaultPopups.subtext}
          </p>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-xs mx-auto">
              <Input
                type="tel"
                placeholder="WhatsApp / Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-black/40 border-gold-metallic/20 text-white placeholder:text-white/20 h-11 font-black rounded-xl text-center text-base tracking-[0.15em] focus:border-gold-metallic transition-all"
              />
              <Button disabled={submitting} type="submit" className="bg-gold-metallic text-black font-heading font-black py-3 rounded-xl shadow-gold animate-shine hover:brightness-110 transition-all text-xs uppercase tracking-[0.2em]">
                {submitting ? <Loader2 className="animate-spin mr-3" /> : null}
                {popupData.buttonText || defaultPopups.buttonText}
              </Button>
              <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] mt-2">Instant Response • No Spam</p>
            </form>
          ) : (
            <div className="py-8">
              <p className="text-gold-metallic font-black text-2xl uppercase tracking-[0.2em] animate-pulse drop-shadow-md">TRANSMISSION SUCCESSFUL</p>
              <p className="text-white/40 text-xs font-bold mt-4 uppercase tracking-widest">Our engineers will reach out shortly.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LeadPopup;
