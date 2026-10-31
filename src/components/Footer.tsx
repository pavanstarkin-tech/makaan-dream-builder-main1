import { Link } from "react-router-dom";
import { Phone, MapPin, Mail, ArrowRight, Loader2, ShieldCheck, MessageCircle, CalendarCheck } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";

const defaultSettings = {
  address: "Shop No-175, Super Market, Bargarh, Odisha - 768028",
  phone: "+91 89262 77881",
  email: "info@royaldevelopers.com",
};

const Footer = () => {
  const { data: contactData, loading } = usePageContent("settings", defaultSettings);
  const phone = contactData.phone || defaultSettings.phone;
  const email = contactData.email || defaultSettings.email;
  const address = contactData.address || defaultSettings.address;
  const rawPhone = phone.replace(/\s+/g, "");
  const waPhone = rawPhone.startsWith("+") ? rawPhone.substring(1) : rawPhone;

  return (
    <footer className="bg-black text-white border-t border-gold-metallic/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gold-metallic" />
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <h3 className="font-heading font-black text-2xl sm:text-3xl mb-2 tracking-widest text-white uppercase">ROYAL DEVELOPERS <span className="text-gold-metallic">RAJ LAKSHMAN</span></h3>
            <p className="text-gold-metallic font-black text-sm tracking-[0.2em] uppercase mb-5">Plan Better. Build Better.</p>
            <p className="text-white/70 text-sm leading-relaxed mb-8 font-medium">
              Royal Developers Raj Lakshman — Odisha's trusted civil engineering and infrastructure partner for developers, builders, and homeowners. Quality construction since 2020.
            </p>
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gold-metallic/10 border border-gold-metallic/30">
              <span className="w-2.5 h-2.5 rounded-full bg-gold-metallic animate-pulse shadow-gold" />
              <p className="text-gold-metallic text-xs font-black uppercase tracking-[0.2em]">Est. 2020 • Bargarh, Odisha</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-black text-lg mb-8 text-gold-metallic uppercase tracking-widest">Quick Links</h4>
            <div className="flex flex-col gap-3">
              {["About Us", "Services", "Projects", "Gallery", "Blogs", "Contact"].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase().replace(" ", "-").replace("about-us", "about")}`}
                  className="text-sm text-white/70 hover:text-gold-metallic hover:translate-x-2 transition-all duration-300 flex items-center gap-3 group font-bold"
                >
                  <ArrowRight size={16} className="text-gold-metallic/40 group-hover:text-gold-metallic transition-colors" />
                  {item}
                </Link>
              ))}
              <Link
                to="/appointment"
                className="text-sm text-gold-metallic hover:brightness-110 hover:translate-x-2 transition-all duration-300 flex items-center gap-3 group font-black"
              >
                <CalendarCheck size={16} className="text-gold-metallic" />
                Book Appointment
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-black text-lg mb-8 text-gold-metallic uppercase tracking-widest">Services</h4>
            <div className="flex flex-col gap-3">
              {["Civil Construction", "Building Planning", "Structural Consulting", "Electrical & Plumbing", "Interior Finishing", "Renovation"].map((s) => (
                <span key={s} className="text-sm text-white/70 hover:text-gold-metallic transition-colors cursor-default font-bold">{s}</span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-black text-lg mb-8 text-gold-metallic uppercase tracking-widest">Contact Us</h4>
            <div className="flex flex-col gap-6 text-sm">
              <a
                href={`https://maps.google.com/?q=Super+Market+Bargarh+Odisha`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-gold-metallic flex items-center justify-center shrink-0 group-hover:bg-white transition-all duration-300 shadow-gold">
                  <MapPin size={24} className="text-black transition-colors" />
                </div>
                {loading ? <Loader2 className="animate-spin text-gold-metallic" /> : (
                  <span className="text-white/80 font-bold leading-relaxed group-hover:text-gold-metallic transition-colors whitespace-pre-line">
                    {address}
                  </span>
                )}
              </a>
              <a href={`tel:${rawPhone}`} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-gold-metallic flex items-center justify-center shrink-0 group-hover:bg-white transition-all duration-300 shadow-gold">
                  <Phone size={24} className="text-black transition-colors" />
                </div>
                {loading ? <Loader2 className="animate-spin text-gold-metallic" /> : (
                  <span className="text-white font-black group-hover:text-gold-metallic transition-colors uppercase tracking-wider">{phone}</span>
                )}
              </a>
              <a href={`https://wa.me/${waPhone}?text=Hi%2C%20I%27m%20interested%20in%20Royal%20Developers%20Raj%20Lakshman%20services.`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center shrink-0 group-hover:bg-white transition-all duration-300 shadow-gold">
                  <MessageCircle size={24} className="text-white group-hover:text-black transition-colors" />
                </div>
                <span className="text-white font-black group-hover:text-gold-metallic transition-colors">WhatsApp Us</span>
              </a>
              <a href={`mailto:${email}`} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-gold-metallic flex items-center justify-center shrink-0 group-hover:bg-white transition-all duration-300 shadow-gold">
                  <Mail size={24} className="text-black transition-colors" />
                </div>
                {loading ? <Loader2 className="animate-spin text-gold-metallic" /> : (
                  <span className="text-white font-bold group-hover:text-gold-metallic transition-colors">{email}</span>
                )}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gold-metallic/10 mt-20 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] text-white/40 font-black uppercase tracking-[0.4em] relative z-20">
          <p>© {new Date().getFullYear()} Royal Developers Raj Lakshman. All rights reserved. • Plan Better. Build Better. • Est. 2020</p>
          <Link 
            to="/admin" 
            className="flex items-center gap-3 px-6 py-2 rounded-full border border-gold-metallic/20 text-gold-metallic/40 hover:text-gold-metallic hover:border-gold-metallic/60 transition-all duration-500 group"
          >
            <ShieldCheck size={14} className="group-hover:rotate-12 transition-transform" />
            <span className="font-bold tracking-[0.2em]">SECURE PORTAL</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};
 
export default Footer;
