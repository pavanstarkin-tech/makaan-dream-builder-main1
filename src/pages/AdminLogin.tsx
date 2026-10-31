import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Eye, EyeOff, Loader2, ArrowRight, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      if (user) {
        sessionStorage.setItem("makaan-admin", "true");
        localStorage.setItem("makaan-admin", "true");
        toast({ title: "Welcome to Royal Developers Admin!" });
        navigate("/admin/dashboard");
      }
    } catch (error: any) {
      console.error("Login Error:", error);
      const msg = error.code === "auth/network-request-failed" 
        ? "Network error. Please check your internet." 
        : error.message || "Login failed.";
      toast({ title: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDirectAccess = () => {
    sessionStorage.setItem("makaan-admin", "true");
    localStorage.setItem("makaan-admin", "true");
    toast({ title: "Welcome to Royal Developers Dashboard!" });
    navigate("/admin/dashboard");
  };

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center px-4 bg-black">
      <motion.div className="w-full max-w-md bg-black border-2 border-gold-metallic/30 rounded-3xl p-8 sm:p-10 shadow-gold-premium"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gold-metallic flex items-center justify-center mx-auto mb-6 shadow-gold">
            <ShieldCheck className="text-black" size={40} />
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white uppercase tracking-widest">Admin Access</h1>
          <p className="text-gold-metallic text-xs font-black mt-2 tracking-[0.2em] uppercase opacity-90">Royal Developers Raj Lakshman</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-black text-white/60 mb-2 block uppercase tracking-widest">Email Address</label>
            <Input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@royaldevelopers.com" 
              className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-14 font-bold rounded-xl" 
            />
          </div>
          <div>
            <label className="text-xs font-black text-white/60 mb-2 block uppercase tracking-widest">Password</label>
            <div className="relative">
              <Input 
                type={showPass ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-14 font-bold rounded-xl pr-12" 
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-gold-metallic transition-colors"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <Button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-gold-metallic text-black font-heading font-black py-7 text-lg rounded-2xl shadow-gold hover:brightness-125 transition-all animate-shine mt-4"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
            {loading ? "AUTHENTICATING..." : "SIGN IN"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-3">
          <p className="text-white/40 text-[10px] uppercase font-black tracking-widest">Direct Access Option</p>
          <Button
            type="button"
            onClick={handleDirectAccess}
            variant="outline"
            className="w-full border-gold-metallic/30 text-gold-metallic hover:bg-gold-metallic hover:text-black font-heading font-black py-6 rounded-xl uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2"
          >
            <KeyRound size={16} />
            Instant Admin Access <ArrowRight size={16} />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
