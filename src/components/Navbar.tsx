import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShieldCheck, MapPin, CalendarCheck, Phone, MessageCircle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";
import { usePageContent } from "@/hooks/usePageContent";

const FALLBACK_NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/projects", label: "Projects" },
  { to: "/calculator", label: "Calculator" },
  { to: "/gallery", label: "Gallery" },
  { to: "/blogs", label: "Blogs" },
  { to: "/career", label: "Career" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const { data: settings } = usePageContent("settings", { logo: "", navLinks: FALLBACK_NAV_LINKS });
  const navLinks = settings.navLinks || FALLBACK_NAV_LINKS;
  const logoUrl = (settings.logo && settings.logo !== "/logo.png" && settings.logo !== "logo.png" && !settings.logo.includes("erasebg-transformed-19"))
    ? settings.logo
    : "https://i.ibb.co/hxVp0VKt/Royal-Developers-Metallic-Emblem.png";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  // Prevent background scroll when mobile menu is active
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10 || open;

      setScrolled(currentScrollPos > 20);
      setVisible(isVisible);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, open]);

  return (
    <motion.nav
      className={`fixed top-0 left-0 w-full z-[10000] py-3 md:py-4 ${open ? 'bg-[#0b0c10] rounded-b-none' : 'bg-[#0a0a0a] backdrop-blur-xl rounded-b-[24px] md:rounded-b-[35px]'} border-b border-gold-metallic/20 shadow-2xl transition-all duration-300`}
      initial={{ y: -100 }}
      animate={{ y: visible ? 0 : -120 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex items-center justify-between px-4 lg:px-8">
        <Link to="/" className="flex items-center group">
          <motion.div 
            className="relative flex items-center"
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <img
              src={logoUrl}
              alt="Royal Developers"
              className="h-12 sm:h-14 md:h-16 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative text-xs font-black px-4 py-2 transition-all duration-500 group tracking-[0.2em] uppercase drop-shadow-md text-gold-solid ${
                location.pathname === link.to
                  ? "scale-105"
                  : "hover:scale-105 hover:brightness-125"
              }`}
            >
              <motion.span
                className="relative z-10 block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.label}
              </motion.span>
              <span className={`absolute bottom-0 left-4 h-0.5 bg-white transition-all duration-300 transform origin-left ${
                location.pathname === link.to ? "w-[calc(100%-2rem)] scale-x-100" : "w-[calc(100%-2rem)] scale-x-0 group-hover:scale-x-100"
              }`} />
            </Link>
          ))}
          <div className="flex items-center gap-2 ml-2 px-3 py-1.5 rounded-full border border-gold-metallic/20 bg-gold-metallic/5">
            <MapPin size={11} className="text-gold-metallic" />
            <span className="text-[10px] font-black text-gold-metallic/80 uppercase tracking-widest">Bargarh, Odisha</span>
          </div>
          <Link
            to="/appointment"
            className="ml-2 flex items-center gap-2 bg-gold-metallic text-black font-heading font-black text-xs px-5 py-2.5 rounded-xl hover:brightness-110 transition-all shadow-gold uppercase tracking-widest"
          >
            <CalendarCheck size={14} />
            Book Appointment
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="lg:hidden p-2.5 sm:p-3 rounded-xl transition-all duration-300 bg-white/5 border border-gold-metallic/20 text-gold-metallic hover:bg-gold-metallic hover:text-black shadow-gold"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </motion.button>
      </div>

      {/* Full-Height Mobile Menu Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ backgroundColor: "#0b0c10" }}
            className="lg:hidden fixed inset-x-0 top-[64px] sm:top-[72px] bottom-0 h-[calc(100dvh-64px)] sm:h-[calc(100dvh-72px)] bg-[#0b0c10] border-t border-gold-metallic/20 overflow-y-auto flex flex-col justify-between shadow-2xl px-5 py-6 z-[10001]"
          >
            {/* Navigation Links with increased sizing & presence */}
            <div className="flex flex-col gap-2 pt-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between px-5 py-3.5 rounded-2xl text-sm sm:text-base font-heading font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                      isActive
                        ? "text-black bg-gold-metallic shadow-gold scale-[1.01]"
                        : "text-white/90 hover:text-gold-metallic bg-white/[0.04] border border-white/5 hover:border-gold-metallic/30"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive ? (
                      <ShieldCheck size={18} className="text-black" />
                    ) : (
                      <ChevronRight size={16} className="text-white/30 group-hover:text-gold-metallic" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Bottom Section: Actions & Contact (Utilizing Device Height) */}
            <div className="pt-6 pb-4 mt-6 border-t border-white/10 space-y-4">
              <Link
                to="/appointment"
                onClick={() => setOpen(false)}
                className="w-full py-4 rounded-xl bg-gold-metallic text-black font-heading font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-gold hover:brightness-110 transition-all"
              >
                <CalendarCheck size={16} />
                Book Appointment
              </Link>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href="tel:+918926277881"
                  className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-wider hover:border-gold-metallic hover:text-gold-metallic transition-all"
                >
                  <Phone size={14} className="text-gold-metallic" />
                  Call Us
                </a>
                <a
                  href="https://wa.me/918926277881"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] font-black text-xs uppercase tracking-wider hover:bg-[#25D366] hover:text-white transition-all"
                >
                  <MessageCircle size={14} />
                  WhatsApp
                </a>
              </div>

              <div className="text-center pt-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-metallic/20 bg-gold-metallic/5">
                  <MapPin size={11} className="text-gold-metallic" />
                  <span className="text-[10px] font-black text-gold-metallic/90 uppercase tracking-widest">Bargarh, Odisha • Est. 2020</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
