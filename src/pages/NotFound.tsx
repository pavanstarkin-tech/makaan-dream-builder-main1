import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center bg-black border-2 border-gold-metallic/30 p-12 md:p-20 rounded-[3rem] shadow-gold-premium">
        <h1 className="mb-6 text-8xl font-black text-white drop-shadow-lg">404</h1>
        <p className="mb-10 text-2xl font-bold text-gold-metallic uppercase tracking-widest">Page Not Found</p>
        <a href="/" className="inline-block bg-gold-metallic text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-gold hover:scale-105 transition-all animate-shine">
          Return Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
