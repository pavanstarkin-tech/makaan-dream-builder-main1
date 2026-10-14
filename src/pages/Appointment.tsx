import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Phone, User, Clock, Building2, Loader2, CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const WA_NUMBER = "918926277881";

const PROJECT_TYPES = [
  "Residential Home",
  "Commercial Building",
  "Industrial Project",
  "Renovation / Retrofitting",
  "Structural Consultancy",
  "Interior Finishing",
  "Land & Layout Planning",
  "Other",
];

const TIME_SLOTS = [
  "9:00 AM – 10:00 AM",
  "10:00 AM – 11:00 AM",
  "11:00 AM – 12:00 PM",
  "12:00 PM – 1:00 PM",
  "2:00 PM – 3:00 PM",
  "3:00 PM – 4:00 PM",
  "4:00 PM – 5:00 PM",
  "5:00 PM – 6:00 PM",
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Appointment = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    projectType: "",
    notes: "",
  });

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.date || !form.time || !form.projectType) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { doc, getDoc, setDoc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");
      const ref = doc(db, "appointments", "all_appointments");
      const snapshot = await getDoc(ref);
      const current = snapshot.exists() ? snapshot.data().items || [] : [];
      await setDoc(ref, { items: [...current, { ...form, type: "appointment", status: "pending", date_created: new Date().toISOString() }] });
    } catch (err) {
      console.error("Firebase sync failed:", err);
    }

    // Open WhatsApp with appointment details
    const msg = encodeURIComponent(
      `Hi Makaan Infra! I'd like to book an appointment.\n\n` +
      `👤 Name: ${form.name}\n` +
      `📞 Phone: ${form.phone}\n` +
      `📅 Date: ${form.date}\n` +
      `⏰ Time: ${form.time}\n` +
      `🏗️ Project Type: ${form.projectType}\n` +
      `📝 Notes: ${form.notes || "None"}\n\n` +
      `Please confirm my appointment. Thank you!`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, "_blank");
    setSubmitted(true);
    setSubmitting(false);
    toast({ title: "Appointment request sent via WhatsApp!" });
  };

  return (
    <div className="pt-20 min-h-screen bg-black">
      {/* Hero */}
      <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-black via-[#0d0d0d] to-black border-b border-gold-metallic/20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold-metallic/5 blur-[120px]" />
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full border border-gold-metallic/30 bg-gold-metallic/10"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <CalendarCheck size={14} className="text-gold-metallic" />
            <span className="text-gold-metallic text-xs font-black uppercase tracking-[0.3em]">Book an Appointment</span>
          </motion.div>
          <motion.h1
            className="font-heading font-black text-5xl md:text-7xl text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          >
            Schedule a <span className="text-gold-metallic">Consultation</span>
          </motion.h1>
          <motion.p
            className="text-white/70 max-w-xl mx-auto text-lg leading-relaxed"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          >
            Book a site visit or project consultation with our structural engineers. We'll confirm within 30 minutes on WhatsApp.
          </motion.p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Info Cards — 2-col on small mobile, full-width on lg */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {[
                { icon: Clock, title: "Working Hours", desc: "Mon – Sat\n9:00 AM – 7:00 PM" },
                { icon: Phone, title: "Call Directly", desc: "+91 89262 77881" },
                { icon: MessageCircle, title: "WhatsApp", desc: "Fastest response guaranteed" },
                { icon: Building2, title: "Office Address", desc: "Shop No-175, Super Market,\nBargarh, Odisha – 768028" },
              ].map((item, i) => (
                <motion.div key={i}
                  className="bg-white/5 border border-gold-metallic/15 rounded-2xl p-6 group hover:border-gold-metallic/40 transition-all"
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                >
                  <div className="w-10 h-10 rounded-xl bg-gold-metallic/10 border border-gold-metallic/20 flex items-center justify-center mb-4 group-hover:bg-gold-metallic transition-all">
                    <item.icon className="text-gold-metallic group-hover:text-black transition-colors" size={18} />
                  </div>
                  <h4 className="font-heading font-black text-sm text-white uppercase tracking-wider mb-1">{item.title}</h4>
                  <p className="text-white/50 text-xs leading-relaxed whitespace-pre-line">{item.desc}</p>
                </motion.div>
              ))}

              <div className="col-span-2 sm:col-span-2 lg:col-span-1 bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl p-6">
                <p className="text-white/60 text-xs mb-3 font-bold uppercase tracking-widest">Prefer to chat directly?</p>
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=Hi%2C%20I%27d%20like%20to%20book%20an%20appointment%20with%20Makaan%20Infra.`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#25D366] text-white font-heading font-black px-5 py-3 rounded-xl hover:brightness-110 transition-all text-sm justify-center"
                >
                  <MessageCircle size={16} /> Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/5 border border-gold-metallic/30 rounded-3xl p-16 text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-gold-metallic/10 border border-gold-metallic flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="text-gold-metallic" size={48} />
                  </div>
                  <h2 className="font-heading font-black text-3xl text-white uppercase tracking-tight mb-4">Appointment Requested!</h2>
                  <p className="text-white/50 text-sm mb-8 leading-relaxed">Your booking has been sent on WhatsApp. Our team will confirm within 30 minutes during working hours.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", date: "", time: "", projectType: "", notes: "" }); }}
                    className="text-gold-metallic font-black text-sm uppercase tracking-widest hover:text-white transition-colors"
                  >
                    Book Another Appointment
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-gold-metallic/20 rounded-3xl p-8 md:p-12 shadow-gold"
                >
                  <h2 className="font-heading font-black text-2xl text-white uppercase tracking-tight mb-2">Appointment Details</h2>
                  <p className="text-white/40 text-xs mb-8 uppercase tracking-widest">All fields marked * are required</p>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name & Phone */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-black text-gold-metallic uppercase tracking-widest mb-2 flex items-center gap-1"><User size={12} /> Full Name *</label>
                        <Input
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Your full name"
                          className="bg-black/40 border-gold-metallic/20 text-white placeholder:text-white/20 h-12 rounded-xl font-bold focus:border-gold-metallic/50"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black text-gold-metallic uppercase tracking-widest mb-2 flex items-center gap-1"><Phone size={12} /> WhatsApp Number *</label>
                        <Input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+91 XXXXX XXXXX"
                          className="bg-black/40 border-gold-metallic/20 text-white placeholder:text-white/20 h-12 rounded-xl font-bold focus:border-gold-metallic/50"
                        />
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-black text-gold-metallic uppercase tracking-widest mb-2 flex items-center gap-1"><CalendarCheck size={12} /> Preferred Date *</label>
                        <Input
                          type="date"
                          min={today}
                          value={form.date}
                          onChange={(e) => setForm({ ...form, date: e.target.value })}
                          className="bg-black/40 border-gold-metallic/20 text-white h-12 rounded-xl font-bold focus:border-gold-metallic/50"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black text-gold-metallic uppercase tracking-widest mb-2 flex items-center gap-1"><Clock size={12} /> Preferred Time *</label>
                        <select
                          value={form.time}
                          onChange={(e) => setForm({ ...form, time: e.target.value })}
                          className="w-full bg-black/40 border border-gold-metallic/20 text-white h-12 rounded-xl font-bold px-3 focus:border-gold-metallic/50 focus:outline-none"
                        >
                          <option value="">Select a time slot</option>
                          {TIME_SLOTS.map((slot) => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Project Type */}
                    <div>
                      <label className="text-xs font-black text-gold-metallic uppercase tracking-widest mb-3 flex items-center gap-1"><Building2 size={12} /> Project Type *</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {PROJECT_TYPES.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setForm({ ...form, projectType: type })}
                            className={`py-2.5 px-3 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all border text-center ${
                              form.projectType === type
                                ? "bg-gold-metallic text-black border-gold-metallic shadow-gold"
                                : "bg-white/5 text-white/60 border-white/10 hover:border-gold-metallic/40 hover:text-white"
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="text-xs font-black text-gold-metallic uppercase tracking-widest mb-2 block">Additional Notes (optional)</label>
                      <textarea
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        placeholder="Describe your project, location, or any specific requirements..."
                        className="w-full bg-black/40 border border-gold-metallic/20 text-white placeholder:text-white/20 min-h-[120px] rounded-xl font-medium p-4 focus:border-gold-metallic/50 focus:outline-none resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-gold-metallic text-black font-heading font-black py-8 text-sm uppercase tracking-[0.3em] rounded-xl shadow-gold hover:brightness-110 transition-all animate-shine flex items-center gap-3 justify-center"
                    >
                      {submitting ? <Loader2 className="animate-spin" size={18} /> : <CalendarCheck size={18} />}
                      {submitting ? "Booking..." : "Book Appointment via WhatsApp"}
                    </Button>
                    <p className="text-center text-[10px] text-white/30 font-black uppercase tracking-[0.3em]">
                      Confirmation via WhatsApp • Mon–Sat 9AM–7PM • Free Consultation
                    </p>
                  </form>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Appointment;
