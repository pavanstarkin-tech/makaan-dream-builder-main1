import { useState, useEffect } from "react";
import { ChevronUp, X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageContent } from "@/hooks/usePageContent";
import { Link } from "react-router-dom";

// Crisp Graphic Picture: Booking Calendar
const CalendarPicture = () => (
  <svg viewBox="0 0 36 36" className="w-6 h-6 drop-shadow-md shrink-0">
    <rect x="4" y="7" width="28" height="25" rx="6" fill="#FFFFFF" />
    <path d="M4 13C4 9.686 6.686 7 10 7H26C29.314 7 32 9.686 32 13V14H4V13Z" fill="#DC2626" />
    <rect x="9" y="3" width="3" height="6" rx="1.5" fill="#1E293B" />
    <rect x="24" y="3" width="3" height="6" rx="1.5" fill="#1E293B" />
    <circle cx="11" cy="19" r="1.5" fill="#94A3B8" />
    <circle cx="18" cy="19" r="1.5" fill="#94A3B8" />
    <circle cx="25" cy="19" r="1.5" fill="#94A3B8" />
    <path d="M12 25L16 28L24 22" stroke="#16A34A" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

// Crisp Graphic Picture: WhatsApp Logo
const WhatsAppPicture = () => (
  <svg viewBox="0 0 36 36" className="w-6 h-6 drop-shadow-md shrink-0">
    <circle cx="18" cy="18" r="17" fill="#25D366" />
    <path
      fill="#FFFFFF"
      d="M18 6C11.373 6 6 11.373 6 18c0 2.32.658 4.49 1.796 6.336L6.5 30l5.85-1.536A11.936 11.936 0 0018 30c6.627 0 12-5.373 12-12S24.627 6 18 6zm6.2 16.5c-.26.73-1.52 1.39-2.11 1.48-.57.08-1.3.11-2.1-.15-.48-.16-1.11-.36-1.92-.72-3.39-1.49-5.6-4.93-5.77-5.16-.17-.22-1.38-1.84-1.38-3.51 0-1.67.88-2.49 1.19-2.83.31-.34.68-.42.91-.42.23 0 .46.002.66.012.21.01.5-.08.77.58.28.68.96 2.34 1.04 2.51.08.17.14.37.03.6-.11.22-.17.36-.34.56-.17.2-.35.44-.5.59-.17.17-.35.35-.15.69.2.34.88 1.45 1.89 2.35 1.29 1.15 2.38 1.51 2.72 1.68.34.17.53.14.74-.09.2-.22.85-.99 1.08-1.33.22-.34.46-.28.77-.17.31.11 1.98.93 2.32 1.1.34.17.57.25.65.39.08.14.08.81-.18 1.54z"
    />
  </svg>
);

// Crisp Graphic Picture: Phone Call Handset
const PhoneCallPicture = () => (
  <svg viewBox="0 0 36 36" className="w-6 h-6 drop-shadow-md shrink-0">
    <circle cx="18" cy="18" r="17" fill="#2563EB" />
    <path
      fill="#FFFFFF"
      d="M25.2 21.8l-3.3-1.4c-.7-.3-1.5-.1-2 .4l-1.4 1.8c-2.5-1.3-4.5-3.3-5.8-5.8l1.8-1.4c.5-.5.7-1.3.4-2l-1.4-3.3c-.3-.7-1.1-1.2-1.9-1.2H8.8c-1 0-1.9.9-1.8 1.9.8 7 4.7 13.1 10.5 16.5 2 1.1 4.1 1.9 6.3 2.1 1 .1 1.9-.8 1.9-1.8v-2.8c0-.9-.5-1.6-1.3-1.9l-.8-.4z"
    />
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9990] sm:hidden"
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
              style={{
                backgroundColor: "#0b0c10",
                border: "1.5px solid rgba(212, 175, 55, 0.5)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.7)"
              }}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300 group"
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
                <span
                  style={{
                    backgroundColor: "#0b0c10",
                    border: "1px solid rgba(212, 175, 55, 0.4)",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.8)"
                  }}
                  className="px-3 py-1.5 rounded-xl text-white text-[11px] font-heading font-black tracking-wider uppercase backdrop-blur-md pointer-events-none group-hover:border-[#D4AF37] group-hover:text-[#D4AF37] transition-colors"
                >
                  Book Appointment
                </span>
                <Link
                  to="/appointment"
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: "linear-gradient(135deg, #FFDF00 0%, #D4AF37 50%, #996515 100%)",
                    boxShadow: "0 4px 18px rgba(212, 175, 55, 0.6)"
                  }}
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all p-2.5"
                  aria-label="Book Appointment"
                >
                  <CalendarPicture />
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
                <span
                  style={{
                    backgroundColor: "#0b0c10",
                    border: "1px solid rgba(37, 211, 102, 0.5)",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.8)"
                  }}
                  className="px-3 py-1.5 rounded-xl text-white text-[11px] font-heading font-black tracking-wider uppercase backdrop-blur-md pointer-events-none group-hover:border-[#25D366] group-hover:text-[#25D366] transition-colors"
                >
                  WhatsApp Support
                </span>
                <a
                  href={`https://wa.me/${waPhone}?text=Hi%20Royal%20Developers%20Raj%20Lakshman%2C%20I%20am%20interested%20in%20your%20services.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  style={{
                    backgroundColor: "#25D366",
                    boxShadow: "0 4px 18px rgba(37, 211, 102, 0.6)"
                  }}
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all p-2.5"
                  aria-label="Chat on WhatsApp"
                >
                  <WhatsAppPicture />
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
                <span
                  style={{
                    backgroundColor: "#0b0c10",
                    border: "1px solid rgba(59, 130, 246, 0.5)",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.8)"
                  }}
                  className="px-3 py-1.5 rounded-xl text-white text-[11px] font-heading font-black tracking-wider uppercase backdrop-blur-md pointer-events-none group-hover:border-[#3B82F6] group-hover:text-[#3B82F6] transition-colors"
                >
                  Direct Call
                </span>
                <a
                  href={`tel:${rawPhone}`}
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
                    boxShadow: "0 4px 18px rgba(59, 130, 246, 0.6)"
                  }}
                  className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all p-2.5"
                  aria-label="Call Royal Developers"
                >
                  <PhoneCallPicture />
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
          style={
            isOpen
              ? {
                  backgroundColor: "#0b0c10",
                  border: "2px solid #D4AF37",
                  boxShadow: "0 4px 25px rgba(212, 175, 55, 0.5)"
                }
              : {
                  background: "linear-gradient(135deg, #FFDF00 0%, #D4AF37 50%, #AA771C 100%)",
                  boxShadow: "0 4px 25px rgba(212, 175, 55, 0.6)"
                }
          }
          className="relative w-14 h-14 sm:w-15 sm:h-15 rounded-2xl flex items-center justify-center transition-all duration-300"
          aria-label={isOpen ? "Close Actions Menu" : "Open Quick Contact Actions"}
          title={isOpen ? "Close" : "Connect with Royal Developers"}
        >
          {/* Subtle outer pulse effect when collapsed */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-2xl bg-[#D4AF37]/40 animate-ping opacity-60 pointer-events-none" />
          )}

          {isOpen ? (
            <X size={26} className="text-[#D4AF37] transition-transform duration-300" />
          ) : (
            <div className="relative flex items-center justify-center">
              <MessageCircle size={26} className="text-black fill-black/15 stroke-[2.4]" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black animate-pulse" />
            </div>
          )}
        </motion.button>
      </div>
    </>
  );
};

export default FloatingButtons;
