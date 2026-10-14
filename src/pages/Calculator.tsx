import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import CostCalculator from "@/components/CostCalculator";
import { usePageContent } from "@/hooks/usePageContent";
import { defaultData } from "@/lib/defaults";

const defaultCalculator = defaultData.calculator;

const Calculator = () => {
  const { data: calcData, loading } = usePageContent("calculator", defaultCalculator);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-gold-metallic"><Loader2 className="animate-spin mr-2" /> Loading Makaan Infra...</div>;
  }

  return (
    <div className="pt-20">
      <section className="relative py-24 px-4 overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <img 
            src={calcData.hero?.image || defaultCalculator.hero.image} 
            alt="Calculator" 
            className="w-full h-full object-cover scale-105 transition-transform duration-1000 group-hover:scale-100 opacity-40"
          />
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gold-metallic" />
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <motion.h1 className="font-heading font-extrabold text-5xl md:text-7xl text-white mb-6 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            {(calcData.hero?.heading || defaultCalculator.hero.heading).includes(" ") ? (
              <>
                {(calcData.hero?.heading || defaultCalculator.hero.heading).split(" ").slice(0, -1).join(" ")} <span className="text-gold-metallic">{(calcData.hero?.heading || defaultCalculator.hero.heading).split(" ").slice(-1)}</span>
              </>
            ) : (
              <span className="text-gold-metallic">{(calcData.hero?.heading || defaultCalculator.hero.heading)}</span>
            )}
          </motion.h1>
          <motion.p className="text-white/90 font-medium max-w-2xl mx-auto text-xl leading-relaxed text-shadow-strong"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          >
            {calcData.hero?.subtext || defaultCalculator.hero.subtext}
          </motion.p>
        </div>
      </section>

      <section className="py-24 px-4 bg-black border-y border-gold-metallic/20">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white/5 border border-gold-metallic/20 rounded-3xl p-3 sm:p-6 md:p-10 shadow-gold relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-metallic/5 rounded-full blur-[100px]" />
            <CostCalculator />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Calculator;
