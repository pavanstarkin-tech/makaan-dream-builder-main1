import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MapPin, Mail, Clock, Loader2, MessageCircle, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { usePageContent } from "@/hooks/usePageContent";
import { defaultData } from "@/lib/defaults";
import { Link } from "react-router-dom";

const defaultContact = defaultData.contact;
const WA_NUMBER = "918926277881";

const Contact = () => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const { toast } = useToast();
  const { data: contactData, loading } = usePageContent("contact", defaultContact);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    try {
      const { doc, getDoc, setDoc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");
      const leadsRef = doc(db, "leads", "all_leads");
      const snapshot = await getDoc(leadsRef);
      const currentLeads = snapshot.exists() ? snapshot.data().items || [] : [];
      await setDoc(leadsRef, { items: [...currentLeads, { ...form, type: "contact", date: new Date().toISOString() }] });
    } catch (err) {
      console.error("Firebase sync failed:", err);
    }
    // Open WhatsApp with pre-filled message
    const msg = encodeURIComponent(
      `Hi Makaan Infra! My name is ${form.name}.\nPhone: ${form.phone}\nEmail: ${form.email}\nMessage: ${form.message || "I'd like to get more information."}`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
    toast({ title: "Redirecting to WhatsApp! We'll get back to you soon." });
    setForm({ name: "", phone: "", email: "", message: "" });
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-gold-metallic"><Loader2 className="animate-spin mr-2" /> Loading Makaan Infra...</div>;
  }

  const phone = contactData.details?.phone || defaultContact.details.phone;
  const email = contactData.details?.email || defaultContact.details.email;
  const rawPhone = phone.replace(/\s+/g, "");
  const waPhone = rawPhone.startsWith("+") ? rawPhone.substring(1) : rawPhone;

  return (
    <div className="pt-20">
      <section className="relative py-24 px-4 overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <img 
            src={(contactData.hero?.image) || defaultContact.hero.image} 
            alt="Contact" 
            className="w-full h-full object-cover scale-105 transition-transform duration-1000 group-hover:scale-100 opacity-40"
          />
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gold-metallic" />
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <motion.h1 className="font-heading font-extrabold text-5xl md:text-7xl text-white mb-6 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {(contactData.hero?.heading || defaultContact.hero.heading).includes(" ") ? (
              <>
                {(contactData.hero?.heading || defaultContact.hero.heading).split(" ").slice(0, -1).join(" ")} <span className="text-gold-metallic">{(contactData.hero?.heading || defaultContact.hero.heading).split(" ").slice(-1)}</span>
              </>
            ) : (
              <span className="text-gold-metallic">{(contactData.hero?.heading || defaultContact.hero.heading)}</span>
            )}
          </motion.h1>
          <motion.p className="text-white/90 font-medium max-w-2xl mx-auto text-xl leading-relaxed text-shadow-strong"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          >
            {contactData.hero?.subtext || defaultContact.hero.subtext}
          </motion.p>
          {/* Quick WhatsApp CTA */}
          <motion.div className="mt-8 flex flex-wrap gap-4 justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <a
              href={`https://wa.me/${waPhone}?text=Hi%20Makaan%20Infra%2C%20I%27d%20like%20to%20discuss%20a%20project.`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-heading font-black px-8 py-4 rounded-2xl hover:brightness-110 transition-all shadow-lg"
            >
              <MessageCircle size={20} /> WhatsApp Us Directly
            </a>
            <a href={`tel:${rawPhone}`}
              className="inline-flex items-center gap-2 bg-gold-metallic text-black font-heading font-black px-8 py-4 rounded-2xl hover:brightness-110 transition-all shadow-gold"
            >
              <Phone size={20} /> {phone}
            </a>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 bg-black border-y border-gold-metallic/20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            <div className="space-y-6 sm:space-y-10">
              <div className="space-y-4">
                <span className="text-gold-metallic font-heading font-black text-xs tracking-[0.4em] uppercase">DIRECT CHANNELS</span>
                <h2 className="font-heading font-black text-4xl md:text-5xl text-white uppercase tracking-tighter">Reach The <span className="text-gold-metallic">Masters</span></h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: MapPin, label: "LOCATION", value: contactData.details?.address || defaultContact.details.address, href: `https://maps.google.com/?q=Super+Market+Bargarh+Odisha` },
                  { icon: Phone, label: "CALL US", value: phone, href: `tel:${rawPhone}` },
                  { icon: Mail, label: "EMAIL", value: email, href: `mailto:${email}` },
                  { icon: Clock, label: "HOURS", value: contactData.details?.hours || defaultContact.details.hours },
                ].map((item) => (
                  <div key={item.label} className="bg-white/5 border border-gold-metallic/10 rounded-2xl p-8 hover:border-gold-metallic/30 transition-all group shadow-gold">
                    <div className="w-12 h-12 rounded-xl bg-gold-metallic/10 flex items-center justify-center mb-6 group-hover:bg-gold-metallic transition-all border border-gold-metallic/20">
                      <item.icon className="text-gold-metallic group-hover:text-black" size={24} />
                    </div>
                    <div>
                      <h3 className="text-[10px] font-black text-gold-metallic uppercase tracking-[0.2em] mb-2 opacity-60">{item.label}</h3>
                      {item.href ? (
                        <a href={item.href} target={item.label === "LOCATION" ? "_blank" : undefined} rel="noopener noreferrer" className="text-sm text-white font-black hover:text-gold-metallic transition-colors leading-relaxed block">{item.value}</a>
                      ) : (
                        <p className="text-sm text-white font-black leading-relaxed">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp Direct Block */}
              <div className="bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center">
                    <MessageCircle className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-white text-lg">WhatsApp Us</h3>
                    <p className="text-white/50 text-xs">Fastest response — typically within minutes</p>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${waPhone}?text=Hi%20Makaan%20Infra%2C%20I%27d%20like%20to%20discuss%20my%20construction%20project.`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-heading font-black py-4 rounded-xl hover:brightness-110 transition-all"
                >
                  <MessageCircle size={18} /> Chat on WhatsApp: +{waPhone}
                </a>
              </div>

              {/* Book Appointment CTA */}
              <div className="bg-gold-metallic/10 border border-gold-metallic/30 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gold-metallic flex items-center justify-center">
                    <CalendarCheck className="text-black" size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-white text-lg">Book an Appointment</h3>
                    <p className="text-white/50 text-xs">Schedule a site visit or consultation</p>
                  </div>
                </div>
                <Link
                  to="/appointment"
                  className="w-full flex items-center justify-center gap-2 bg-gold-metallic text-black font-heading font-black py-4 rounded-xl hover:brightness-110 transition-all"
                >
                  <CalendarCheck size={18} /> Book Now
                </Link>
              </div>

              {/* Contact Form */}
              <div className="bg-white/5 border border-gold-metallic/20 rounded-3xl p-10 shadow-gold relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-metallic/5 rounded-full blur-3xl group-hover:bg-gold-metallic/10 transition-colors" />
                <h3 className="font-heading font-black text-2xl text-white mb-2 uppercase tracking-widest flex items-center gap-4">
                  Send a Message
                  <div className="h-0.5 flex-1 bg-gold-metallic/20" />
                </h3>
                <p className="text-white/40 text-xs mb-8">Fill the form below — we'll connect via WhatsApp instantly.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your Name *" className="bg-black/40 border-gold-metallic/10 text-white placeholder:text-white/20 h-14 rounded-xl font-black uppercase text-xs tracking-widest focus:border-gold-metallic/50" />
                    <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone / WhatsApp *" className="bg-black/40 border-gold-metallic/10 text-white placeholder:text-white/20 h-14 rounded-xl font-black uppercase text-xs tracking-widest focus:border-gold-metallic/50" />
                  </div>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email Address" className="bg-black/40 border-gold-metallic/10 text-white placeholder:text-white/20 h-14 rounded-xl font-black uppercase text-xs tracking-widest focus:border-gold-metallic/50" />
                  <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Describe your project or requirement..." className="bg-black/40 border-gold-metallic/10 text-white placeholder:text-white/20 min-h-[160px] rounded-xl font-medium p-6 focus:border-gold-metallic/50" />
                  <Button type="submit" className="w-full bg-[#25D366] text-white font-heading font-black py-8 text-sm uppercase tracking-[0.3em] rounded-xl hover:brightness-110 transition-all flex items-center gap-3 justify-center">
                    <MessageCircle size={18} /> Send via WhatsApp
                  </Button>
                </form>
              </div>
            </div>

            <div className="lg:sticky lg:top-32 rounded-3xl overflow-hidden border border-gold-metallic/20 shadow-gold-premium h-[300px] md:h-[500px] lg:h-[600px] grayscale hover:grayscale-0 transition-all duration-1000">
              <iframe
                src={contactData.mapUrl || defaultContact.mapUrl}
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title="Makaan Infra HQ"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
