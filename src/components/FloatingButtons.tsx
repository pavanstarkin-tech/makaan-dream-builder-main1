import { useState, useEffect } from "react";
import { Phone, ChevronUp, CalendarCheck, MessageCircle, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageContent } from "@/hooks/usePageContent";
import { Link } from "react-router-dom";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const FloatingButtons = () => {
  const [showScroll, setShowScroll] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { data: contactData } = usePageContent("settings", { contactPhone: "+91 89262 77881" });

  const phone = contactData.contactPhone || contactData.phone || "+91 89262 77881";
  const rawPhone = phone.replace(/\s+/g, "");
  const waPhone = rawPhone.startsWith("+") ? rawPhone.substring(1) : (rawPhone.startsWith("91") ? rawPhone : `91${rawPhone}`);

  useEffect(() => {
    const checkScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Backdrop overlay on mobile when FAB speed-dial is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9990] sm:hidden"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-[9999] flex flex-col items-end gap-3 pointer-events-auto">
        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScroll && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 15 }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToTop}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-black/90 backdrop-blur-md border border-gold-metallic/40 flex items-center justify-center text-gold-metallic shadow-gold hover:bg-gold-metallic hover:text-black transition-all duration-300 group"
              aria-label="Scroll to top"
              title="Back to Top"
            >
              <ChevronUp size={22} className="group-hover:-translate-y-0.5 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Speed-Dial Expanded Actions */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2, staggerChildren: 0.05 }}
              className="flex flex-col items-end gap-3 mb-1"
            >
              {/* Action 1: Book Appointment */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-3 group"
              >
                <span className="px-3 py-1.5 rounded-xl bg-black/90 border border-gold-metallic/30 text-white text-[11px] font-heading font-black tracking-wider uppercase shadow-xl backdrop-blur-md pointer-events-none group-hover:border-gold-metallic group-hover:text-gold-metallic transition-colors">
                  Book Appointment
                </span>
                <Link
                  to="/appointment"
                  onClick={() => setIsOpen(false)}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-metallic to-[#9E822B] flex items-center justify-center text-black shadow-gold hover:scale-110 active:scale-95 transition-all"
                  aria-label="Book Appointment"
                >
                  <CalendarCheck size={20} className="stroke-[2.5]" />
                </Link>
              </motion.div>

              {/* Action 2: WhatsApp Chat */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                transition={{ duration: 0.15, delay: 0.03 }}
                className="flex items-center gap-3 group"
              >
                <span className="px-3 py-1.5 rounded-xl bg-black/90 border border-[#25D366]/40 text-white text-[11px] font-heading font-black tracking-wider uppercase shadow-xl backdrop-blur-md pointer-events-none group-hover:border-[#25D366] group-hover:text-[#25D366] transition-colors">
                  WhatsApp Support
                </span>
                <a
                  href={`https://wa.me/${waPhone}?text=Hi%20Royal%20Developers%20Raj%20Lakshman%2C%20I%20am%20interested%20in%20your%20services.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="w-12 h-12 rounded-2xl bg-[#25D366] flex items-center justify-center text-white shadow-lg shadow-[#25D366]/30 hover:scale-110 active:scale-95 transition-all"
                  aria-label="Chat on WhatsApp"
                >
                  <WhatsAppIcon />
                </a>
              </motion.div>

              {/* Action 3: Instant Call */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                transition={{ duration: 0.15, delay: 0.06 }}
                className="flex items-center gap-3 group"
              >
                <span className="px-3 py-1.5 rounded-xl bg-black/90 border border-gold-metallic/30 text-white text-[11px] font-heading font-black tracking-wider uppercase shadow-xl backdrop-blur-md pointer-events-none group-hover:border-gold-metallic group-hover:text-gold-metallic transition-colors">
                  Direct Call
                </span>
                <a
                  href={`tel:${rawPhone}`}
                  onClick={() => setIsOpen(false)}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-metallic to-[#B89635] flex items-center justify-center text-black shadow-gold hover:scale-110 active:scale-95 transition-all"
                  aria-label="Call Royal Developers"
                >
                  <Phone size={20} className="stroke-[2.5]" />
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Master Interactive FAB Trigger */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-14 h-14 sm:w-15 sm:h-15 rounded-2xl flex items-center justify-center shadow-gold-premium transition-all duration-300 ${
            isOpen
              ? "bg-black border-2 border-gold-metallic text-gold-metallic rotate-90"
              : "bg-gold-metallic text-black hover:brightness-110 animate-shine"
          }`}
          aria-label={isOpen ? "Close Actions Menu" : "Open Quick Contact Actions"}
          title={isOpen ? "Close" : "Connect with Royal Developers"}
        >
          {/* Subtle outer pulse effect when collapsed */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-2xl bg-gold-metallic/30 animate-ping opacity-60 pointer-events-none" />
          )}

          {isOpen ? (
            <X size={26} className="transition-transform duration-300" />
          ) : (
            <div className="relative flex items-center justify-center">
              <MessageCircle size={26} className="stroke-[2.2]" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black animate-pulse" />
            </div>
          )}
        </motion.button>
      </div>
    </>
  );
};

export default FloatingButtons;
