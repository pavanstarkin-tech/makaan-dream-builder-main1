import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, FolderOpen, Image, BookOpen, FileText, MessageSquare, MapPin, Mail, Wrench, Target, Shield, Menu, Zap, Percent, Settings, CheckCircle2, Briefcase, Plus, Trash2, X, Star, LogOut, ChevronRight, Phone, Users, Bell, Search, Filter, ArrowUpRight, Download, Eye, Edit3, Loader2, Play, Pause, RefreshCw, AlertCircle, Home, Info, Heart, UploadCloud, Edit2, Calculator, Database, Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc, terminate, clearIndexedDbPersistence, onSnapshot, setDoc, collection } from "firebase/firestore";
import { ref, onValue, set, get, child } from "firebase/database";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db, app, rtdb } from "@/lib/firebase";
import { uploadImage } from "@/lib/uploadImage";
import { defaultData } from "@/lib/defaults";

// --- Types & Constants ---
type Tab = "home" | "about" | "services" | "projects" | "process" | "contact" | "legal" | "settings" | "gallery" | "blogs" | "calculator" | "career" | "leads" | "applications" | "popups" | "cities";
const ADMIN_UID = "47pLqfzo9jQXmJ9r0lEnQq6J9ua2";

// --- Reusable Components ---

const SectionCard = ({ title, icon: Icon, children, onSave, saving }: { title: string; icon: any; children: React.ReactNode; onSave?: () => void; saving?: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#0D0D0D] border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group"
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-metallic/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gold-metallic/10 rounded-2xl text-gold-metallic">
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-black uppercase tracking-widest text-white">{title}</h3>
      </div>
      {onSave && (
        <Button 
          onClick={onSave} 
          disabled={saving}
          className="bg-gold-metallic text-black font-black uppercase tracking-widest text-[10px] px-6 h-10 rounded-full hover:brightness-110 shadow-gold group/btn"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} className="group-hover/btn:scale-110 transition-transform" />}
          <span className="ml-2">Sync Changes</span>
        </Button>
      )}
    </div>
    <div className="space-y-8">{children}</div>
  </motion.div>
);

const FormField = ({ label, children, description }: { label: string; children: React.ReactNode; description?: string }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-metallic/60 block ml-1">{label}</label>
    {children}
    {description && <p className="text-[9px] text-white/20 font-medium ml-1 uppercase">{description}</p>}
  </div>
);

