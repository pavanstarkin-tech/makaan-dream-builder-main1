import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShieldCheck, MapPin, CalendarCheck } from "lucide-react";
import { motion } from "framer-motion";
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
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const { data: settings } = usePageContent("settings", { logo: "", navLinks: FALLBACK_NAV_LINKS });
  const navLinks = settings.navLinks || FALLBACK_NAV_LINKS;
  const logoUrl = (settings.logo && settings.logo !== "/logo.png" && settings.logo !== "logo.png")
    ? settings.logo
    : "https://i.ibb.co/ZzLkP7t7/erasebg-transformed-19.png";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      // Show if scrolling up, or if at the top, or if mobile menu is open
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
      className={`fixed top-0 left-0 w-full z-[10000] py-4 bg-[#0a0a0a] border-b border-gold-metallic/20 shadow-2xl transition-all duration-300 rounded-b-[35px]`}
      initial={{ y: -100 }}
      animate={{ y: visible ? 0 : -120 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex items-center justify-between px-4 lg:px-8">
        <Link to="/" className="flex items-center group">
          <motion.div 
            className="relative flex items-center"
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <img
              src={logoUrl}
              alt="Makaan Infra"
              className="h-14 md:h-18 w-auto object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative text-xs font-black px-4 py-2 transition-all duration-500 group tracking-[0.2em] uppercase drop-shadow-md text-gold-solid ${location.pathname === link.to
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
              <span className={`absolute bottom-0 left-4 h-0.5 bg-white transition-all duration-300 transform origin-left ${location.pathname === link.to ? "w-[calc(100%-2rem)] scale-x-100" : "w-[calc(100%-2rem)] scale-x-0 group-hover:scale-x-100"
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

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="lg:hidden p-3 rounded-xl transition-all duration-300 bg-white/5 border border-gold-metallic/20 text-gold-metallic hover:bg-gold-metallic hover:text-black shadow-gold"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={open ? "open" : "closed"}
        variants={{
          open: { height: "auto", opacity: 1, display: "block" },
          closed: { height: 0, opacity: 0, transitionEnd: { display: "none" } }
        }}
        className="lg:hidden bg-black/95 backdrop-blur-2xl border-t border-gold-metallic/10 overflow-hidden shadow-2xl"
      >
        <div className="container mx-auto py-8 px-6 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between px-6 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.3em] transition-all duration-500 ${location.pathname === link.to
                  ? "text-black bg-gold-metallic shadow-gold"
                  : "text-white/60 hover:text-gold-metallic hover:bg-white/5"
                }`}
            >
              {link.label}
              <ShieldCheck size={14} className={location.pathname === link.to ? "opacity-100" : "opacity-0"} />
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
