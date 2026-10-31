import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { usePageContent } from "@/hooks/usePageContent";

const defaultCalculator = { 
  materials: [
    { label: "Basic", price: 1200 },
    { label: "Premium", price: 1800 },
    { label: "Luxury", price: 2500 },
  ]
};

const CostCalculator = () => {
  const { data: calcData } = usePageContent("calculator", defaultCalculator);
  const materialOptions = calcData.materials || defaultCalculator.materials;
  const [plotSize, setPlotSize] = useState(1000);
  const [floors, setFloors] = useState(1);
  const [materialIdx, setMaterialIdx] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const { toast } = useToast();

  const calculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast({ title: "Please enter your name and phone number", variant: "destructive" });
      return;
    }
    const cost = plotSize * floors * materialOptions[materialIdx].price;
    setResult(cost);
    try {
      const { ref, get, set } = await import("firebase/database");
      const { rtdb, RTDB_ROOT } = await import("@/lib/firebase");
      const leadsRef = ref(rtdb, `${RTDB_ROOT}/website_content/leads`);
      const snapshot = await get(leadsRef);
      const currentLeads = snapshot.exists() ? (snapshot.val()?.items || []) : [];
      const updatedLeads = [...currentLeads, { phone, name, cost, plotSize, floors, material: materialOptions[materialIdx].label, type: "calculator", date: new Date().toISOString() }];
      await set(leadsRef, { items: updatedLeads });
      const rootLeadsRef = ref(rtdb, `${RTDB_ROOT}/leads/all_leads`);
      await set(rootLeadsRef, { items: updatedLeads });
    } catch (err) {
      console.error("Failed to sync lead:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        className="bg-black border border-gold-metallic/30 rounded-3xl p-4 sm:p-6 md:p-10 shadow-gold-premium"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={calculate} className="space-y-5 sm:space-y-8">
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs sm:text-sm font-bold text-white uppercase tracking-widest">Plot Size (sq ft)</label>
              <span className="font-heading font-black text-gold-metallic text-xl sm:text-2xl drop-shadow-md">{plotSize.toLocaleString()}</span>
            </div>
            <input
              type="range" min={500} max={5000} step={100} value={plotSize}
              onChange={(e) => setPlotSize(Number(e.target.value))}
              className="w-full h-3 rounded-full appearance-none cursor-pointer bg-white/10 accent-gold-metallic focus:outline-none"
            />
            <div className="flex justify-between text-xs font-bold text-white/50 mt-2">
              <span>500 SQFT</span><span>5,000 SQFT</span>
            </div>
          </div>

          <div>
            <label className="text-xs sm:text-sm font-bold text-white mb-3 block uppercase tracking-widest">Number of Floors</label>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {[1, 2, 3, 4].map((f) => (
                <button key={f} type="button" onClick={() => setFloors(f)}
                  className={`py-2.5 sm:py-3.5 rounded-xl font-heading font-black text-base sm:text-lg transition-all duration-300 ${
                    floors === f ? "bg-gold-metallic text-black shadow-gold" : "bg-white/5 border border-white/10 text-white hover:border-gold-metallic/50"
                  }`}
                >{f}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs sm:text-sm font-bold text-white mb-3 block uppercase tracking-widest">Material Quality</label>
            {/* Mobile: vertical list — each row shows label + price + selected indicator */}
            <div className="flex flex-col gap-2 sm:hidden">
              {materialOptions.map((m, i) => (
                <button key={m.label} type="button" onClick={() => setMaterialIdx(i)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 border ${
                    materialIdx === i
                      ? "bg-gold-metallic text-black border-gold-metallic shadow-gold"
                      : "bg-white/5 border-white/10 text-white hover:border-gold-metallic/50"
                  }`}
                >
                  <span className="font-heading font-black text-sm uppercase tracking-wide">{m.label}</span>
                  <span className={`text-sm font-black ${ materialIdx === i ? "text-black/70" : "text-gold-metallic" }`}>₹{m.price}<span className="text-[10px] font-bold">/sqft</span></span>
                </button>
              ))}
            </div>
            {/* Desktop: 3-col grid */}
            <div className="hidden sm:grid grid-cols-3 gap-3">
              {materialOptions.map((m, i) => (
                <button key={m.label} type="button" onClick={() => setMaterialIdx(i)}
                  className={`py-4 rounded-xl text-center transition-all duration-300 border ${
                    materialIdx === i ? "bg-gold-metallic text-black border-gold-metallic shadow-gold" : "bg-white/5 border-white/10 text-white hover:border-gold-metallic/50"
                  }`}
                >
                  <div className="font-heading font-black text-sm uppercase tracking-wider">{m.label}</div>
                  <div className={`text-xs font-bold mt-1 ${materialIdx === i ? "text-black/70" : "text-gold-metallic"}`}>₹{m.price}/sqft</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-xs font-bold text-white/60 mb-2 flex items-center gap-2 uppercase tracking-widest"><User size={12} className="text-gold-metallic" /> Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="bg-white/10 border-white/10 text-white placeholder:text-white/20 h-10 sm:h-12 font-bold" />
            </div>
            <div>
              <label className="text-xs font-bold text-white/60 mb-2 flex items-center gap-2 uppercase tracking-widest"><Phone size={12} className="text-gold-metallic" /> Phone</label>
              <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" className="bg-white/10 border-white/10 text-white placeholder:text-white/20 h-10 sm:h-12 font-bold" />
            </div>
          </div>

          <Button type="submit" className="w-full bg-gold-metallic text-black font-heading font-black py-4 sm:py-6 md:py-8 text-sm sm:text-base md:text-lg rounded-2xl shadow-gold-premium hover:brightness-125 transition-all animate-shine">
            <Calculator className="mr-2 sm:mr-3" size={18} /> CALCULATE NOW
          </Button>
        </form>

        {result !== null && (
          <motion.div className="mt-6 p-4 sm:p-6 rounded-2xl bg-gold-metallic/5 border border-gold-metallic/30 text-center"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-xs sm:text-sm font-bold text-white/60 mb-2 uppercase tracking-[0.2em]">Estimated Total Cost</p>
            <p className="font-heading font-black text-3xl sm:text-4xl md:text-5xl text-gold-metallic drop-shadow-md">₹{result.toLocaleString("en-IN")}</p>
            <p className="text-[10px] sm:text-xs font-bold text-white/40 mt-2 sm:mt-3 uppercase leading-relaxed">{plotSize.toLocaleString()} sqft × {floors} floor(s) × ₹{materialOptions[materialIdx].price}/sqft</p>
            <div className="w-12 h-1 bg-gold-metallic mx-auto mt-3 sm:mt-4 rounded-full" />
            <p className="text-xs sm:text-sm font-bold text-gold-metallic mt-3 sm:mt-4 mb-4 sm:mb-6">Our engineers will call you shortly with a detailed quote.</p>
            <a
              href={`https://wa.me/918926277881?text=${encodeURIComponent(`Hi Makaan Infra! I used your calculator.\nName: ${name}\nPhone: ${phone}\nPlot Size: ${plotSize} sqft\nFloors: ${floors}\nMaterial: ${materialOptions[materialIdx].label}\nEstimate: ₹${result.toLocaleString("en-IN")}\n\nPlease send me a detailed quote.`)}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-[#25D366] text-white font-heading font-black px-5 sm:px-8 py-3 sm:py-4 rounded-xl hover:brightness-110 transition-all shadow-lg text-xs sm:text-sm uppercase tracking-widest"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Send Estimate on WhatsApp
            </a>
          </motion.div>
        )}

      </motion.div>
    </div>
  );
};

export default CostCalculator;