const MediaInput = ({ value, onChange, label, folder }: { value: string; onChange: (val: string) => void; label: string; folder: string }) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    toast({ title: "Uploading to cloud..." });
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
      toast({ title: "Asset published successfully!" });
    } catch (error: any) {
      console.error("Upload error caught in MediaInput:", error);
      toast({ 
        title: "Upload failed", 
        description: error.message || "Check connection and CORS settings.", 
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block ml-1">{label}</label>
      <div className="flex gap-3">
        <Input 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="https://images.unsplash.com/..." 
          className="bg-white/[0.03] border-white/10 text-white placeholder:text-white/10 h-12 rounded-2xl focus:border-gold-metallic/50 transition-colors" 
        />
        <div className="relative">
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleUpload} disabled={uploading} />
          <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-gold-metallic/10 hover:text-gold-metallic gap-2 h-12 rounded-2xl min-w-[120px]">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
            <span className="text-[10px] font-black uppercase">Upload</span>
          </Button>
        </div>
      </div>
      {value && (
        <div className="mt-2 aspect-video rounded-2xl overflow-hidden border border-white/5 bg-black/40 relative group">
          <img src={value} alt="preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Eye size={24} className="text-white" />
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Dashboard Component ---

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("home");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [diagVisible, setDiagVisible] = useState(false);

  // Section States
  const [pageData, setPageData] = useState<any>({});
  const [sectionLoading, setSectionLoading] = useState(true);

  // Sync with Firestore Real-time
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user || user.uid !== ADMIN_UID) {
        navigate("/admin");
      } else {
        setCurrentUser(user);
      }
    });

    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);

    return () => {
      unsubAuth();
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, [navigate]);

  // Lazy Loading Firestore Listener (Single Listener for Active Tab)
  useEffect(() => {
    setSectionLoading(true);
    const docRef = doc(db, "website_content", tab);
    const unsub = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setPageData(prev => ({ ...prev, [tab]: snapshot.data() }));
      } else {
        setPageData(prev => ({ ...prev, [tab]: defaultData[tab] || {} }));
      }
      setSectionLoading(false);
      setLoading(false);
    }, (err) => {
      toast({ title: "Sync Error", description: err.message, variant: "destructive" });
      setSectionLoading(false);
      setLoading(false);
    });

    return () => unsub();
  }, [tab]);

  const saveSection = async (key: Tab, data: any, label: string) => {
    setSaving(true);
    try {
      const docRef = doc(db, "website_content", key);
      await setDoc(docRef, data);
      toast({ title: `${label} synchronized with production.` });
    } catch (err: any) {
      toast({ 
        title: "Sync Failed", 
        description: err.message, 
        variant: "destructive" 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin");
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
      <div className="w-20 h-20 border-2 border-gold-metallic/10 border-t-gold-metallic rounded-full animate-spin" />
      <h2 className="text-gold-metallic font-black uppercase tracking-[0.5em] animate-pulse">Establishing Secure Uplink</h2>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#050505] text-white selection:bg-gold-metallic/30">
      {/* Sidebar */}
      <aside className="w-80 bg-black border-r border-white/5 flex flex-col sticky top-0 h-screen">
        <div className="p-10 border-b border-white/5">
          <h1 className="text-2xl font-black tracking-tighter">MAKAAN<span className="text-gold-metallic">INFRA</span></h1>
          <div className="mt-4 flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse shadow-green' : 'bg-red-500'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{isOnline ? 'Production Online' : 'Offline Mode'}</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
          {[
            { id: "home", label: "Home", icon: Home },
            { id: "projects", label: "Projects", icon: FolderOpen },
            { id: "leads", label: "Leads", icon: Phone },
            { id: "applications", label: "Job Applications", icon: FileText },
            { id: "services", label: "Services", icon: Wrench },
            { id: "about", label: "About Us", icon: Info },
            { id: "gallery", label: "Gallery", icon: Image },
            { id: "blogs", label: "Blogs", icon: BookOpen },
            { id: "calculator", label: "Calculator", icon: Calculator },
            { id: "popups", label: "Popups", icon: Zap },
            { id: "cities", label: "Cities", icon: MapPin },
            { id: "contact", label: "Contact", icon: Mail },
            { id: "process", label: "Process", icon: Target },
            { id: "legal", label: "Legal", icon: Shield },
            { id: "career", label: "Career", icon: Briefcase },
            { id: "settings", label: "Settings", icon: Settings },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as Tab)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 group ${
                tab === t.id ? "bg-gold-metallic text-black shadow-gold" : "text-white/30 hover:bg-white/5 hover:text-white"
              }`}
            >
              <t.icon size={20} className={tab === t.id ? "" : "group-hover:scale-110 transition-transform"} />
              <span className="text-[10px] font-black uppercase tracking-widest">{t.label}</span>
              {tab === t.id && <ChevronRight size={16} className="ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5">
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-white/20 hover:text-red-500 hover:bg-red-500/10 gap-4 rounded-2xl h-14 font-black uppercase tracking-widest text-[10px]">
            <LogOut size={20} /> Terminate Session
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        <header className="h-28 border-b border-white/5 bg-black/50 backdrop-blur-3xl sticky top-0 z-50 flex items-center justify-between px-12">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold-metallic mb-1">Admin Panel</h2>
            <h3 className="text-2xl font-black uppercase tracking-widest text-white">{tab.charAt(0).toUpperCase() + tab.slice(1)} Page Editor</h3>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setDiagVisible(!diagVisible)} className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-colors">
              {diagVisible ? "[ Hide Monitor ]" : "[ Show Monitor ]"}
            </button>
            <div className="w-12 h-12 rounded-2xl bg-gold-metallic/10 border border-gold-metallic/20 flex items-center justify-center text-gold-metallic font-black text-xl">
              {currentUser?.email?.[0].toUpperCase() || "A"}
            </div>
          </div>
        </header>

        <div className="p-12 max-w-6xl mx-auto space-y-12">
          {sectionLoading && (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 size={40} className="text-gold-metallic animate-spin" />
              <p className="text-gold-metallic/40 font-black uppercase tracking-widest text-[10px]">Syncing {tab} Data...</p>
            </div>
          )}

          {diagVisible && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-red-500/10 border border-red-500/20 rounded-[2rem] p-8 overflow-hidden">
               <div className="grid grid-cols-3 gap-8 text-[10px] font-black uppercase tracking-widest">
                  <div className="space-y-2">
                    <p className="text-red-500/60">Deployment ID</p>
                    <code className="text-white truncate block">{app.options.projectId}</code>
                  </div>
                  <div className="space-y-2">
                    <p className="text-red-500/60">Identity Token</p>
                    <code className="text-white truncate block">{currentUser?.uid}</code>
                  </div>
                  <div className="space-y-4">
                    <p className="text-red-500/60">System Core</p>
                    <div className="flex flex-col gap-3">
                      <button onClick={async () => { await terminate(db); await clearIndexedDbPersistence(db); window.location.reload(); }} className="text-gold-metallic hover:underline text-left">Hard Reset Cache</button>
                      <button onClick={async () => {
                        if(confirm("SEED SYSTEM? This will overwrite empty Firestore paths with default site data. Proceed?")) {
                          setSaving(true);
                          try {
                            for (const key in defaultData) {
                              const docRef = doc(db, "website_content", key);
                              await setDoc(docRef, defaultData[key]);
                            }
                            toast({ title: "System Seeded", description: "Default Firestore protocols initialized." });
                            window.location.reload();
                          } catch (err: any) {
                            toast({ title: "Seeding Failed", description: err.message, variant: "destructive" });
                          } finally {
                            setSaving(false);
                          }
                        }
                      }} className="text-white hover:text-gold-metallic text-left">Seed System Defaults</button>
                      <button onClick={async () => {
                        if(confirm("MIGRATE TO REALTIME? This will copy all Firestore production data to RTDB. This is a one-time operation. Proceed?")) {
                          setSaving(true);
                          try {
                            const tabs: Tab[] = ["home", "about", "services", "projects", "process", "contact", "legal", "settings", "gallery", "blogs", "calculator", "career", "leads", "applications", "popups", "cities"];
                            for (const t of tabs) {
                              const docRef = doc(db, "website_content", t);
                              const snap = await getDoc(docRef);
                              if (snap.exists()) {
                                const contentRef = ref(rtdb, "website_content/" + t);
                                await set(contentRef, snap.data());
                              }
                            }
                            toast({ title: "Production Migration Successful", description: "Realtime Database is now the active source of truth." });
                            window.location.reload();
                          } catch (err: any) {
                            toast({ title: "Migration Failed", description: err.message, variant: "destructive" });
                          } finally {
                            setSaving(false);
                          }
                        }
                      }} className="text-orange-500 hover:text-orange-400 text-left font-black">Migrate to Realtime</button>
                      <button onClick={async () => {
                        try {
                          const testRef = ref(rtdb, "system_test");
                          await set(testRef, { timestamp: Date.now(), status: "active", admin: currentUser?.uid });
                          const snap = await get(testRef);
                          if (snap.exists()) {
                            toast({ title: "RTDB Success", description: "Read/Write protocols verified." });
                          }
                        } catch (err: any) {
                          toast({ title: "RTDB Error", description: err.message, variant: "destructive" });
                        }
                      }} className="text-blue-500 hover:text-blue-400 text-left">Test Realtime Database</button>
                    </div>
                  </div>
               </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {/* --- HOME MODULE --- */}
            {tab === "home" && !sectionLoading && pageData.home && (
              <motion.div key="home" className="space-y-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <SectionCard title="Home Page · Hero Section" icon={Zap} onSave={() => saveSection("home", pageData.home, "Hero Context")} saving={saving}>
                   <div className="flex justify-between items-center mb-10 bg-gold-metallic/5 p-6 rounded-2xl border border-gold-metallic/10">
                      <div className="space-y-1">
                         <h4 className="text-gold-metallic font-black uppercase tracking-widest text-[10px]">Static Data Synchronization</h4>
                         <p className="text-white/40 text-[9px] uppercase font-bold">Overwrite database with site defaults</p>
                      </div>
                      <Button onClick={async () => {
                        if(confirm("INITIALIZE DATABASE? This will overwrite the Firestore production data with the current site static data. Proceed?")) {
                          setSaving(true);
                          try {
                            for (const key in defaultData) {
                              const docRef = doc(db, "website_content", key);
                              await setDoc(docRef, defaultData[key]);
                            }
                            toast({ title: "Static Data Migrated", description: "Firestore initialized with site defaults." });
                            window.location.reload();
                          } catch (err: any) {
                            toast({ title: "Initialization Failed", description: err.message, variant: "destructive" });
                          } finally {
                            setSaving(false);
                          }
                        }
                      }} className="bg-gold-metallic text-black font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl hover:scale-105 transition-transform shadow-gold">
                        <Database size={14} className="mr-2" /> Sync Initial Data
                      </Button>
                   </div>
                   <div className="grid grid-cols-2 gap-10">
                      <div className="space-y-8">
                        <FormField label="Main Headline" description="The core value proposition shown on page load.">
                          <Input value={pageData.home.hero?.heading || ""} onChange={(e) => setPageData({ ...pageData, home: { ...pageData.home, hero: { ...pageData.home.hero, heading: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-16 rounded-2xl text-xl font-black px-8" />
                        </FormField>
                        <FormField label="Brand Narrative" description="Supporting text for the hero section.">
                          <Textarea value={pageData.home.hero?.subtext || ""} onChange={(e) => setPageData({ ...pageData, home: { ...pageData.home.hero, subtext: e.target.value } })} className="bg-white/[0.03] border-white/10 text-white min-h-[140px] rounded-2xl p-8 text-sm leading-relaxed" />
                        </FormField>
                        <FormField label="Hero Background Video" description="Paste a YouTube embed URL to replace the static image background.">
                          <div className="relative group/vid">
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gold-metallic/40 group-focus-within/vid:text-gold-metallic transition-colors">
                              <Play size={20} fill="currentColor" className="opacity-20 group-focus-within/vid:opacity-100" />
                            </div>
                            <Input 
                              value={pageData.home.hero?.videoUrl || ""} 
                              placeholder="https://www.youtube.com/embed/..."
                              onChange={(e) => setPageData({ ...pageData, home: { ...pageData.home, hero: { ...pageData.home.hero, videoUrl: e.target.value } } })} 
                              className="bg-white/[0.03] border-white/10 text-gold-metallic h-14 rounded-2xl pl-16 pr-6 text-sm font-medium focus-visible:ring-gold-metallic/30" 
                            />
                            {pageData.home.hero?.videoUrl && (
                              <div className="mt-4 p-4 rounded-xl bg-gold-metallic/5 border border-gold-metallic/10 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase text-gold-metallic/60 tracking-widest">Active Background Engine</span>
                                <a href={pageData.home.hero.videoUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase text-white hover:text-gold-metallic flex items-center gap-2 transition-colors">
                                  Preview <ArrowUpRight size={12} />
                                </a>
                              </div>
                            )}
                          </div>
                        </FormField>
                      </div>
                      <div className="space-y-8">
                        <MediaInput value={pageData.home.hero?.images?.[0] || ""} folder="home" label="Primary Background" onChange={(url) => {
                          const imgs = [...(pageData.home.hero?.images || [""])];
                          imgs[0] = url;
                          setPageData({ ...pageData, home: { ...pageData.home, hero: { ...pageData.home.hero, images: imgs } } });
                        }} />
                      </div>
                   </div>
                </SectionCard>

                <SectionCard title="About Us · Statistics" icon={Star} onSave={() => saveSection("home", pageData.home, "Growth Metrics")} saving={saving}>
                  <div className="grid grid-cols-4 gap-6">
                    {(pageData.home.stats || []).map((s: any, i: number) => (
                      <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-3">
                        <Input value={s.val} onChange={(e) => {
                          const stats = [...pageData.home.stats];
                          stats[i].val = e.target.value;
                          setPageData({ ...pageData, home: { ...pageData.home, stats } });
                        }} className="bg-transparent border-none text-gold-metallic text-2xl font-black text-center p-0 h-auto focus-visible:ring-0" />
                        <Input value={s.label} onChange={(e) => {
                          const stats = [...pageData.home.stats];
                          stats[i].label = e.target.value;
                          setPageData({ ...pageData, home: { ...pageData.home, stats } });
                        }} className="bg-transparent border-none text-white/20 text-[10px] font-black uppercase tracking-widest text-center p-0 h-auto focus-visible:ring-0" />
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Home Page · About Preview" icon={Info} onSave={() => saveSection("home", pageData.home, "About Hub")} saving={saving}>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-8">
                      <FormField label="Mini Heading">
                        <Input value={pageData.home.aboutPreview?.heading || ""} onChange={(e) => setPageData({ ...pageData, home: { ...pageData.home, aboutPreview: { ...pageData.home.aboutPreview, heading: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6" />
                      </FormField>
                      <FormField label="Short Bio">
                        <Textarea value={pageData.home.aboutPreview?.description || ""} onChange={(e) => setPageData({ ...pageData, home: { ...pageData.home, aboutPreview: { ...pageData.home.aboutPreview, description: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white min-h-[100px] rounded-xl p-6 text-xs" />
                      </FormField>
                    </div>
                    <MediaInput value={pageData.home.aboutPreview?.image || ""} folder="home" label="Teaser Image" onChange={(url) => setPageData({ ...pageData, home: { ...pageData.home, aboutPreview: { ...pageData.home.aboutPreview, image: url } } })} />
                  </div>
                </SectionCard>

                <SectionCard title="Home Page · Services Preview" icon={Wrench} onSave={() => saveSection("home", pageData.home, "Service Meta")} saving={saving}>
                  <div className="grid grid-cols-2 gap-8">
                    <FormField label="Strategic Label (Mini Header)" description="e.g. WHAT WE DO">
                      <Input value={pageData.home.servicesLabel || ""} onChange={(e) => setPageData({ ...pageData, home: { ...pageData.home, servicesLabel: e.target.value } })} className="bg-white/[0.03] border-white/10 text-gold-metallic h-12 rounded-xl px-6 font-bold uppercase tracking-widest text-[10px]" />
                    </FormField>
                    <FormField label="Section Title">
                      <Input value={pageData.home.servicesTitle || ""} onChange={(e) => setPageData({ ...pageData, home: { ...pageData.home, servicesTitle: e.target.value } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6" />
                    </FormField>
                  </div>
                </SectionCard>

                <SectionCard title="Home Page · Why Choose Us" icon={CheckCircle2} onSave={() => saveSection("home", pageData.home, "Choice Context")} saving={saving}>
                  <div className="grid grid-cols-2 gap-8 mb-10">
                    <FormField label="Strategic Label" description="e.g. WHY CHOOSE US">
                      <Input value={pageData.home.whyChooseLabel || ""} onChange={(e) => setPageData({ ...pageData, home: { ...pageData.home, whyChooseLabel: e.target.value } })} className="bg-white/[0.03] border-white/10 text-gold-metallic h-12 rounded-xl px-6 font-bold uppercase tracking-widest text-[10px]" />
                    </FormField>
                    <FormField label="Main Heading">
                      <Input value={pageData.home.whyChooseTitle || ""} onChange={(e) => setPageData({ ...pageData, home: { ...pageData.home, whyChooseTitle: e.target.value } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6" />
                    </FormField>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(pageData.home.whyChooseUs || []).map((item: any, i: number) => (
                      <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-4 group relative">
                        <Input value={item.icon || "CheckCircle2"} onChange={(e) => {
                          const items = [...pageData.home.whyChooseUs];
                          items[i].icon = e.target.value;
                          setPageData({ ...pageData, home: { ...pageData.home, whyChooseUs: items } });
                        }} className="bg-gold-metallic/10 border-gold-metallic/20 text-gold-metallic h-10 w-24 rounded-lg text-[10px] font-black uppercase text-center" />
                        <Input value={item.title || ""} placeholder="Benefit" onChange={(e) => {
                          const items = [...pageData.home.whyChooseUs];
                          items[i].title = e.target.value;
                          setPageData({ ...pageData, home: { ...pageData.home, whyChooseUs: items } });
                        }} className="bg-transparent border-none text-white text-sm font-black uppercase focus-visible:ring-0" />
                        <Textarea value={item.desc || ""} placeholder="Narrative" onChange={(e) => {
                          const items = [...pageData.home.whyChooseUs];
                          items[i].desc = e.target.value;
                          setPageData({ ...pageData, home: { ...pageData.home, whyChooseUs: items } });
                        }} className="bg-white/[0.03] border-white/10 text-white/40 text-[9px] min-h-[60px] rounded-xl p-4 leading-relaxed" />
                        <button onClick={() => {
                           const items = pageData.home.whyChooseUs.filter((_: any, idx: number) => idx !== i);
                           setPageData({ ...pageData, home: { ...pageData.home, whyChooseUs: items } });
                        }} className="absolute top-2 right-2 text-white/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                           <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <Button onClick={() => setPageData({ ...pageData, home: { ...pageData.home, whyChooseUs: [...(pageData.home.whyChooseUs || []), { title: "New Benefit", desc: "", icon: "CheckCircle2" }] } })} className="bg-white/5 border border-white/10 h-auto rounded-3xl min-h-[140px] text-white/20 hover:text-gold-metallic hover:bg-gold-metallic/10 flex flex-col gap-2">
                       <Plus size={20} />
                       <span className="text-[8px] font-black uppercase tracking-widest tracking-[0.2em]">Add Benefit</span>
                    </Button>
                  </div>
                </SectionCard>

                <SectionCard title="Home Page · Call to Action" icon={CheckCircle2} onSave={() => saveSection("home", pageData.home, "Global CTA")} saving={saving}>
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <FormField label="CTA Heading">
                        <Input value={pageData.home.cta?.heading || ""} onChange={(e) => setPageData({ ...pageData, home: { ...pageData.home, cta: { ...pageData.home.cta, heading: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6 font-bold" />
                      </FormField>
                      <FormField label="CTA Subtext">
                        <Input value={pageData.home.cta?.subtext || ""} onChange={(e) => setPageData({ ...pageData, home: { ...pageData.home, cta: { ...pageData.home.cta, subtext: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6" />
                      </FormField>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField label="Button Text">
                          <Input value={pageData.home.cta?.buttonText || ""} onChange={(e) => setPageData({ ...pageData, home: { ...pageData.home, cta: { ...pageData.home.cta, buttonText: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-gold-metallic h-10 rounded-lg px-4 text-xs font-black uppercase" />
                        </FormField>
                        <FormField label="Button Link">
                          <Input value={pageData.home.cta?.buttonLink || ""} onChange={(e) => setPageData({ ...pageData, home: { ...pageData.home, cta: { ...pageData.home.cta, buttonLink: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-10 rounded-lg px-4 text-xs" />
                        </FormField>
                      </div>
                    </div>
                    <MediaInput value={pageData.home.cta?.image || ""} folder="home" label="CTA Visual" onChange={(url) => setPageData({ ...pageData, home: { ...pageData.home, cta: { ...pageData.home.cta, image: url } } })} />
                  </div>
                </SectionCard>

                <SectionCard title="Home Page · Client Testimonials" icon={Quote} onSave={() => saveSection("home", pageData.home, "Experience Narrative")} saving={saving}>
                   <div className="flex justify-between items-center mb-8">
                      <div className="space-y-1">
                         <h4 className="text-sm font-black uppercase tracking-widest text-white">Client Narratives</h4>
                         <p className="text-[10px] text-white/20 uppercase font-black tracking-widest leading-loose">Managing {(pageData.home.testimonial || []).length} active citations</p>
                      </div>
                      <Button onClick={() => setPageData({ ...pageData, home: { ...pageData.home, testimonial: [...(pageData.home.testimonial || []), { name: "John Doe", role: "CEO", content: "" }] } })} className="bg-gold-metallic/10 border border-gold-metallic/20 text-gold-metallic font-black uppercase tracking-widest text-[10px] px-8 h-10 rounded-xl hover:bg-gold-metallic/20">
                         <Plus size={14} className="mr-2" /> Add Citation
                      </Button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {(pageData.home.testimonial || []).map((t: any, i: number) => (
                         <div key={i} className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] space-y-6 relative group">
                            <div className="grid grid-cols-2 gap-4">
                               <FormField label="Client Name">
                                  <Input value={t.name || ""} onChange={(e) => {
                                     const items = [...pageData.home.testimonial];
                                     items[i].name = e.target.value;
                                     setPageData({ ...pageData, home: { ...pageData.home, testimonial: items } });
                                  }} className="bg-white/[0.03] border-white/10 text-white h-10 rounded-lg px-4" />
                               </FormField>
                               <FormField label="Identity / Role">
                                  <Input value={t.role || ""} onChange={(e) => {
                                     const items = [...pageData.home.testimonial];
                                     items[i].role = e.target.value;
                                     setPageData({ ...pageData, home: { ...pageData.home, testimonial: items } });
                                  }} className="bg-white/[0.03] border-white/10 text-white h-10 rounded-lg px-4" />
                               </FormField>
                            </div>
                            <div className="flex items-center gap-6">
                               <div className="w-32">
                                  <FormField label="Rating (1-5)">
                                     <Input type="number" min="1" max="5" value={t.rating || 5} onChange={(e) => {
                                        const items = [...pageData.home.testimonial];
                                        items[i].rating = Number(e.target.value);
                                        setPageData({ ...pageData, home: { ...pageData.home, testimonial: items } });
                                     }} className="bg-white/[0.03] border-white/10 text-gold-metallic h-10 rounded-lg px-4 font-black" />
                                  </FormField>
                               </div>
                               <div className="flex-1">
                                  <FormField label="The Narrative">
                                     <Textarea value={t.content || ""} onChange={(e) => {
                                        const items = [...pageData.home.testimonial];
                                        items[i].content = e.target.value;
                                        setPageData({ ...pageData, home: { ...pageData.home, testimonial: items } });
                                     }} className="bg-white/[0.03] border-white/10 text-white min-h-[80px] rounded-xl p-4 text-xs leading-relaxed" />
                                  </FormField>
                               </div>
                            </div>
                            <button onClick={() => {
                               const items = pageData.home.testimonial.filter((_: any, idx: number) => idx !== i);
                               setPageData({ ...pageData, home: { ...pageData.home, testimonial: items } });
                            }} className="absolute top-4 right-4 text-white/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                               <Trash2 size={16} />
                            </button>
                         </div>
                      ))}
                   </div>
                </SectionCard>
              </motion.div>
            )}

            {/* --- LEADS MODULE --- */}
            {tab === "leads" && !sectionLoading && pageData.leads && (
              <motion.div key="leads" className="space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <SectionCard title="Leads · Inbound Messages" icon={Phone}>
                   <div className="space-y-4">
                      {(!pageData.leads.items || pageData.leads.items.length === 0) ? (
                        <div className="py-20 text-center text-white/20 uppercase tracking-[0.2em] font-black text-xs">Zero active leads found</div>
                      ) : (
                        pageData.leads.items.map((lead: any, i: number) => (
                          <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-[1.5rem] flex items-center justify-between group hover:bg-white/[0.04] transition-colors">
                             <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-xl bg-gold-metallic/10 border border-gold-metallic/20 flex items-center justify-center text-gold-metallic font-black">
                                   {lead.name?.[0] || "#"}
                                </div>
                                <div className="space-y-1">
                                   <div className="flex items-center gap-3">
                                      <h4 className="font-black text-white">{lead.name || "Anonymous"}</h4>
                                      <span className="text-[8px] bg-white/5 px-2 py-0.5 rounded text-white/40 font-bold uppercase tracking-widest">{lead.type || "Inquiry"}</span>
                                   </div>
                                   <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{lead.phone} • {lead.date}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-4">
                                <button onClick={() => window.open(`tel:${lead.phone}`)} className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-gold-metallic hover:bg-gold-metallic/10 transition-colors">
                                   <Phone size={16} />
                                </button>
                                <button onClick={async () => {
                                  const updated = pageData.leads.items.filter((_: any, idx: number) => idx !== i);
                                  await saveSection("leads", { items: updated }, "Lead Archive");
                                }} className="p-3 bg-white/5 rounded-xl text-white/10 hover:text-red-500 hover:bg-red-500/10 transition-colors">
                                   <Trash2 size={16} />
                                </button>
                             </div>
                          </div>
                        ))
                      )}
                   </div>
                </SectionCard>
              </motion.div>
            )}

            {/* --- PROJECTS MODULE --- */}
            {tab === "projects" && !sectionLoading && pageData.projects && (
               <motion.div key="projects" className="space-y-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <SectionCard title="Projects · Hero Section" icon={FolderOpen} onSave={() => saveSection("projects", pageData.projects, "Portfolio Meta")} saving={saving}>
                     <div className="grid grid-cols-2 gap-8">
                        <FormField label="Main Section Heading">
                           <Input value={pageData.projects.heroHeading || ""} onChange={(e) => setPageData({ ...pageData, projects: { ...pageData.projects, heroHeading: e.target.value } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6" />
                        </FormField>
                        <FormField label="Portfolio Narrative">
                           <Input value={pageData.projects.heroSubtext || ""} onChange={(e) => setPageData({ ...pageData, projects: { ...pageData.projects, heroSubtext: e.target.value } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6" />
                        </FormField>
                     </div>
                  </SectionCard>

                  <div className="flex justify-between items-center bg-black/40 p-10 rounded-[2.5rem] border border-white/5">
                    <div className="space-y-1">
                      <h4 className="text-xl font-black uppercase tracking-widest text-white">Inventory control</h4>
                      <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.4em]">Managing {(pageData.projects.items || []).length} active landmarks</p>
                    </div>
                    <Button onClick={() => {
                      const items = [...(pageData.projects.items || []), { title: "New Project", category: "Ongoing", location: "", desc: "", image: "" }];
                      setPageData({ ...pageData, projects: { ...pageData.projects, items } });
                    }} className="bg-gold-metallic text-black font-black uppercase tracking-[0.2em] text-[10px] px-10 h-14 rounded-full hover:scale-105 transition-transform shadow-gold">
                      <Plus size={16} className="mr-2" /> Add Landmark
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     {(pageData.projects.items || []).map((project: any, i: number) => (
                        <SectionCard key={i} title={`Landmark #0${i+1}`} icon={Target} onSave={() => saveSection("projects", pageData.projects, `Project "${project.title}"`)} saving={saving}>
                           <div className="space-y-6">
                              <FormField label="Landmark Title">
                                 <Input value={project.title || ""} onChange={(e) => {
                                   const items = [...pageData.projects.items];
                                   items[i].title = e.target.value;
                                   setPageData({ ...pageData, projects: { ...pageData.projects, items } });
                                 }} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl font-bold px-6" />
                              </FormField>
                              <div className="grid grid-cols-2 gap-4">
                                <FormField label="Status Phase">
                                  <select value={project.category || "Ongoing"} onChange={(e) => {
                                    const items = [...pageData.projects.items];
                                    items[i].category = e.target.value;
                                    setPageData({ ...pageData, projects: { ...pageData.projects, items } });
                                  }} className="bg-white/[0.03] border border-white/10 text-white h-12 rounded-xl px-6 text-[10px] font-black uppercase appearance-none cursor-pointer">
                                    <option className="bg-black">Ongoing</option>
                                    <option className="bg-black">Completed</option>
                                    <option className="bg-black">Upcoming</option>
                                  </select>
                                </FormField>
                                <FormField label="City Connection">
                                  <Input value={project.location || ""} onChange={(e) => {
                                    const items = [...pageData.projects.items];
                                    items[i].location = e.target.value;
                                    setPageData({ ...pageData, projects: { ...pageData.projects, items } });
                                  }} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6" />
                                </FormField>
                              </div>
                              <FormField label="Project Brief">
                                <Textarea value={project.desc || ""} onChange={(e) => {
                                   const items = [...pageData.projects.items];
                                   items[i].desc = e.target.value;
                                   setPageData({ ...pageData, projects: { ...pageData.projects, items } });
                                }} className="bg-white/[0.03] border-white/10 text-white min-h-[60px] rounded-xl p-4 text-[10px]" />
                              </FormField>
                              <MediaInput value={project.image || ""} folder="projects" label="Landmark Visual" onChange={(url) => {
                                 const items = [...pageData.projects.items];
                                 items[i].image = url;
                                 setPageData({ ...pageData, projects: { ...pageData.projects, items } });
                              }} />
                              <Button variant="ghost" onClick={() => {
                                 const items = pageData.projects.items.filter((_: any, idx: number) => idx !== i);
                                 setPageData({ ...pageData, projects: { ...pageData.projects, items } });
                              }} className="w-full text-red-500/20 hover:text-red-500 hover:bg-red-500/10 text-[10px] font-black uppercase tracking-widest h-12 rounded-xl transition-colors">
                                 <Trash2 size={16} className="mr-2" /> Expunge Landmark
                              </Button>
                           </div>
                        </SectionCard>
                     ))}
                  </div>
               </motion.div>
            )}

            {/* --- SERVICES MODULE --- */}
            {tab === "services" && !sectionLoading && pageData.services && (
               <motion.div key="services" className="space-y-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <SectionCard title="Services · Service Details" icon={Wrench} onSave={() => saveSection("services", pageData.services, "Service Matrix")} saving={saving}>
                     <div className="grid grid-cols-2 gap-8 mb-12">
                        <FormField label="Hero Heading">
                           <Input value={pageData.services.hero?.heading || ""} onChange={(e) => setPageData({ ...pageData, services: { ...pageData.services, hero: { ...pageData.services.hero, heading: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6" />
                        </FormField>
                        <FormField label="Hero Subtext">
                           <Input value={pageData.services.hero?.subtext || ""} onChange={(e) => setPageData({ ...pageData, services: { ...pageData.services, hero: { ...pageData.services.hero, subtext: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6" />
                        </FormField>
                     </div>

                     <div className="grid grid-cols-2 gap-10">
                        {(pageData.services.cards || []).map((service: any, i: number) => (
                           <div key={i} className="bg-black/20 border border-white/5 p-10 rounded-[2.5rem] space-y-8 group relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-metallic/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="flex items-center gap-6">
                                 <div className="w-14 h-14 rounded-2xl bg-gold-metallic/10 flex items-center justify-center text-gold-metallic">
                                    <Star size={24} />
                                 </div>
                                 <FormField label="Service Identity">
                                    <Input value={service.title || ""} onChange={(e) => {
                                      const cards = [...pageData.services.cards];
                                      cards[i].title = e.target.value;
                                      setPageData({ ...pageData, services: { ...pageData.services, cards } });
                                    }} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl font-bold px-6 text-lg" />
                                 </FormField>
                              </div>
                              <FormField label="Capabilities Brief">
                                 <Textarea value={service.desc || ""} onChange={(e) => {
                                   const cards = [...pageData.services.cards];
                                   cards[i].desc = e.target.value;
                                   setPageData({ ...pageData, services: { ...pageData.services, cards } });
                                 }} className="bg-white/[0.03] border-white/10 text-white min-h-[100px] rounded-[1.5rem] p-6 text-sm leading-relaxed" />
                              </FormField>
                              <FormField label="Feature Set (Comma-Separated)">
                                 <Input value={Array.isArray(service.features) ? service.features.join(", ") : service.features || ""} onChange={(e) => {
                                   const cards = [...pageData.services.cards];
                                   cards[i].features = e.target.value.split(",").map((f: string) => f.trim()).filter(Boolean);
                                   setPageData({ ...pageData, services: { ...pageData.services, cards } });
                                 }} className="bg-white/[0.03] border-white/10 text-gold-metallic h-10 rounded-xl px-4 text-[10px]" />
                              </FormField>
                              <MediaInput value={service.image || ""} folder="services" label="Technical Asset" onChange={(url) => {
                                 const cards = [...pageData.services.cards];
                                 cards[i].image = url;
                                 setPageData({ ...pageData, services: { ...pageData.services, cards } });
                              }} />
                           </div>
                        ))}
                     </div>
                  </SectionCard>
               </motion.div>
            )}

            {/* --- ABOUT MODULE --- */}
            {tab === "about" && !sectionLoading && pageData.about && (
               <motion.div key="about" className="space-y-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <SectionCard title="About Us · Hero Section" icon={Heart} onSave={() => saveSection("about", pageData.about, "About Studio")} saving={saving}>
                     <div className="grid grid-cols-2 gap-8 mb-12">
                        <FormField label="Story Heading">
                           <Input value={pageData.about.hero?.heading || ""} onChange={(e) => setPageData({ ...pageData, about: { ...pageData.about, hero: { ...pageData.about.hero, heading: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6" />
                        </FormField>
                        <FormField label="Story Subtext">
                           <Input value={pageData.about.hero?.subtext || ""} onChange={(e) => setPageData({ ...pageData, about: { ...pageData.about, hero: { ...pageData.about.hero, subtext: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6" />
                        </FormField>
                     </div>

                     <div className="space-y-10">
                        <FormField label="Executive Narrative (Our Story)">
                           <Textarea value={pageData.about.story || ""} onChange={(e) => setPageData({ ...pageData, about: { ...pageData.about, story: e.target.value } })} className="bg-white/[0.03] border-white/10 text-white min-h-[160px] rounded-[2rem] p-8 text-sm italic leading-relaxed" />
                        </FormField>
                        
                        <div className="grid grid-cols-2 gap-10">
                           <div className="space-y-8">
                             <FormField label="Corporate Mission">
                                <Textarea value={pageData.about.mission || ""} onChange={(e) => setPageData({ ...pageData, about: { ...pageData.about, mission: e.target.value } })} className="bg-white/[0.03] border-white/10 text-white min-h-[100px] rounded-[1.5rem] p-6 text-xs" />
                             </FormField>
                             <FormField label="Strategic Vision">
                                <Textarea value={pageData.about.vision || ""} onChange={(e) => setPageData({ ...pageData, about: { ...pageData.about, vision: e.target.value } })} className="bg-white/[0.03] border-white/10 text-white min-h-[100px] rounded-[1.5rem] p-6 text-xs" />
                             </FormField>
                           </div>
                           <div className="space-y-8">
                              <MediaInput value={pageData.about.hero?.image || ""} folder="about" label="Primary Story Image" onChange={(url) => setPageData({ ...pageData, about: { ...pageData.about, hero: { ...pageData.about.hero, image: url } } })} />
                           </div>
                        </div>

                        <SectionCard title="About Us · Why Choose Us" icon={CheckCircle2} onSave={() => saveSection("about", pageData.about, "About Advantages")} saving={saving}>
                           <div className="space-y-4">
                              {(pageData.about.whyChoose || []).map((item: string, i: number) => (
                                 <div key={i} className="flex gap-4 items-center bg-white/[0.02] border border-white/5 p-4 rounded-2xl group">
                                    <Input value={item} onChange={(e) => {
                                       const why = [...pageData.about.whyChoose];
                                       why[i] = e.target.value;
                                       setPageData({ ...pageData, about: { ...pageData.about, whyChoose: why } });
                                    }} className="bg-transparent border-none text-white text-[11px] font-bold uppercase tracking-widest h-8 focus-visible:ring-0 flex-1" />
                                    <button onClick={() => {
                                       const why = pageData.about.whyChoose.filter((_: any, idx: number) => idx !== i);
                                       setPageData({ ...pageData, about: { ...pageData.about, whyChoose: why } });
                                    }} className="text-white/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                       <Trash2 size={16} />
                                    </button>
                                 </div>
                              ))}
                              <Button onClick={() => setPageData({ ...pageData, about: { ...pageData.about, whyChoose: [...(pageData.about.whyChoose || []), "New Strategic Advantage"] } })} className="w-full bg-gold-metallic/5 border border-gold-metallic/20 text-gold-metallic h-12 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gold-metallic/10">
                                 <Plus size={16} className="mr-2" /> Add Advantage
                              </Button>
                           </div>
                        </SectionCard>

                        <SectionCard title="About Us · Core Values" icon={Shield} onSave={() => saveSection("about", pageData.about, "About Values")} saving={saving}>
                           <div className="grid grid-cols-2 gap-6">
                              {(pageData.about.values || []).map((v: any, i: number) => (
                                 <div key={i} className="bg-black/40 border border-white/5 p-8 rounded-[2rem] space-y-6 group relative">
                                    <div className="flex items-center gap-4">
                                       <Input value={v.icon || "Star"} onChange={(e) => {
                                          const values = [...pageData.about.values];
                                          values[i].icon = e.target.value;
                                          setPageData({ ...pageData, about: { ...pageData.about, values } });
                                       }} className="bg-gold-metallic/10 border-gold-metallic/20 text-gold-metallic h-10 w-24 rounded-lg text-[10px] font-black uppercase text-center" />
                                       <Input value={v.title || ""} onChange={(e) => {
                                          const values = [...pageData.about.values];
                                          values[i].title = e.target.value;
                                          setPageData({ ...pageData, about: { ...pageData.about, values } });
                                       }} className="bg-transparent border-none text-white text-lg font-black uppercase tracking-tighter h-10 focus-visible:ring-0 flex-1" />
                                    </div>
                                    <Textarea value={v.desc || ""} onChange={(e) => {
                                       const values = [...pageData.about.values];
                                       values[i].desc = e.target.value;
                                       setPageData({ ...pageData, about: { ...pageData.about, values } });
                                    }} className="bg-white/[0.03] border-white/10 text-white/40 text-[10px] min-h-[60px] rounded-xl p-4 leading-relaxed" />
                                    <button onClick={() => {
                                       const values = pageData.about.values.filter((_: any, idx: number) => idx !== i);
                                       setPageData({ ...pageData, about: { ...pageData.about, values } });
                                    }} className="absolute top-4 right-4 text-white/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                       <X size={16} />
                                    </button>
                                 </div>
                              ))}
                              <Button onClick={() => setPageData({ ...pageData, about: { ...pageData.about, values: [...(pageData.about.values || []), { title: "New Value", desc: "", icon: "Star" }] } })} className="bg-white/5 border border-white/10 h-auto rounded-[2rem] min-h-[140px] text-white/20 hover:text-gold-metallic hover:bg-gold-metallic/10 flex flex-col gap-3 font-black uppercase tracking-widest text-[10px]">
                                 <Plus size={24} /> Add Philosophy
                              </Button>
                           </div>
                        </SectionCard>

                        <SectionCard title="About Us · Statistics" icon={Star} onSave={() => saveSection("about", pageData.about, "About Stats")} saving={saving}>
                          <div className="grid grid-cols-3 gap-6">
                            {(pageData.about.stats || []).map((s: any, i: number) => (
                              <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl space-y-3">
                                <Input value={s.val} onChange={(e) => {
                                  const stats = [...pageData.about.stats];
                                  stats[i].val = e.target.value;
                                  setPageData({ ...pageData, about: { ...pageData.about, stats } });
                                }} className="bg-transparent border-none text-gold-metallic text-2xl font-black text-center p-0 h-auto focus-visible:ring-0" />
                                <Input value={s.label} onChange={(e) => {
                                  const stats = [...pageData.about.stats];
                                  stats[i].label = e.target.value;
                                  setPageData({ ...pageData, about: { ...pageData.about, stats } });
                                }} className="bg-transparent border-none text-white/20 text-[10px] font-black uppercase tracking-widest text-center p-0 h-auto focus-visible:ring-0" />
                              </div>
                            ))}
                            <Button onClick={() => setPageData({ ...pageData, about: { ...pageData.about, stats: [...(pageData.about.stats || []), { val: "0", label: "Metric" }] } })} className="bg-white/5 border border-white/10 h-auto rounded-3xl min-h-[100px] text-white/20 hover:text-gold-metallic hover:bg-gold-metallic/10 transition-all flex flex-col gap-2">
                               <Plus size={20} />
                               <span className="text-[8px] font-black uppercase tracking-widest">Add Metric</span>
                            </Button>
                          </div>
                        </SectionCard>

                        <div className="grid grid-cols-3 gap-6">
                           {(pageData.about.images || []).map((img: string, i: number) => (
                              <div key={i} className="relative group">
                                <MediaInput value={img} folder="about" label={`Gallery Asset #${i+1}`} onChange={(url) => {
                                   const imgs = [...pageData.about.images];
                                   imgs[i] = url;
                                   setPageData({ ...pageData, about: { ...pageData.about, images: imgs } });
                                }} />
                                <button onClick={() => {
                                   const imgs = pageData.about.images.filter((_: any, idx: number) => idx !== i);
                                   setPageData({ ...pageData, about: { ...pageData.about, images: imgs } });
                                }} className="absolute top-1 right-1 text-white/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <Trash2 size={14} />
                                </button>
                              </div>
                           ))}
                           <Button onClick={() => setPageData({ ...pageData, about: { ...pageData.about, images: [...(pageData.about.images || []), ""] } })} className="bg-white/5 border border-white/10 h-auto rounded-3xl min-h-[180px] text-white/20 hover:text-gold-metallic hover:bg-gold-metallic/10 transition-all flex flex-col gap-2">
                               <Plus size={24} />
                               <span className="text-[10px] font-black uppercase tracking-widest">Add Asset</span>
                            </Button>
                        </div>
                     </div>
                  </SectionCard>
               </motion.div>
            )}


            {/* --- GALLERY MODULE --- */}
            {tab === "gallery" && !sectionLoading && pageData.gallery && (
               <motion.div key="gallery" className="space-y-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <SectionCard title="Gallery · Portfolio Items" icon={Image} onSave={() => saveSection("gallery", pageData.gallery, "Gallery Meta")} saving={saving}>
                     <div className="grid grid-cols-2 gap-8 mb-12">
                        <FormField label="Hero Heading">
                           <Input value={pageData.gallery.hero?.heading || ""} onChange={(e) => setPageData({ ...pageData, gallery: { ...pageData.gallery, hero: { ...pageData.gallery.hero, heading: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6" />
                        </FormField>
                        <FormField label="Hero Subtext">
                           <Input value={pageData.gallery.hero?.subtext || ""} onChange={(e) => setPageData({ ...pageData, gallery: { ...pageData.gallery, hero: { ...pageData.gallery.hero, subtext: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6" />
                        </FormField>
                     </div>

                     <div className="grid grid-cols-3 gap-6">
                        {(pageData.gallery.items || []).map((item: any, i: number) => (
                           <div key={i} className="relative group ring-1 ring-white/5 p-6 rounded-3xl bg-white/[0.02] space-y-4">
                              <MediaInput value={typeof item === 'string' ? item : item.image || ""} folder="gallery" label={`Asset #0${i+1}`} onChange={(url) => {
                                 const items = [...pageData.gallery.items];
                                 if (typeof items[i] === 'string') items[i] = { image: url, title: "", desc: "" };
                                 else items[i] = { ...items[i], image: url };
                                 setPageData({ ...pageData, gallery: { ...pageData.gallery, items } });
                              }} />
                              <Input value={(typeof item === 'object' && item.title) || ""} placeholder="Project Title" onChange={(e) => {
                                 const items = [...pageData.gallery.items];
                                 if (typeof items[i] === 'string') items[i] = { image: items[i], title: e.target.value, desc: "" };
                                 else items[i] = { ...items[i], title: e.target.value };
                                 setPageData({ ...pageData, gallery: { ...pageData.gallery, items } });
                              }} className="bg-white/[0.03] border-white/10 text-white text-[10px] font-black uppercase tracking-widest h-8 px-4 rounded-lg" />
                              <Input value={(typeof item === 'object' && item.desc) || ""} placeholder="Technical Detail" onChange={(e) => {
                                 const items = [...pageData.gallery.items];
                                 if (typeof items[i] === 'string') items[i] = { image: items[i], title: "", desc: e.target.value };
                                 else items[i] = { ...items[i], desc: e.target.value };
                                 setPageData({ ...pageData, gallery: { ...pageData.gallery, items } });
                              }} className="bg-white/[0.03] border-white/10 text-white/40 text-[9px] h-8 px-4 rounded-lg" />
                              <button onClick={() => {
                                 const items = pageData.gallery.items.filter((_: any, idx: number) => idx !== i);
                                 setPageData({ ...pageData, gallery: { ...pageData.gallery, items } });
                              }} className="absolute top-2 right-2 text-white/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        ))}
                        <Button onClick={() => setPageData({ ...pageData, gallery: { ...pageData.gallery, items: [...(pageData.gallery.items || []), { image: "", title: "", desc: "" }] } })} className="bg-white/5 border border-white/10 h-auto rounded-3xl min-h-[220px] text-white/20 hover:text-gold-metallic hover:bg-gold-metallic/10 transition-all flex flex-col gap-4">
                           <Plus size={32} />
                           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add Visual Asset</span>
                        </Button>
                      </div>
                  </SectionCard>
               </motion.div>
            )}

            {/* --- BLOGS MODULE --- */}
            {tab === "blogs" && !sectionLoading && pageData.blogs && (
               <motion.div key="blogs" className="space-y-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <SectionCard title="Blogs · Hero & Posts" icon={BookOpen} onSave={() => saveSection("blogs", pageData.blogs, "Blog Archive")} saving={saving}>
                     <div className="grid grid-cols-2 gap-8 mb-12">
                        <FormField label="Archive Heading">
                           <Input value={pageData.blogs.hero?.heading || ""} onChange={(e) => setPageData({ ...pageData, blogs: { ...pageData.blogs, hero: { ...pageData.blogs.hero, heading: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6" />
                        </FormField>
                        <FormField label="Archive Subtext">
                           <Input value={pageData.blogs.hero?.subtext || ""} onChange={(e) => setPageData({ ...pageData, blogs: { ...pageData.blogs, hero: { ...pageData.blogs.hero, subtext: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6" />
                        </FormField>
                     </div>

                     <div className="space-y-12">
                        {(pageData.blogs.posts || []).map((post: any, i: number) => (
                           <div key={i} className="bg-black/40 border border-white/5 p-12 rounded-[3rem] group relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-64 h-64 bg-gold-metallic/5 blur-[100px]" />
                              <div className="grid grid-cols-2 gap-12">
                                 <div className="space-y-8">
                                    <FormField label="Post Title">
                                       <Input value={post.title || ""} onChange={(e) => {
                                          const posts = [...pageData.blogs.posts];
                                          posts[i].title = e.target.value;
                                          setPageData({ ...pageData, blogs: { ...pageData.blogs, posts } });
                                       }} className="bg-white/[0.03] border-white/10 text-white h-14 rounded-2xl font-black px-8 text-xl" />
                                    </FormField>
                                    <div className="grid grid-cols-2 gap-6">
                                       <FormField label="Classification">
                                          <Input value={post.category || ""} onChange={(e) => {
                                             const posts = [...pageData.blogs.posts];
                                             posts[i].category = e.target.value;
                                             setPageData({ ...pageData, blogs: { ...pageData.blogs, posts } });
                                          }} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest" />
                                       </FormField>
                                       <FormField label="Publication Date">
                                          <Input value={post.date || ""} onChange={(e) => {
                                             const posts = [...pageData.blogs.posts];
                                             posts[i].date = e.target.value;
                                             setPageData({ ...pageData, blogs: { ...pageData.blogs, posts } });
                                          }} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6" />
                                       </FormField>
                                    </div>
                                    <FormField label="Brief Excerpt">
                                       <Textarea value={post.excerpt || ""} onChange={(e) => {
                                          const posts = [...pageData.blogs.posts];
                                          posts[i].excerpt = e.target.value;
                                          setPageData({ ...pageData, blogs: { ...pageData.blogs, posts } });
                                       }} className="bg-white/[0.03] border-white/10 text-white min-h-[100px] rounded-2xl p-6 text-xs leading-relaxed" />
                                    </FormField>
                                 </div>
                                 <div className="space-y-8">
                                    <MediaInput value={post.image || ""} folder="blogs" label="Featured Asset" onChange={(url) => {
                                       const posts = [...pageData.blogs.posts];
                                       posts[i].image = url;
                                       setPageData({ ...pageData, blogs: { ...pageData.blogs, posts } });
                                    }} />
                                    <FormField label="Full Editorial Content">
                                       <Textarea value={post.content || ""} onChange={(e) => {
                                          const posts = [...pageData.blogs.posts];
                                          posts[i].content = e.target.value;
                                          setPageData({ ...pageData, blogs: { ...pageData.blogs, posts } });
                                       }} className="bg-white/[0.03] border-white/10 text-white min-h-[220px] rounded-2xl p-8 text-xs leading-[1.8]" />
                                    </FormField>
                                 </div>
                              </div>
                              <Button variant="ghost" onClick={() => {
                                 const posts = pageData.blogs.posts.filter((_: any, idx: number) => idx !== i);
                                 setPageData({ ...pageData, blogs: { ...pageData.blogs, posts } });
                              }} className="w-full mt-10 text-red-500/20 hover:text-red-500 hover:bg-red-500/10 text-[10px] font-black uppercase tracking-widest h-14 rounded-2xl">
                                 <Trash2 size={18} className="mr-2" /> Expunge Editorial
                              </Button>
                           </div>
                        ))}
                        <Button onClick={() => setPageData({ ...pageData, blogs: { ...pageData.blogs, posts: [...(pageData.blogs.posts || []), { title: "New Article", category: "News", date: new Date().toLocaleDateString(), image: "", excerpt: "", content: "" }] } })} className="w-full bg-gold-metallic/10 border border-gold-metallic/20 text-gold-metallic h-20 rounded-[2rem] font-black uppercase tracking-[0.3em] hover:bg-gold-metallic/20 transition-all">
                           <Plus size={24} className="mr-4" /> Draft New Intel
                        </Button>
                     </div>
                  </SectionCard>
               </motion.div>
            )}

            {/* --- CAREER MODULE --- */}
            {tab === "career" && !sectionLoading && pageData.career && (
               <motion.div key="career" className="space-y-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <SectionCard title="Career · Recruitment Strategy" icon={Briefcase} onSave={() => saveSection("career", pageData.career, "Recruitment Meta")} saving={saving}>
                     <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-8">
                           <FormField label="Hero Headline">
                              <Input value={pageData.career.hero?.heading || ""} onChange={(e) => setPageData({ ...pageData, career: { ...pageData.career, hero: { ...pageData.career.hero, heading: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6 font-bold" />
                           </FormField>
                           <FormField label="Recruitment Narrative">
                              <Textarea value={pageData.career.hero?.subtext || ""} onChange={(e) => setPageData({ ...pageData, career: { ...pageData.career, hero: { ...pageData.career.hero, subtext: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white min-h-[120px] rounded-[1.5rem] p-6 text-xs leading-relaxed" />
                           </FormField>
                        </div>
                        <MediaInput value={pageData.career.hero?.image || ""} folder="career" label="Culture Visual" onChange={(url) => setPageData({ ...pageData, career: { ...pageData.career, hero: { ...pageData.career.hero, image: url } } })} />
                     </div>
                  </SectionCard>
               </motion.div>
            )}

            {/* --- CITIES MODULE --- */}
            {tab === "cities" && !sectionLoading && pageData.cities && (
               <motion.div key="cities" className="space-y-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <SectionCard title="Cities · Operational Map" icon={MapPin} onSave={() => saveSection("cities", pageData.cities, "Active Regions")} saving={saving}>
                     <div className="flex flex-wrap gap-4">
                        {(pageData.cities.items || []).map((city: string, i: number) => (
                           <div key={i} className="flex gap-3 bg-white/[0.03] border border-white/10 p-3 rounded-2xl group hover:border-gold-metallic/30 transition-colors">
                              <Input value={city} onChange={(e) => {
                                 const items = [...pageData.cities.items];
                                 items[i] = e.target.value;
                                 setPageData({ ...pageData, cities: { ...pageData.cities, items } });
                              }} className="bg-transparent border-none text-white text-xs h-8 px-2 w-40 font-bold focus-visible:ring-0" />
                              <button onClick={() => {
                                 const items = pageData.cities.items.filter((_: any, idx: number) => idx !== i);
                                 setPageData({ ...pageData, cities: { ...pageData.cities, items } });
                              }} className="text-white/10 hover:text-red-500 transition-colors">
                                 <X size={16} />
                              </button>
                           </div>
                        ))}
                        <Button onClick={() => setPageData({ ...pageData, cities: { ...pageData.cities, items: [...(pageData.cities.items || []), "New Strategic Location"] } })} className="bg-gold-metallic/10 text-gold-metallic border border-gold-metallic/20 h-14 px-8 rounded-2xl hover:bg-gold-metallic/20 text-[10px] font-black uppercase tracking-widest">
                           <Plus size={18} className="mr-2" /> Expansion Entry
                        </Button>
                     </div>
                  </SectionCard>
               </motion.div>
            )}

            {/* --- POPUPS MODULE --- */}
            {tab === "popups" && !sectionLoading && pageData.popups && (
               <motion.div key="popups" className="space-y-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <SectionCard title="Popups · Promotion Config" icon={Zap} onSave={() => saveSection("popups", pageData.popups, "Conversion Logic")} saving={saving}>
                     <div className="flex items-center justify-between bg-black/40 border border-white/5 p-8 rounded-[2rem] mb-12">
                        <div>
                           <h4 className="text-white font-black uppercase tracking-[0.2em] text-sm">System Status: <span className={pageData.popups.enabled ? "text-green-500" : "text-red-500"}>{pageData.popups.enabled ? "OPERATIONAL" : "STANDBY"}</span></h4>
                           <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mt-1">Global interceptor visibility</p>
                        </div>
                        <button onClick={() => setPageData({ ...pageData, popups: { ...pageData.popups, enabled: !pageData.popups.enabled } })} className={`w-16 h-9 rounded-full transition-all flex items-center px-1.5 ${pageData.popups.enabled ? "bg-gold-metallic justify-end shadow-gold" : "bg-white/10 justify-start"}`}>
                           <div className={`w-6 h-6 rounded-full ${pageData.popups.enabled ? "bg-black" : "bg-white/20 shadow-inner"}`} />
                        </button>
                     </div>

                     <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-8">
                           <FormField label="Headline Strategy">
                              <Input value={pageData.popups.heading || ""} onChange={(e) => setPageData({ ...pageData, popups: { ...pageData.popups, heading: e.target.value } })} className="bg-white/[0.03] border-white/10 text-white h-14 rounded-2xl font-black px-8 text-lg" />
                           </FormField>
                           <FormField label="Persuasion Narrative">
                              <Textarea value={pageData.popups.subtext || ""} onChange={(e) => setPageData({ ...pageData, popups: { ...pageData.popups, subtext: e.target.value } })} className="bg-white/[0.03] border-white/10 text-white min-h-[120px] rounded-2xl p-8 text-sm leading-relaxed" />
                           </FormField>
                           <div className="grid grid-cols-2 gap-6">
                              <FormField label="CTA Prompt">
                                 <Input value={pageData.popups.buttonText || ""} onChange={(e) => setPageData({ ...pageData, popups: { ...pageData.popups, buttonText: e.target.value } })} className="bg-white/[0.03] border-white/10 text-gold-metallic h-12 rounded-xl text-[10px] font-black uppercase tracking-widest px-6" />
                              </FormField>
                              <FormField label="Link Routing">
                                 <Input value={pageData.popups.buttonLink || ""} onChange={(e) => setPageData({ ...pageData, popups: { ...pageData.popups, buttonLink: e.target.value } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6 text-xs" />
                              </FormField>
                           </div>
                        </div>
                        <MediaInput value={pageData.popups.image || ""} folder="popups" label="Visual Hook" onChange={(url) => setPageData({ ...pageData, popups: { ...pageData.popups, image: url } })} />
                     </div>
                  </SectionCard>
               </motion.div>
            )}

            {/* --- CONTACT MODULE --- */}
            {tab === "contact" && !sectionLoading && pageData.contact && (
               <motion.div key="contact" className="space-y-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <SectionCard title="Contact · Page Content" icon={Mail} onSave={() => saveSection("contact", pageData.contact, "Contact Interface")} saving={saving}>
                     <div className="grid grid-cols-2 gap-12 mb-12">
                        <div className="space-y-10">
                           <div className="space-y-4">
                              <h4 className="text-gold-metallic font-black uppercase tracking-widest text-[10px]">Hero Identity</h4>
                              <div className="grid grid-cols-2 gap-6">
                                 <FormField label="Heading">
                                    <Input value={pageData.contact.hero?.heading || ""} onChange={(e) => setPageData({ ...pageData, contact: { ...pageData.contact, hero: { ...pageData.contact.hero, heading: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6" />
                                 </FormField>
                                 <FormField label="Subtext">
                                    <Input value={pageData.contact.hero?.subtext || ""} onChange={(e) => setPageData({ ...pageData, contact: { ...pageData.contact, hero: { ...pageData.contact.hero, subtext: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6" />
                                 </FormField>
                              </div>
                           </div>
                           <div className="space-y-4">
                              <h4 className="text-gold-metallic font-black uppercase tracking-widest text-[10px]">Branch Particulars</h4>
                              <div className="grid grid-cols-2 gap-6">
                                 <FormField label="Mobile Line">
                                    <Input value={pageData.contact.details?.phone || ""} onChange={(e) => setPageData({ ...pageData, contact: { ...pageData.contact, details: { ...pageData.contact.details, phone: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6" />
                                 </FormField>
                                 <FormField label="Mail Hub">
                                    <Input value={pageData.contact.details?.email || ""} onChange={(e) => setPageData({ ...pageData, contact: { ...pageData.contact, details: { ...pageData.contact.details, email: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6" />
                                 </FormField>
                              </div>
                              <FormField label="HQ Location">
                                 <Textarea value={pageData.contact.details?.address || ""} onChange={(e) => setPageData({ ...pageData, contact: { ...pageData.contact, details: { ...pageData.contact.details, address: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white min-h-[80px] rounded-xl p-6 text-sm" />
                              </FormField>
                              <FormField label="Operations Window">
                                 <Input value={pageData.contact.details?.hours || ""} onChange={(e) => setPageData({ ...pageData, contact: { ...pageData.contact, details: { ...pageData.contact.details, hours: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6" />
                              </FormField>
                           </div>
                        </div>
                        <div className="space-y-8">
                           <MediaInput value={pageData.contact.hero?.image || ""} folder="contact" label="Identity Asset" onChange={(url) => setPageData({ ...pageData, contact: { ...pageData.contact, hero: { ...pageData.contact.hero, image: url } } })} />
                           <FormField label="Navigation Matrix (Map Embed URL)" description="Insert the 'src' URL from Google Maps embed code.">
                              <Textarea value={pageData.contact.mapUrl || ""} onChange={(e) => setPageData({ ...pageData, contact: { ...pageData.contact, mapUrl: e.target.value } })} className="bg-white/[0.03] border-white/10 text-gold-metallic/50 min-h-[140px] rounded-2xl p-6 text-[10px] leading-relaxed" />
                           </FormField>
                        </div>
                     </div>
                  </SectionCard>
               </motion.div>
            )}

            {/* --- PROCESS MODULE --- */}
            {tab === "process" && !sectionLoading && pageData.process && (
               <motion.div key="process" className="space-y-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <SectionCard title="Process · Steps" icon={Target} onSave={() => saveSection("process", pageData.process, "Process Steps")} saving={saving}>
                     <div className="space-y-8">
                        {(pageData.process.steps || []).map((step: any, i: number) => (
                           <div key={i} className="bg-black/40 border border-white/5 p-8 rounded-[2.5rem] flex gap-10 items-start relative group overflow-hidden">
                              <div className="absolute top-0 left-0 w-32 h-32 bg-gold-metallic/5 blur-[60px]" />
                              <div className="w-16 h-16 rounded-[1.5rem] bg-gold-metallic text-black flex items-center justify-center font-black text-2xl flex-shrink-0 shadow-gold">
                                 {i + 1}
                              </div>
                              <div className="flex-1 space-y-6">
                                 <FormField label="Strategic Milestone">
                                    <Input value={step.title || ""} onChange={(e) => {
                                       const steps = [...pageData.process.steps];
                                       steps[i].title = e.target.value;
                                       setPageData({ ...pageData, process: { ...pageData.process, steps } });
                                    }} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl font-black px-6" />
                                 </FormField>
                                 <FormField label="Operational Details">
                                    <Textarea value={step.desc || ""} onChange={(e) => {
                                       const steps = [...pageData.process.steps];
                                       steps[i].desc = e.target.value;
                                       setPageData({ ...pageData, process: { ...pageData.process, steps } });
                                    }} className="bg-white/[0.03] border-white/10 text-white min-h-[100px] rounded-xl p-6 text-xs leading-relaxed" />
                                 </FormField>
                              </div>
                              <button onClick={() => {
                                 const steps = pageData.process.steps.filter((_: any, idx: number) => idx !== i);
                                 setPageData({ ...pageData, process: { ...pageData.process, steps } });
                              }} className="absolute top-6 right-6 text-white/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                 <Trash2 size={20} />
                              </button>
                           </div>
                        ))}
                        <Button onClick={() => setPageData({ ...pageData, process: { ...pageData.process, steps: [...(pageData.process.steps || []), { title: "Next Phase", desc: "" }] } })} className="w-full bg-gold-metallic/5 border border-gold-metallic/20 text-gold-metallic h-16 rounded-2xl font-black uppercase tracking-widest hover:bg-gold-metallic/10 transition-all">
                           <Plus size={20} className="mr-3" /> Append Tactical Step
                        </Button>
                     </div>
                  </SectionCard>
               </motion.div>
            )}

            {/* --- LEGAL MODULE --- */}
            {tab === "legal" && !sectionLoading && pageData.legal && (
               <motion.div key="legal" className="space-y-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <SectionCard title="Legal · Compliance Docs" icon={Shield} onSave={() => saveSection("legal", pageData.legal, "Legal Framework")} saving={saving}>
                     <div className="grid grid-cols-1 gap-12">
                        <FormField label="Data Sovereignty & Privacy">
                           <Textarea value={pageData.legal.privacy || ""} onChange={(e) => setPageData({ ...pageData, legal: { ...pageData.legal, privacy: e.target.value } })} className="bg-white/[0.03] border-white/10 text-white min-h-[400px] rounded-[2rem] p-10 text-xs leading-[2] font-medium" />
                        </FormField>
                        <FormField label="Terms of Engagement & Service">
                           <Textarea value={pageData.legal.terms || ""} onChange={(e) => setPageData({ ...pageData, legal: { ...pageData.legal, terms: e.target.value } })} className="bg-white/[0.03] border-white/10 text-white min-h-[400px] rounded-[2rem] p-10 text-xs leading-[2] font-medium" />
                        </FormField>
                     </div>
                  </SectionCard>
               </motion.div>
            )}

            {/* --- CALCULATOR MODULE --- */}
            {tab === "calculator" && !sectionLoading && pageData.calculator && (
               <motion.div key="calculator" className="space-y-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                     <SectionCard title="Calculator · Hero Section" icon={Zap} onSave={() => saveSection("calculator", pageData.calculator, "Calculator Meta")} saving={saving}>
                      <div className="grid grid-cols-2 gap-10">
                         <div className="space-y-8">
                            <FormField label="Main Headline">
                               <Input value={pageData.calculator.hero?.heading || ""} onChange={(e) => setPageData({ ...pageData, calculator: { ...pageData.calculator, hero: { ...pageData.calculator.hero, heading: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6 font-bold" />
                            </FormField>
                            <FormField label="Subtext">
                               <Textarea value={pageData.calculator.hero?.subtext || ""} onChange={(e) => setPageData({ ...pageData, calculator: { ...pageData.calculator, hero: { ...pageData.calculator.hero, subtext: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white min-h-[100px] rounded-xl p-6 text-xs" />
                            </FormField>
                         </div>
                         <MediaInput value={pageData.calculator.hero?.image || ""} folder="calculator" label="Hero Asset" onChange={(url) => setPageData({ ...pageData, calculator: { ...pageData.calculator, hero: { ...pageData.calculator.hero, image: url } } })} />
                      </div>
                   </SectionCard>

<SectionCard title="Calculator · Pricing Logic" icon={Percent} onSave={() => saveSection("calculator", pageData.calculator, "Pricing Algorithm")} saving={saving}>
                     <div className="grid grid-cols-3 gap-8 mb-12">
                        {(pageData.calculator.materials || []).map((mat: any, i: number) => (
                           <div key={i} className="bg-black/40 border border-white/5 p-8 rounded-[2rem] space-y-6 group relative">
                              <FormField label="Material Grade">
                                 <Input value={mat.label || ""} onChange={(e) => {
                                    const materials = [...pageData.calculator.materials];
                                    materials[i].label = e.target.value;
                                    setPageData({ ...pageData, calculator: { ...pageData.calculator, materials } });
                                 }} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl font-black px-6" />
                              </FormField>
                              <FormField label="Base Rate (₹/sqft)">
                                 <Input value={mat.price || 0} type="number" onChange={(e) => {
                                    const materials = [...pageData.calculator.materials];
                                    materials[i].price = Number(e.target.value);
                                    setPageData({ ...pageData, calculator: { ...pageData.calculator, materials } });
                                 }} className="bg-white/[0.03] border-white/10 text-gold-metallic h-12 rounded-xl font-black px-6 text-xl" />
                              </FormField>
                              <button onClick={() => {
                                 const materials = pageData.calculator.materials.filter((_: any, idx: number) => idx !== i);
                                 setPageData({ ...pageData, calculator: { ...pageData.calculator, materials } });
                              }} className="absolute top-4 right-4 text-white/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                 <Trash2 size={16} />
                              </button>
                           </div>
                        ))}
                        <Button onClick={() => setPageData({ ...pageData, calculator: { ...pageData.calculator, materials: [...(pageData.calculator.materials || []), { label: "Standard Tier", price: 1000 }] } })} className="bg-white/5 border border-white/10 h-auto rounded-[2rem] min-h-[160px] text-white/20 hover:text-gold-metallic hover:bg-gold-metallic/10 transition-all flex flex-col gap-4 font-black uppercase tracking-widest text-[10px]">
                           <Plus size={32} /> Add Tier
                        </Button>
                     </div>
                  </SectionCard>
               </motion.div>
            )}

            {/* --- SETTINGS MODULE --- */}
            {tab === "settings" && !sectionLoading && pageData.settings && (
               <motion.div key="settings" className="space-y-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <SectionCard title="Settings · Brand & Social" icon={Menu} onSave={() => saveSection("settings", pageData.settings, "Global Config")} saving={saving}>
                     <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-10">
                           <div className="grid grid-cols-2 gap-6">
                              <FormField label="Brand Identity">
                                 <Input value={pageData.settings.studioName || "Makaan Dream Builder"} onChange={(e) => setPageData({ ...pageData, settings: { ...pageData.settings, studioName: e.target.value } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl font-black px-6" />
                              </FormField>
                              <FormField label="Operational Mobile">
                                 <Input value={pageData.settings.contactPhone || ""} onChange={(e) => setPageData({ ...pageData, settings: { ...pageData.settings, contactPhone: e.target.value } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6" />
                              </FormField>
                           </div>
                           <FormField label="Global Communication Desk">
                              <Input value={pageData.settings.contactEmail || ""} onChange={(e) => setPageData({ ...pageData, settings: { ...pageData.settings, contactEmail: e.target.value } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6" />
                           </FormField>
                           <FormField label="Corporate Headquarters">
                              <Textarea value={pageData.settings.address || ""} onChange={(e) => setPageData({ ...pageData, settings: { ...pageData.settings, address: e.target.value } })} className="bg-white/[0.03] border-white/10 text-white min-h-[100px] rounded-2xl p-6 text-xs leading-relaxed" />
                           </FormField>
                            <FormField label="Global Studio Bio">
                               <Textarea value={pageData.settings.bio || ""} onChange={(e) => setPageData({ ...pageData, settings: { ...pageData.settings, bio: e.target.value } })} className="bg-white/[0.03] border-white/10 text-white min-h-[100px] rounded-2xl p-6 text-xs leading-relaxed" />
                            </FormField>

                           <div className="space-y-6">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gold-metallic/60">Social Intel Feed</h4>
                              <div className="grid grid-cols-3 gap-4">
                                 <FormField label="Facebook">
                                    <Input value={pageData.settings.socialLinks?.facebook || ""} onChange={(e) => setPageData({ ...pageData, settings: { ...pageData.settings, socialLinks: { ...pageData.settings.socialLinks, facebook: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-10 rounded-lg text-xs" />
                                 </FormField>
                                 <FormField label="Instagram">
                                    <Input value={pageData.settings.socialLinks?.instagram || ""} onChange={(e) => setPageData({ ...pageData, settings: { ...pageData.settings, socialLinks: { ...pageData.settings.socialLinks, instagram: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-10 rounded-lg text-xs" />
                                 </FormField>
                                 <FormField label="LinkedIn">
                                    <Input value={pageData.settings.socialLinks?.linkedin || ""} onChange={(e) => setPageData({ ...pageData, settings: { ...pageData.settings, socialLinks: { ...pageData.settings.socialLinks, linkedin: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-10 rounded-lg text-xs" />
                                 </FormField>
                              </div>
                           </div>
                        </div>
                         <div className="space-y-10">
                            <MediaInput value={pageData.settings.logo || ""} folder="settings" label="Brand Seal (Logo)" onChange={(url) => setPageData({ ...pageData, settings: { ...pageData.settings, logo: url } })} />

                            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] space-y-6">
                               <h4 className="text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-between">
                                  Navigation Matrix
                                  <Button onClick={() => setPageData({ ...pageData, settings: { ...pageData.settings, navLinks: [...(pageData.settings.navLinks || []), { label: "New Link", to: "/" }] } })} className="h-6 px-3 bg-gold-metallic/10 text-gold-metallic rounded-full text-[8px] font-black uppercase hover:bg-gold-metallic hover:text-black">
                                     <Plus size={12} className="mr-1" /> Add Node
                                  </Button>
                               </h4>
                               <div className="space-y-3">
                                  {(pageData.settings.navLinks || []).map((link: any, i: number) => (
                                     <div key={i} className="flex gap-3 items-center bg-black/40 p-3 rounded-xl border border-white/5 group">
                                        <Input value={link.label} onChange={(e) => {
                                           const links = [...pageData.settings.navLinks];
                                           links[i].label = e.target.value;
                                           setPageData({ ...pageData, settings: { ...pageData.settings, navLinks: links } });
                                        }} className="bg-transparent border-none text-white text-[10px] font-bold uppercase tracking-widest h-8 px-2 flex-1 focus-visible:ring-0" />
                                        <Input value={link.to} onChange={(e) => {
                                           const links = [...pageData.settings.navLinks];
                                           links[i].to = e.target.value;
                                           setPageData({ ...pageData, settings: { ...pageData.settings, navLinks: links } });
                                        }} className="bg-white/5 border-none text-white/40 text-[9px] h-8 px-3 rounded-lg w-24 focus-visible:ring-0" />
                                        <button onClick={() => {
                                           const links = pageData.settings.navLinks.filter((_: any, idx: number) => idx !== i);
                                           setPageData({ ...pageData, settings: { ...pageData.settings, navLinks: links } });
                                        }} className="text-white/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                           <Trash2 size={14} />
                                        </button>
                                     </div>
                                  ))}
                               </div>
                            </div>

                            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2rem] space-y-4">
                               <h4 className="text-white font-black uppercase tracking-widest text-[10px]">Data Sync Integrity</h4>
                               <p className="text-white/20 text-[10px] uppercase font-bold tracking-widest leading-loose">
                                  Changes to global infrastructure affect all frontend modules instantly. Performance is cached at the edge for optimal UX.
                               </p>
                            </div>
                         </div>
                     </div>
                  </SectionCard>
               </motion.div>
            )}

            {/* --- APPLICATIONS MODULE --- */}
            {tab === "applications" && !sectionLoading && pageData.applications && (
               <motion.div key="applications" className="space-y-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <SectionCard title="Job Applications · Submissions" icon={FileText}>
                     <div className="space-y-6">
                        {(pageData.applications.items || []).length === 0 ? (
                           <div className="bg-white/[0.02] border border-white/5 p-20 rounded-[3rem] text-center">
                              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-white/10">
                                 <Briefcase size={40} />
                              </div>
                              <h4 className="text-white/20 font-black uppercase tracking-[0.3em] text-sm">No Active Candidates</h4>
                           </div>
                        ) : (
                           (pageData.applications.items || []).map((app: any, i: number) => (
                              <div key={i} className="bg-black/40 border border-white/5 p-10 rounded-[2.5rem] flex items-center gap-10 group hover:border-gold-metallic/20 transition-all">
                                 <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gold-metallic font-black text-xl">
                                    {app.name?.[0] || "?"}
                                 </div>
                                 <div className="flex-1">
                                    <h4 className="text-white font-black uppercase tracking-widest text-lg">{app.name}</h4>
                                    <p className="text-gold-metallic/60 text-[10px] font-black uppercase tracking-widest mt-1">{app.position} • {app.date}</p>
                                 </div>
                                 <div className="flex items-center gap-4">
                                    <Button variant="outline" className="border-white/10 bg-white/5 text-white/40 hover:text-white rounded-xl h-12 px-6 text-[10px] font-black uppercase">
                                       <Phone size={14} className="mr-2" /> {app.phone}
                                    </Button>
                                    <a href={app.resumeUrl} target="_blank" rel="noreferrer">
                                       <Button className="bg-gold-metallic text-black font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-xl shadow-gold hover:brightness-110">
                                          Review Dossier
                                       </Button>
                                    </a>
                                    <button onClick={() => {
                                       const items = pageData.applications.items.filter((_: any, idx: number) => idx !== i);
                                       saveSection("applications", { items }, "Archived Candidate");
                                    }} className="text-white/10 hover:text-red-500 p-2"><Trash2 size={20} /></button>
                                 </div>
                              </div>
                           ))
                        )}
                     </div>
                  </SectionCard>
               </motion.div>
            )}

            {/* --- CONTACT MODULE --- */}
            {tab === "contact" && !sectionLoading && pageData.contact && (
               <motion.div key="contact" className="space-y-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <SectionCard title="Contact · Page Content" icon={Mail} onSave={() => saveSection("contact", pageData.contact, "Contact Protocols")} saving={saving}>
                     <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-8">
                           <FormField label="Uplink Title">
                              <Input value={pageData.contact.title || ""} onChange={(e) => setPageData({ ...pageData, contact: { ...pageData.contact, title: e.target.value } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6 font-bold" />
                           </FormField>
                           <FormField label="Operational Mobile">
                              <Input value={pageData.contact.phone || ""} onChange={(e) => setPageData({ ...pageData, contact: { ...pageData.contact, phone: e.target.value } })} className="bg-white/[0.03] border-white/10 text-gold-metallic h-12 rounded-xl px-6 font-black" />
                           </FormField>
                           <FormField label="Intelligence Desk (Email)">
                              <Input value={pageData.contact.email || ""} onChange={(e) => setPageData({ ...pageData, contact: { ...pageData.contact, email: e.target.value } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6" />
                           </FormField>
                           <FormField label="Operational Hours">
                              <Input value={pageData.contact.hours || ""} onChange={(e) => setPageData({ ...pageData, contact: { ...pageData.contact, hours: e.target.value } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6" />
                           </FormField>
                        </div>
                        <div className="space-y-8">
                           <FormField label="Corporate Headquarters">
                              <Textarea value={pageData.contact.address || ""} onChange={(e) => setPageData({ ...pageData, contact: { ...pageData.contact, address: e.target.value } })} className="bg-white/[0.03] border-white/10 text-white min-h-[100px] rounded-2xl p-6 text-xs leading-relaxed" />
                           </FormField>
                           <FormField label="Geospatial Mapping (Embed URL)">
                              <Input value={pageData.contact.map || ""} onChange={(e) => setPageData({ ...pageData, contact: { ...pageData.contact, map: e.target.value } })} className="bg-white/[0.03] border-white/10 text-white h-12 rounded-xl px-6 text-[10px]" />
                           </FormField>
                           <div className="space-y-6">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Social Integration</h4>
                              <div className="grid grid-cols-3 gap-4">
                                 <Input value={pageData.contact.socials?.facebook || ""} placeholder="Facebook" onChange={(e) => setPageData({ ...pageData, contact: { ...pageData.contact, socials: { ...pageData.contact.socials, facebook: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-10 rounded-lg text-xs" />
                                 <Input value={pageData.contact.socials?.instagram || ""} placeholder="Instagram" onChange={(e) => setPageData({ ...pageData, contact: { ...pageData.contact, socials: { ...pageData.contact.socials, instagram: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-10 rounded-lg text-xs" />
                                 <Input value={pageData.contact.socials?.linkedin || ""} placeholder="LinkedIn" onChange={(e) => setPageData({ ...pageData, contact: { ...pageData.contact, socials: { ...pageData.contact.socials, linkedin: e.target.value } } })} className="bg-white/[0.03] border-white/10 text-white h-10 rounded-lg text-xs" />
                              </div>
                           </div>
                        </div>
                     </div>
                  </SectionCard>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;


