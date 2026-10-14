import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, FolderOpen, Image, BookOpen, FileText, MessageSquare, MapPin, Mail, Wrench, Target, Shield, Menu, Zap, Percent, Settings, CheckCircle2, Briefcase, Plus, Trash2, X, Star, LogOut, ChevronRight, Phone, Users, Bell, Search, Filter, ArrowUpRight, Download, Eye, Edit3, Loader2, Play, Pause, RefreshCw, AlertCircle, Home, Info, Heart, UploadCloud, Edit2, Calculator
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc, setDoc, onSnapshot, updateDoc, deleteDoc, enableNetwork, disableNetwork, terminate, clearIndexedDbPersistence } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db, storage, app } from "@/lib/firebase";
import { uploadImage } from "@/lib/uploadImage";

interface Lead { phone: string; name?: string; type?: string; date: string; }
interface Application { name: string; phone: string; email: string; position: string; resumeName: string; date: string; }

type Tab = "home" | "about" | "services" | "projects" | "process" | "contact" | "legal" | "settings" | "gallery" | "blogs" | "calculator" | "career" | "leads" | "applications" | "popups" | "cities";

const defaultSettings = {
  logo: "/logo.png",
  phone: "+91 89262 77881",
  email: "info@makaaninfra.com",
  address: "Shop No-175, Super Market, Bargarh, Odisha - 768028",
  bio: "Odisha's Most Trusted Construction Experts.",
  socialLinks: { facebook: "", instagram: "", linkedin: "", twitter: "" }
};

const defaultLegal = {
  privacy: "Our privacy policy details...",
  terms: "Our terms and conditions details..."
};

const defaultProcess = {
  hero: { heading: "Our Process", subtext: "How we bring your vision to life.", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e" },
  steps: [
    { title: "Consultation", desc: "Understanding your requirements." },
    { title: "Planning", desc: "Detailed structural and architectural design." },
    { title: "Execution", desc: "High-quality construction with precision." },
    { title: "Delivery", desc: "Final handover of your dream project." }
  ]
};

const defaultPopups = {
  enabled: true,
  image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5",
  heading: "BUILD WITH MAKAAN INFRA",
  subtext: "Odisha's Most Trusted Construction Experts. Let's discuss your project today.",
  buttonText: "GET FREE CONSULTATION"
};

const defaultHome = {
  hero: {
    heading: "Building Your Dream", 
    subtext: "Professional civil construction, building planning & structural consulting services in Odisha.",
    images: ["/hero-bg.jpg"],
    buttons: [
      { text: "Get Quote", link: "/contact" },
      { text: "Contact Us", link: "/contact" }
    ]
  },
  stats: [
    { val: "2020", label: "Founded" },
    { val: "50+", label: "Landmarks" },
    { val: "100+", label: "Partners" },
    { val: "5+", label: "Years" }
  ],
  aboutPreview: {
    heading: "Engineering Excellence",
    description: "Makaan Infra is a powerhouse of civil engineering based in Bargarh, Odisha.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e"
  },
  servicesTitle: "Our Specialized Services",
  portfolio: [
    { title: "Skyline Residency", category: "Ongoing", image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5" },
    { title: "Sunrise Apartments", category: "Completed", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e" },
    { title: "Green Valley Villas", category: "Completed", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd" },
    { title: "Riverside Complex", category: "Ongoing", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab" },
    { title: "Makaan Commercial Park", category: "Upcoming", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" },
    { title: "Tech Hub Odisha", category: "Upcoming", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9" }
  ],
  whyChooseUs: [
    { title: "Uncompromising Quality", desc: "We use premium materials and rigorous testing to ensure every structure stands the test of time.", icon: "Award" },
    { title: "Expert Engineering", desc: "Our team of seasoned structural engineers and architects bring decades of combined experience.", icon: "HardHat" },
    { title: "On-Time Delivery", desc: "We respect your timelines and utilize advanced project management to eliminate delays.", icon: "Clock" },
    { title: "Transparent Pricing", desc: "No hidden costs. We maintain complete financial transparency from planning to handover.", icon: "Shield" },
    { title: "Client-Centric Approach", desc: "Your vision dictates our blueprint. We prioritize open communication and absolute client satisfaction.", icon: "Users" },
    { title: "Modern Innovations", desc: "We leverage the latest in construction technology to deliver smart, sustainable building solutions.", icon: "Star" }
  ],
  testimonial: [
    { name: "Rajesh K.", role: "Homeowner", text: "Great experience!", rating: 5 }
  ],
  cta: {
    heading: "Ready to Build?",
    subtext: "Transform your vision into a landmark.",
    buttonText: "CONTACT US",
    buttonLink: "/contact",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5"
  }
};

const defaultAbout = {
  hero: { heading: "Our Story", subtext: "Building Excellence in Odisha since 2020.", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab" },
  story: "Founded in 2020 in Bargarh, Odisha, Makaan Infra began with a simple vision: to deliver quality construction with integrity.",
  images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab"],
  mission: "To deliver exceptional construction services with the highest standards of quality.",
  vision: "To be the most trusted and innovative infrastructure development company in Odisha.",
  values: [
    { title: "Integrity", desc: "We operate with honesty.", icon: "Heart" }
  ],
  stats: [
    { val: "2020", label: "Founding" },
    { val: "50+", label: "Masterpieces" }
  ],
  whyChoose: [
    "5+ years of experience",
    "On-time delivery"
  ]
};

const defaultServices = {
  hero: { heading: "Our Services", subtext: "Expert engineering solutions.", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd" },
  cards: [
    { title: "Civil Construction", desc: "Complete civil solutions.", image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5", icon: "Building2" },
    { title: "Building Planning", desc: "Modern architectural planning.", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e", icon: "HardHat" },
    { title: "Structural Consultancy", desc: "Expert structural guidance.", image: "https://images.unsplash.com/photo-1541913051-1250f9df0d8e", icon: "Ruler" },
    { title: "Electrical & Plumbing", desc: "Seamless facility integration.", image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12", icon: "Wrench" },
    { title: "Interior Finishing", desc: "Premium aesthetic details.", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6", icon: "Paintbrush" },
    { title: "Project Management", desc: "End-to-end execution.", image: "https://images.unsplash.com/photo-1507537243553-9c99278614eb", icon: "Users" }
  ],
  features: ["Modern Planning", "Structural Analysis", "Quality Assurance", "Timely Delivery"]
};

const defaultContact = {
  title: "Get in Touch",
  address: "Shop No-175, Super Market, Bargarh, Odisha - 768028",
  phone: "+91 89262 77881",
  email: "info@makaaninfra.com",
  hours: "Mon - Sat: 9:00 AM - 7:00 PM",
  map: "https://www.google.com/maps/embed/...",
  socials: { facebook: "", instagram: "", linkedin: "" }
};

const defaultCareer = {
  heroHeading: "Join Our Team",
  heroSubtext: "Build your career with Odisha's leading construction company.",
  heroImage: "https://images.unsplash.com/photo-1516216628859-9bccecab13ca"
};

const defaultCalculator = { 
  materials: [
    { label: "Basic", price: 1200 },
    { label: "Premium", price: 1800 },
    { label: "Luxury", price: 2500 }
  ]
};

const defaultCities = {
  items: ["Bargarh", "Sambalpur", "Jharsuguda", "Balangir"]
};

const defaultProjects = {
  heroHeading: "Our Projects",
  heroSubtext: "Discover our landmark developments.",
  items: [
    { title: "Skyline Residency", category: "Ongoing", location: "Bargarh", desc: "Premium residential complex.", image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5" },
    { title: "Sunrise Apartments", category: "Completed", location: "Sambalpur", desc: "Modern living spaces.", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e" },
    { title: "Makaan Commercial Park", category: "Upcoming", location: "Rourkela", desc: "State of the art business hub.", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd" }
  ]
};

const defaultGallery = {
  hero: { heading: "Our Gallery", subtext: "A visual journey of our work.", image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5" },
  items: []
};

const defaultBlogs = {
  hero: { heading: "Insights & News", subtext: "Latest from the construction world.", image: "https://images.unsplash.com/photo-1516216628859-9bccecab13ca" },
  posts: [
    { title: "5 Tips for Planning Your Dream Home", category: "Planning", date: "Mar 10, 2026", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", excerpt: "Building a home is one of the biggest decisions. Here are the top tips to plan effectively.", content: "Building your dream home requires careful planning and execution. Start by setting a realistic budget that includes a 10-15% contingency fund." },
    { title: "Modern Architectural Trends in 2026", category: "Architecture", date: "Feb 28, 2026", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9", excerpt: "Discover the latest trends in architectural design, from sustainable materials to smart home integration.", content: "Sustainable materials and smart home integration are leading the architectural trends this year. We explore how to incorporate these elements seamlessly into your next project." },
    { title: "The Importance of Quality Foundation", category: "Construction", date: "Feb 15, 2026", image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5", excerpt: "A strong foundation is critical. Learn why cutting corners here can lead to disaster later.", content: "A building is only as strong as its foundation. In this insight, we discuss the engineering principles behind a robust base and why quality materials matter the most." }
  ]
};

const tabList: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "about", label: "About", icon: Info },
  { id: "services", label: "Services", icon: Wrench },
  { id: "process", label: "Process", icon: Target },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "legal", label: "Legal", icon: Shield },
  { id: "settings", label: "Settings", icon: Menu },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "gallery", label: "Gallery", icon: Image },
  { id: "blogs", label: "Blogs", icon: BookOpen },
  { id: "calculator", label: "Calculator", icon: Percent },
  { id: "career", label: "Career", icon: Briefcase },
  { id: "cities", label: "Cities", icon: MapPin },
  { id: "leads", label: "Leads", icon: Phone },
  { id: "applications", label: "Applications", icon: Briefcase },
  { id: "popups", label: "Popups", icon: Zap },
];

const MediaInput = ({ value, onChange, label, folder }: { value: string; onChange: (val: string) => void; label: string; folder: string }) => {
  const { toast } = useToast();
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast({ title: "Uploading image..." });
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
      toast({ title: "Image uploaded!" });
    } catch {
      toast({ title: "Upload failed. Check storage rules.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-metallic/60">{label}</label>
      <div className="flex gap-2">
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Paste Image URL" className="bg-white/5 border-white/10 text-white placeholder:text-white/20 flex-1 h-12 rounded-xl" />
        <div className="relative">
          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleUpload} />
          <Button variant="outline" className="border-gold-metallic/30 text-gold-metallic hover:bg-gold-metallic/10 gap-2 h-12 rounded-xl">
            <UploadCloud size={16} /> Upload
          </Button>
        </div>
      </div>
    </div>
  );
};

const SectionCard = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
  <div className="bg-black/40 border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
    <div className="flex items-center justify-between border-b border-white/5 pb-4">
      <h3 className="font-heading font-black text-xl text-white flex items-center gap-3 uppercase tracking-widest">
        <Icon size={22} className="text-gold-metallic" /> {title}
      </h3>
    </div>
    <div className="space-y-6">{children}</div>
  </div>
);

const ADMIN_UID = "47pLqfzo9jQXmJ9r0lEnQq6J9ua2";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("home");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [diagVisible, setDiagVisible] = useState(false);
  const [ruleError, setRuleError] = useState<string | null>(null);
  const [testingRule, setTestingRule] = useState(false);
  const [fbState, setFbState] = useState<string>("Initializing...");

  useEffect(() => {
    // Monitor Firebase App Status
    if (db) setFbState("Firestore Instance Active");
  }, []);
  
  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
      unsub();
    };
  }, []);
  
  const [home, setHome] = useState(defaultHome);
  const [about, setAbout] = useState(defaultAbout);
  const [services, setServices] = useState(defaultServices);
  const [process, setProcess] = useState(defaultProcess);
  const [contact, setContact] = useState(defaultContact);
  const [legal, setLegal] = useState(defaultLegal);
  const [settings, setSettings] = useState(defaultSettings);
  const [projects, setProjects] = useState(defaultProjects);
  const [gallery, setGallery] = useState(defaultGallery);
  const [blogs, setBlogs] = useState(defaultBlogs);
  const [calculator, setCalculator] = useState(defaultCalculator);
  const [career, setCareer] = useState(defaultCareer);
  const [cities, setCities] = useState(defaultCities);
  const [popups, setPopups] = useState(defaultPopups);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || user.uid !== ADMIN_UID) {
        sessionStorage.removeItem("makaan-admin");
        navigate("/admin");
      }
    });

    const loadData = async () => {
      setLoading(true);
      try {
        const fetchDoc = async (key: string, defaultVal: any) => {
          const snapshot = await getDoc(doc(db, "website_content", key));
          return snapshot.exists() ? { ...defaultVal, ...snapshot.data() } : defaultVal;
        };
        
        setHome(await fetchDoc("home", defaultHome));
        setAbout(await fetchDoc("about", defaultAbout));
        setServices(await fetchDoc("services", defaultServices));
        setProcess(await fetchDoc("process", defaultProcess));
        setContact(await fetchDoc("contact", defaultContact));
        setLegal(await fetchDoc("legal", defaultLegal));
        setSettings(await fetchDoc("settings", defaultSettings));
        setProjects(await fetchDoc("projects", defaultProjects));
        setGallery(await fetchDoc("gallery", defaultGallery));
        setBlogs(await fetchDoc("blogs", defaultBlogs));
        setCalculator(await fetchDoc("calculator", defaultCalculator));
        setCareer(await fetchDoc("career", defaultCareer));
        const citiesData = await fetchDoc("cities", defaultCities);
        setCities({ items: citiesData.items || defaultCities.items });
        setPopups(await fetchDoc("popups", defaultPopups));
        setLeads((await fetchDoc("leads", { items: [] })).items);
        setApplications((await fetchDoc("applications", { items: [] })).items);
      } catch (error: any) {
        console.error("Data Load Error:", error);
        const msg = error.code === "auth/network-request-failed" 
          ? "Network error. Please check your internet. DATABASE CONNECTION ERROR." 
          : error.message || "Failed to load database.";
        toast({ title: msg, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    loadData();
    return () => unsubscribe();
  }, [navigate, toast]);

  const handleLogout = async () => { 
    await signOut(auth);
    sessionStorage.removeItem("makaan-admin"); 
    navigate("/admin"); 
  };
  
  const saveToFirestore = async (key: string, data: any, label: string) => { 
    setSaving(true);
    let isTimeout = false;

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        isTimeout = true;
        reject(new Error("FAILED: Operation Timed Out. Your network connection is too unstable or rules are still blocking."));
      }, 60000); // 60 seconds for high-latency mobile networks
    });

    try {
      await Promise.race([
        setDoc(doc(db, "website_content", key), data),
        timeoutPromise
      ]);
      toast({ title: `${label} saved successfully!` });
    } catch (err: any) {
      console.error(`Save Error (${label}):`, err);
      const isRulesError = err.code === "permission-denied";
      const isOfflineError = err.message?.toLowerCase().includes("offline");

      let errorMessage = `Database Error: ${err.message || "Could not save"}`;
      if (isRulesError) errorMessage = "PERMISSION DENIED: Your Firestore Rules are still blocking access. Check the 'Rules' tab in Firebase Console.";
      if (isOfflineError || err.code === "unavailable") errorMessage = "OFFLINE/UNAVAILABLE: Your browser cannot reach Firebase servers. Check internet, VPN, or AdBlockers (Brave Shields).";
      if (isTimeout || err.code === "deadline-exceeded") errorMessage = "SAVE TIMEOUT: Connection is too slow or the protocol is being blocked by a local firewall.";
      if (err.code === "resource-exhausted") errorMessage = "DATABASE LIMIT: You have exceeded the free quota for Firestore today.";
      if (err.code === "not-found") errorMessage = "DATABASE MISSING: The document or collection does not exist in your Firebase project.";

      toast({ 
        title: errorMessage, 
        variant: "destructive" 
      });
      // Force visible diagnostic on error
      setDiagVisible(true);
    } finally {
      setSaving(false);
    }
  };

  const updateItem = <T extends Record<string, any>>(arr: T[], setArr: React.Dispatch<React.SetStateAction<T[]>>, i: number, field: string, value: any) => {
    const updated = [...arr]; 
    updated[i] = { ...updated[i], [field]: value };
    setArr(updated);
  };



  const deleteLead = async (i: number) => { 
    const u = leads.filter((_, idx) => idx !== i); 
    setLeads(u); 
    await saveToFirestore("leads", { items: u }, "Leads");
  };
  
  const deleteApp = async (i: number) => { 
    const u = applications.filter((_, idx) => idx !== i); 
    setApplications(u); 
    await saveToFirestore("applications", { items: u }, "Applications");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col gap-4 items-center justify-center">
        <div className="w-16 h-16 border-4 border-gold-metallic/20 border-t-gold-metallic rounded-full animate-spin" />
        <span className="text-gold-metallic font-black tracking-widest uppercase">Initializing Dashboard</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-black border-r border-white/10 transition-transform duration-300 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex flex-col h-full bg-black/50 backdrop-blur-xl">
          <div className="p-8 border-b border-white/10">
            <h1 className="font-heading font-black text-2xl tracking-tighter text-white">MAKAAN <span className="text-gold-metallic">INFRA</span></h1>
            <div className="flex items-center gap-2 mt-2">
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`} />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{isOnline ? 'System Online' : 'System Offline'}</p>
            </div>
            <button 
              onClick={async () => {
                await enableNetwork(db);
                toast({ title: "Signal Repaired", description: "Attempting to re-establish database connection..." });
              }}
              className="mt-4 w-full py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gold-metallic/50 hover:bg-gold-metallic/10 hover:text-gold-metallic transition-all"
            >
              Repair Connection
            </button>
            <button 
              onClick={() => setDiagVisible(!diagVisible)}
              className="mt-2 w-full py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white/60 transition-all"
            >
              {diagVisible ? 'Hide Diagnostics' : 'Show Diagnostics'}
            </button>
          </div>

          {diagVisible && (
            <div className="mx-6 mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-red-500 uppercase">Diagnostic Log</span>
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
              </div>
              <div className="space-y-1">
                <p className="text-[8px] text-white/40 font-bold uppercase">Auth UID:</p>
                <code className="text-[9px] text-white/80 block truncate bg-black/40 p-1 rounded font-mono">{currentUser?.uid || 'Not Logged In'}</code>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] text-white/40 font-bold uppercase">Project ID:</p>
                <code className="text-[9px] text-white/80 block truncate bg-black/40 p-1 rounded font-mono">{(app.options as any).projectId || 'Unknown'}</code>
              </div>
              <button
                onClick={async () => {
                  setTestingRule(true);
                  setRuleError(null);
                  try {
                    await setDoc(doc(db, "test_connection", "ping"), { time: Date.now() });
                    setRuleError("SUCCESS: Write Worked!");
                  } catch (e: any) {
                    setRuleError(`${e.code || 'ERROR'}: ${e.message}`);
                  } finally {
                    setTestingRule(false);
                  }
                }}
                disabled={testingRule}
                className="w-full py-2 bg-gold-metallic/20 border border-gold-metallic/30 rounded-xl text-[10px] font-black uppercase tracking-widest text-gold-metallic hover:bg-gold-metallic/30 transition-all"
              >
                {testingRule ? 'Testing...' : 'Test Rules Now'}
              </button>
              
              <button
                onClick={async () => {
                  try {
                    setRuleError("Clearing Cache...");
                    await terminate(db);
                    await clearIndexedDbPersistence(db);
                    window.location.reload();
                  } catch (e: any) {
                    setRuleError(`Clear Failed: ${e.message}`);
                  }
                }}
                className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white/80 transition-all"
              >
                Hard Reset Database
              </button>

              <div className="space-y-1">
                <p className="text-[8px] text-white/40 font-bold uppercase">App State:</p>
                <code className="text-[9px] text-white/80 block bg-black/40 p-1 rounded font-mono">{fbState}</code>
              </div>
              
              {ruleError && (
                <div className={`p-2 rounded text-[9px] font-mono whitespace-pre-wrap break-all ${ruleError.startsWith('SUCCESS') ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                  {ruleError}
                </div>
              )}
              <p className="text-[10px] text-red-500 font-bold leading-tight">If "SAVE TIMEOUT" persists:</p>
              <ul className="text-[9px] text-white/40 space-y-1 list-disc pl-4">
                <li>Check <b>Firestore Rules</b> in Firebase Console.</li>
                <li>Disable <b>Brave Shields</b> or <b>AdBlockers</b>.</li>
                <li>Ensure you are in <b>Firestore Database</b> (not Realtime).</li>
              </ul>
            </div>
          )}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
            {tabList.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  tab === t.id ? "bg-gold-metallic text-black shadow-gold" : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              ><t.icon size={18} />{t.label}</button>
            ))}
          </nav>
          <div className="p-6 border-t border-white/10">
            <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-white/40 hover:text-destructive hover:bg-destructive/10 gap-3 font-black text-xs uppercase tracking-widest">
              <LogOut size={18} /> Logout Session
            </Button>
          </div>
        </div>
      </aside>

      {/* Toggle Button for Mobile */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gold-metallic text-black shadow-gold flex items-center justify-center">
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 min-h-screen">
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-white/10 px-8 py-6 flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-[0.2em] text-white">
            <span className="text-gold-metallic">{tabList.find(t => t.id === tab)?.label}</span> Hub
          </h2>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Administrator</span>
              <span className="text-[10px] font-black text-gold-metallic uppercase tracking-widest">Connected</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gold-metallic flex items-center justify-center text-black font-black text-lg shadow-gold">A</div>
          </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            
            {/* HOME */}
            {tab === "home" && (
              <div className="space-y-12">
                <SectionCard title="Hero Identity" icon={Home}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Main Heading</label>
                        <Input value={home.hero.heading} onChange={(e) => setHome({ ...home, hero: { ...home.hero, heading: e.target.value } })} placeholder="e.g. Building Your Dream" className="bg-white/5 border-white/10 text-white h-14 rounded-2xl font-black text-2xl px-6 focus:border-gold-metallic" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Supporting Narratives</label>
                        <Textarea value={home.hero.subtext} onChange={(e) => setHome({ ...home, hero: { ...home.hero, subtext: e.target.value } })} placeholder="Describe your core mission..." className="bg-white/5 border-white/10 text-white min-h-[120px] rounded-2xl p-6 font-medium leading-relaxed focus:border-gold-metallic" />
                      </div>
                      <div className="space-y-4 pt-4">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Action Buttons</label>
                        {home.hero.buttons.map((btn, i) => (
                          <div key={i} className="flex gap-2">
                            <Input value={btn.text} onChange={(e) => {
                              const newBtns = [...home.hero.buttons];
                              newBtns[i].text = e.target.value;
                              setHome({ ...home, hero: { ...home.hero, buttons: newBtns } });
                            }} placeholder="Button Text" className="bg-white/5 border-white/10 text-white h-10 rounded-xl text-xs flex-1" />
                            <Input value={btn.link} onChange={(e) => {
                              const newBtns = [...home.hero.buttons];
                              newBtns[i].link = e.target.value;
                              setHome({ ...home, hero: { ...home.hero, buttons: newBtns } });
                            }} placeholder="Link (e.g. /contact)" className="bg-white/5 border-white/10 text-gold-metallic h-10 rounded-xl text-xs flex-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Hero Visuals</label>
                      <div className="grid grid-cols-2 gap-4">
                        {home.hero.images.map((img, i) => (
                          <div key={i} className="space-y-2">
                            <div className="aspect-video rounded-xl overflow-hidden border border-white/10 bg-white/5">
                              <img src={img} alt="preview" className="w-full h-full object-cover" />
                            </div>
                            <MediaInput value={img} folder="home" label={`Slide ${i + 1}`} onChange={(url) => {
                              const newImgs = [...home.hero.images];
                              newImgs[i] = url;
                              setHome({ ...home, hero: { ...home.hero, images: newImgs } });
                            }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Success Metrics" icon={Star}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {home.stats.map((s, i) => (
                      <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-2">
                        <Input value={s.val} onChange={(e) => {
                          const newStats = [...home.stats];
                          newStats[i].val = e.target.value;
                          setHome({ ...home, stats: newStats });
                        }} placeholder="Value (e.g. 50+)" className="bg-white/5 border-white/10 text-gold-metallic font-black h-10 rounded-lg text-center" />
                        <Input value={s.label} onChange={(e) => {
                          const newStats = [...home.stats];
                          newStats[i].label = e.target.value;
                          setHome({ ...home, stats: newStats });
                        }} placeholder="Label" className="bg-white/5 border-white/10 text-white text-[10px] h-8 rounded-lg text-center uppercase font-bold" />
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="About Preview" icon={Info}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Preview Heading</label>
                        <Input value={home.aboutPreview.heading} onChange={(e) => setHome({ ...home, aboutPreview: { ...home.aboutPreview, heading: e.target.value } })} className="bg-white/5 border-white/10 text-white h-12 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Description</label>
                        <Textarea value={home.aboutPreview.description} onChange={(e) => setHome({ ...home, aboutPreview: { ...home.aboutPreview, description: e.target.value } })} className="bg-white/5 border-white/10 text-white min-h-[140px] rounded-xl text-sm" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Preview Image</label>
                      <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                        <img src={home.aboutPreview.image} alt="about preview" className="w-full h-full object-cover" />
                      </div>
                      <MediaInput value={home.aboutPreview.image} folder="home" label="Change Image" onChange={(url) => setHome({ ...home, aboutPreview: { ...home.aboutPreview, image: url } })} />
                    </div>
                  </div>
                </SectionCard>



                <SectionCard title="Why Choose Us" icon={Shield}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {home.whyChooseUs.map((item, i) => (
                      <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                          <select value={item.icon} onChange={(e) => {
                            const updated = [...home.whyChooseUs];
                            updated[i].icon = e.target.value;
                            setHome({ ...home, whyChooseUs: updated });
                          }} className="bg-black/40 border-none text-[10px] text-white/40 uppercase font-black cursor-pointer">
                            {["Award", "Users", "Shield", "Clock", "Star", "CheckCircle2"].map(icon => <option key={icon} value={icon}>{icon}</option>)}
                          </select>
                          <button onClick={() => setHome({ ...home, whyChooseUs: home.whyChooseUs.filter((_, idx) => idx !== i) })} className="text-white/20 hover:text-destructive"><Trash2 size={14} /></button>
                        </div>
                        <Input value={item.title} onChange={(e) => {
                          const updated = [...home.whyChooseUs];
                          updated[i].title = e.target.value;
                          setHome({ ...home, whyChooseUs: updated });
                        }} placeholder="Title" className="bg-white/5 border-white/10 text-white font-heavy h-10 rounded-lg" />
                        <Textarea value={item.desc} onChange={(e) => {
                          const updated = [...home.whyChooseUs];
                          updated[i].desc = e.target.value;
                          setHome({ ...home, whyChooseUs: updated });
                        }} placeholder="Description" className="bg-white/5 border-white/10 text-white text-[10px] h-20 rounded-lg" />
                      </div>
                    ))}
                    <Button onClick={() => setHome({ ...home, whyChooseUs: [...home.whyChooseUs, { title: "", desc: "", icon: "Shield" }] })} variant="outline" className="border-dashed border-white/10 text-white/40 h-full min-h-[150px] rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/5 transition-all">
                      <Plus size={24} /> <span className="text-[10px] font-black uppercase tracking-widest">Add Value Proposition</span>
                    </Button>
                  </div>
                </SectionCard>

                <SectionCard title="Global Call To Action" icon={Target}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Input value={home.cta.heading} onChange={(e) => setHome({ ...home, cta: { ...home.cta, heading: e.target.value } })} placeholder="CTA Heading" className="bg-white/5 border-white/10 text-white h-12 rounded-xl font-bold" />
                      <Textarea value={home.cta.subtext} onChange={(e) => setHome({ ...home, cta: { ...home.cta, subtext: e.target.value } })} placeholder="CTA Subtext" className="bg-white/5 border-white/10 text-white min-h-[100px] rounded-xl text-xs" />
                      <div className="flex gap-4">
                        <Input value={home.cta.buttonText} onChange={(e) => setHome({ ...home, cta: { ...home.cta, buttonText: e.target.value } })} placeholder="Button Text" className="bg-white/5 border-white/10 text-white h-12 rounded-xl text-xs flex-1" />
                        <Input value={home.cta.buttonLink} onChange={(e) => setHome({ ...home, cta: { ...home.cta, buttonLink: e.target.value } })} placeholder="Link" className="bg-white/5 border-white/10 text-gold-metallic h-12 rounded-xl text-xs flex-1" />
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <div className="flex justify-end pt-8">
                  <Button disabled={saving} onClick={() => saveToFirestore("home", home, "Homepage")} className="bg-gold-metallic text-black font-black uppercase tracking-widest text-xs px-12 h-14 rounded-2xl hover:brightness-110 shadow-gold gap-3 animate-shine-slow">
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Push Homepage Changes
                  </Button>
                </div>
              </div>
            )}

            {/* PROJECTS */}
            {tab === "projects" && (
              <div className="space-y-12">
                <SectionCard title="Projects Display Settings" icon={FolderOpen}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Input value={projects.heroHeading} onChange={(e) => setProjects({ ...projects, heroHeading: e.target.value })} placeholder="Projects Page Title" className="bg-white/5 border-white/10 text-white h-12 rounded-xl" />
                    <Input value={projects.heroSubtext} onChange={(e) => setProjects({ ...projects, heroSubtext: e.target.value })} placeholder="Projects Page Subtitle" className="bg-white/5 border-white/10 text-white h-12 rounded-xl" />
                  </div>
                </SectionCard>

                <SectionCard title="Project Listings" icon={FolderOpen}>
                  <div className="space-y-4">
                    <div className="flex justify-end mb-4">
                      <Button onClick={() => setProjects({ ...projects, items: [...projects.items, { title: "", category: "Ongoing", location: "", desc: "", image: "" }] })} className="bg-gold-metallic/10 border border-gold-metallic/30 text-gold-metallic hover:bg-gold-metallic/20 gap-2 text-xs font-black uppercase"><Plus size={16} /> Add project</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {projects.items.map((p: any, i: number) => (
                        <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-4 relative group">
                          <button onClick={() => setProjects({ ...projects, items: projects.items.filter((_, idx) => idx !== i) })} className="absolute top-4 right-4 text-white/20 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                          <span className="text-[10px] font-black text-gold-metallic uppercase tracking-widest block mb-2">Project #0{i + 1}</span>
                          <Input value={p.title} onChange={(e) => updateItem(projects.items, (n: any) => setProjects({ ...projects, items: n }), i, "title", e.target.value)} placeholder="Project Title" className="bg-white/5 border-white/10 text-white h-10" />
                          <div className="grid grid-cols-2 gap-4">
                            <select value={p.category} onChange={(e) => updateItem(projects.items, (n: any) => setProjects({ ...projects, items: n }), i, "category", e.target.value)} className="bg-white/5 border border-white/10 text-white h-10 rounded-lg px-3 text-[10px] font-black uppercase appearance-none overflow-hidden text-ellipsis whitespace-nowrap">
                              <option className="bg-black">Ongoing</option>
                              <option className="bg-black">Completed</option>
                              <option className="bg-black">Upcoming</option>
                            </select>
                            <Input value={p.location} onChange={(e) => updateItem(projects.items, (n: any) => setProjects({ ...projects, items: n }), i, "location", e.target.value)} placeholder="Location" className="bg-white/5 border-white/10 text-white h-10" />
                          </div>
                          <Textarea value={p.desc} onChange={(e) => updateItem(projects.items, (n: any) => setProjects({ ...projects, items: n }), i, "desc", e.target.value)} placeholder="Short Description" className="bg-white/5 border-white/10 text-white min-h-[80px]" />
                          <MediaInput value={p.image} folder="projects" label="Project Thumbnail" onChange={(url) => updateItem(projects.items, (n: any) => setProjects({ ...projects, items: n }), i, "image", url)} />
                        </div>
                      ))}
                    </div>
                  </div>
                </SectionCard>

                <div className="flex justify-end pt-8">
                  <Button disabled={saving} onClick={() => saveToFirestore("projects", projects, "Projects Catalog")} className="bg-gold-metallic text-black font-black uppercase tracking-widest text-xs px-12 h-14 rounded-2xl hover:brightness-110 shadow-gold gap-3 animate-shine-slow">
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Push Projects Changes
                  </Button>
                </div>
              </div>
            )}

            {/* ABOUT */}
            {tab === "about" && (
              <div className="space-y-12">
                <SectionCard title="About Hero" icon={Info}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Input value={about.hero?.heading} onChange={(e) => setAbout({ ...about, hero: { ...about.hero, heading: e.target.value } })} placeholder="Hero Heading" className="bg-white/5 border-white/10 text-white h-12 rounded-xl font-bold" />
                      <Textarea value={about.hero?.subtext} onChange={(e) => setAbout({ ...about, hero: { ...about.hero, subtext: e.target.value } })} placeholder="Hero Subtext" className="bg-white/5 border-white/10 text-white min-h-[100px] rounded-xl text-xs" />
                    </div>
                    <MediaInput value={about.hero?.image} folder="about" label="Hero Image" onChange={(url) => setAbout({ ...about, hero: { ...about.hero, image: url } })} />
                  </div>
                </SectionCard>

                <SectionCard title="Our Story & Philosophical Pillars" icon={BookOpen}>
                  <div className="space-y-8">
                    <Textarea value={about.story} onChange={(e) => setAbout({ ...about, story: e.target.value })} placeholder="Our Story" className="bg-white/5 border-white/10 text-white min-h-[200px] rounded-2xl p-6 text-sm italic leading-relaxed" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gold-metallic uppercase tracking-widest">The Mission</label>
                        <Textarea value={about.mission} onChange={(e) => setAbout({ ...about, mission: e.target.value })} className="bg-white/5 border-white/10 text-white min-h-[120px] rounded-xl p-4 text-xs" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-gold-metallic uppercase tracking-widest">The Vision</label>
                        <Textarea value={about.vision} onChange={(e) => setAbout({ ...about, vision: e.target.value })} className="bg-white/5 border-white/10 text-white min-h-[120px] rounded-xl p-4 text-xs" />
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Brand Imagery" icon={Image}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {about.images.map((img: string, i: number) => (
                      <div key={i} className="space-y-4 relative group">
                        <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                          <img src={img} alt={`brand-${i}`} className="w-full h-full object-cover" />
                        </div>
                        <MediaInput value={img} folder="about" label={`Image ${i + 1}`} onChange={(url) => {
                          const newImgs = [...about.images];
                          newImgs[i] = url;
                          setAbout({ ...about, images: newImgs });
                        }} />
                        <button onClick={() => setAbout({ ...about, images: about.images.filter((_, idx) => idx !== i) })} className="absolute top-2 right-2 text-white/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <Button onClick={() => setAbout({ ...about, images: [...about.images, ""] })} variant="outline" className="border-dashed border-white/10 text-white/40 h-full min-h-[150px] rounded-2xl flex items-center justify-center">
                      <Plus size={24} />
                    </Button>
                  </div>
                </SectionCard>

                <SectionCard title="Success Metrics" icon={Star}>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {about.stats?.map((s: any, i: number) => (
                      <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-xl space-y-2">
                        <Input value={s.val} onChange={(e) => {
                          const newStats = [...about.stats];
                          newStats[i].val = e.target.value;
                          setAbout({ ...about, stats: newStats });
                        }} placeholder="Value" className="bg-white/5 border-white/10 text-gold-metallic font-black h-10 rounded-lg text-center" />
                        <Input value={s.label} onChange={(e) => {
                          const newStats = [...about.stats];
                          newStats[i].label = e.target.value;
                          setAbout({ ...about, stats: newStats });
                        }} placeholder="Label" className="bg-white/5 border-white/10 text-white text-[10px] h-8 rounded-lg text-center uppercase font-bold" />
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="Core Values" icon={Heart}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {about.values.map((v: any, i: number) => (
                      <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-4 relative group">
                        <div className="flex items-center justify-between">
                          <Input value={v.icon} onChange={(e) => {
                            const updated = [...about.values];
                            updated[i].icon = e.target.value;
                            setAbout({ ...about, values: updated });
                          }} placeholder="Icon" className="bg-transparent border-none text-[10px] text-gold-metallic uppercase font-black w-20" />
                          <button onClick={() => setAbout({ ...about, values: about.values.filter((_, idx) => idx !== i) })} className="text-white/20 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button>
                        </div>
                        <Input value={v.title} onChange={(e) => {
                          const updated = [...about.values];
                          updated[i].title = e.target.value;
                          setAbout({ ...about, values: updated });
                        }} placeholder="Value Title" className="bg-white/5 border-white/10 text-white font-heavy h-10 rounded-lg" />
                        <Textarea value={v.desc} onChange={(e) => {
                          const updated = [...about.values];
                          updated[i].desc = e.target.value;
                          setAbout({ ...about, values: updated });
                        }} placeholder="Description" className="bg-white/5 border-white/10 text-white text-[10px] h-20 rounded-lg" />
                      </div>
                    ))}
                    <Button onClick={() => setAbout({ ...about, values: [...about.values, { title: "", desc: "", icon: "Heart" }] })} variant="outline" className="border-dashed border-white/10 text-white/40 h-full min-h-[150px] rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/5">
                      <Plus size={24} /> <span className="text-[10px] font-black uppercase tracking-widest">Add Value</span>
                    </Button>
                  </div>
                </SectionCard>

                <div className="flex justify-end pt-8">
                  <Button disabled={saving} onClick={() => saveToFirestore("about", about, "About Details")} className="bg-gold-metallic text-black font-black uppercase tracking-widest text-xs px-12 h-14 rounded-2xl hover:brightness-110 shadow-gold gap-3">
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Push About Changes
                  </Button>
                </div>
              </div>
            )}

            {/* SERVICES */}
            {tab === "services" && (
              <div className="space-y-12">
                <SectionCard title="Services Hero" icon={Wrench}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Input value={services.hero.heading} onChange={(e) => setServices({ ...services, hero: { ...services.hero, heading: e.target.value } })} placeholder="Hero Heading" className="bg-white/5 border-white/10 text-white h-12 rounded-xl font-bold" />
                      <Textarea value={services.hero.subtext} onChange={(e) => setServices({ ...services, hero: { ...services.hero, subtext: e.target.value } })} placeholder="Hero Subtext" className="bg-white/5 border-white/10 text-white min-h-[100px] rounded-xl text-xs" />
                    </div>
                    <MediaInput value={services.hero.image} folder="services" label="Hero Image" onChange={(url) => setServices({ ...services, hero: { ...services.hero, image: url } })} />
                  </div>
                </SectionCard>

                <SectionCard title="Key Offerings" icon={Briefcase}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.cards.map((c, i) => (
                      <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-4 relative group">
                        <button onClick={() => setServices({ ...services, cards: services.cards.filter((_, idx) => idx !== i) })} className="absolute top-4 right-4 text-white/20 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                        <div className="flex gap-4">
                          <Input value={c.title} onChange={(e) => {
                            const updated = [...services.cards];
                            updated[i].title = e.target.value;
                            setServices({ ...services, cards: updated });
                          }} placeholder="Service Name" className="bg-white/5 border-white/10 text-white h-10 font-bold flex-1" />
                          <Input value={c.icon} onChange={(e) => {
                            const updated = [...services.cards];
                            updated[i].icon = e.target.value;
                            setServices({ ...services, cards: updated });
                          }} placeholder="Icon (e.g. Wrench)" className="bg-white/5 border-white/10 text-gold-metallic text-[10px] h-10 w-32 font-black uppercase" />
                        </div>
                        <Textarea value={c.desc} onChange={(e) => {
                          const updated = [...services.cards];
                          updated[i].desc = e.target.value;
                          setServices({ ...services, cards: updated });
                        }} placeholder="Description" className="bg-white/5 border-white/10 text-white text-xs h-24" />
                        <MediaInput value={c.image} folder="services" label="Tile Image" onChange={(url) => {
                          const updated = [...services.cards];
                          updated[i].image = url;
                          setServices({ ...services, cards: updated });
                        }} />
                      </div>
                    ))}
                    <Button onClick={() => setServices({ ...services, cards: [...services.cards, { title: "", desc: "", image: "", icon: "Building2" }] })} variant="outline" className="border-dashed border-white/10 text-white/40 h-full min-h-[150px] rounded-2xl flex flex-col items-center justify-center">
                      <Plus size={24} />
                    </Button>
                  </div>
                </SectionCard>

                <SectionCard title="Engineering Specialized Skills" icon={CheckCircle2}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.features.map((f, i) => (
                        <div key={i} className="flex gap-2">
                          <Input value={f} onChange={(e) => {
                            const updated = [...services.features];
                            updated[i] = e.target.value;
                            setServices({ ...services, features: updated });
                          }} className="bg-white/5 border-white/10 text-white h-10 flex-1" />
                          <button onClick={() => setServices({ ...services, features: services.features.filter((_, idx) => idx !== i) })} className="text-white/20 hover:text-destructive"><Trash2 size={16} /></button>
                        </div>
                      ))}
                    </div>
                    <Button onClick={() => setServices({ ...services, features: [...services.features, ""] })} className="bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest px-6 h-10 rounded-lg">Add Capability</Button>
                  </div>
                </SectionCard>

                <div className="flex justify-end pt-8">
                  <Button disabled={saving} onClick={() => saveToFirestore("services", services, "Services Suite")} className="bg-gold-metallic text-black font-black uppercase tracking-widest text-xs px-12 h-14 rounded-2xl hover:brightness-110 shadow-gold gap-3">
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Push Services Changes
                  </Button>
                </div>
              </div>
            )}

            {/* PROCESS */}
            {tab === "process" && (
              <div className="space-y-12">
                <SectionCard title="Execution Strategy" icon={Zap}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {process.steps.map((s, i) => (
                      <div key={i} className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl space-y-6 relative">
                        <div className="flex items-center justify-between">
                          <span className="w-12 h-12 rounded-full bg-gold-metallic/10 border border-gold-metallic/20 flex items-center justify-center text-gold-metallic font-black text-xl">0{i + 1}</span>
                          <button onClick={() => setProcess({ ...process, steps: process.steps.filter((_, idx) => idx !== i) })} className="text-white/20 hover:text-destructive transition-colors"><Trash2 size={20} /></button>
                        </div>
                        <div className="space-y-4">
                          <Input value={s.title} onChange={(e) => {
                            const updated = [...process.steps];
                            updated[i].title = e.target.value;
                            setProcess({ ...process, steps: updated });
                          }} placeholder="Phase Title" className="bg-white/5 border-white/10 text-white h-14 rounded-2xl font-black text-xl px-6" />
                          <Textarea value={s.desc} onChange={(e) => {
                            const updated = [...process.steps];
                            updated[i].desc = e.target.value;
                            setProcess({ ...process, steps: updated });
                          }} placeholder="Implementation details..." className="bg-white/5 border-white/10 text-white min-h-[120px] rounded-2xl p-6 text-sm" />
                        </div>
                      </div>
                    ))}
                    <Button onClick={() => setProcess({ ...process, steps: [...process.steps, { title: "", desc: "" }] })} variant="outline" className="border-dashed border-white/10 text-white/40 h-full min-h-[250px] rounded-3xl flex flex-col items-center justify-center">
                      <Plus size={44} /> <span className="text-xs font-black uppercase tracking-widest mt-4">Add Project Phase</span>
                    </Button>
                  </div>
                </SectionCard>

                <div className="flex justify-end pt-8">
                  <Button disabled={saving} onClick={() => saveToFirestore("process", process, "Process Roadmap")} className="bg-gold-metallic text-black font-black uppercase tracking-widest text-xs px-12 h-14 rounded-2xl hover:brightness-110 shadow-gold gap-3">
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Push Roadmap Changes
                  </Button>
                </div>
              </div>
            )}

            {/* GALLERY */}
            {tab === "gallery" && (
              <div className="space-y-12">
                <SectionCard title="Gallery Hero" icon={Image}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Input value={gallery.hero.heading} onChange={(e) => setGallery({ ...gallery, hero: { ...gallery.hero, heading: e.target.value } })} placeholder="Hero Heading" className="bg-white/5 border-white/10 text-white h-12 rounded-xl font-bold" />
                      <Textarea value={gallery.hero.subtext} onChange={(e) => setGallery({ ...gallery, hero: { ...gallery.hero, subtext: e.target.value } })} placeholder="Hero Subtext" className="bg-white/5 border-white/10 text-white min-h-[100px] rounded-xl text-xs" />
                    </div>
                    <MediaInput value={gallery.hero.image} folder="gallery" label="Hero Image" onChange={(url) => setGallery({ ...gallery, hero: { ...gallery.hero, image: url } })} />
                  </div>
                </SectionCard>

                <SectionCard title="Visual Collection" icon={Image}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gallery.items.map((g, i) => (
                      <div key={i} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-4 relative group">
                        <button onClick={() => setGallery({ ...gallery, items: gallery.items.filter((_, idx) => idx !== i) })} className="absolute top-2 right-2 text-white/20 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                        <MediaInput value={g.image} folder="gallery" label="Gallery Image" onChange={(url) => {
                          const updated = [...gallery.items];
                          updated[i].image = url;
                          setGallery({ ...gallery, items: updated });
                        }} />
                        <Input value={g.title} onChange={(e) => {
                          const updated = [...gallery.items];
                          updated[i].title = e.target.value;
                          setGallery({ ...gallery, items: updated });
                        }} placeholder="Project/Site Name" className="bg-white/5 border-white/10 text-white text-xs h-10" />
                        <Input value={g.desc} onChange={(e) => {
                          const updated = [...gallery.items];
                          updated[i].desc = e.target.value;
                          setGallery({ ...gallery, items: updated });
                        }} placeholder="Location/Type" className="bg-white/5 border-white/10 text-white/60 text-[10px] h-8" />
                      </div>
                    ))}
                    <Button onClick={() => setGallery({ ...gallery, items: [...gallery.items, { title: "", desc: "", image: "" }] })} variant="outline" className="border-dashed border-white/10 text-white/40 aspect-square rounded-2xl flex flex-col items-center justify-center">
                      <Plus size={32} />
                    </Button>
                  </div>
                </SectionCard>

                <div className="flex justify-end pt-8">
                  <Button disabled={saving} onClick={() => saveToFirestore("gallery", gallery, "Gallery Collection")} className="bg-gold-metallic text-black font-black uppercase tracking-widest text-xs px-12 h-14 rounded-2xl hover:brightness-110 shadow-gold gap-3">
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Push Gallery Updates
                  </Button>
                </div>
              </div>
            )}

            {/* BLOGS */}
            {tab === "blogs" && (
              <div className="space-y-12">
                <SectionCard title="Blogs Hero" icon={BookOpen}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Input value={blogs.hero.heading} onChange={(e) => setBlogs({ ...blogs, hero: { ...blogs.hero, heading: e.target.value } })} placeholder="Hero Heading" className="bg-white/5 border-white/10 text-white h-12 rounded-xl font-bold" />
                      <Textarea value={blogs.hero.subtext} onChange={(e) => setBlogs({ ...blogs, hero: { ...blogs.hero, subtext: e.target.value } })} placeholder="Hero Subtext" className="bg-white/5 border-white/10 text-white min-h-[100px] rounded-xl text-xs" />
                    </div>
                    <MediaInput value={blogs.hero.image} folder="blogs" label="Hero Image" onChange={(url) => setBlogs({ ...blogs, hero: { ...blogs.hero, image: url } })} />
                  </div>
                </SectionCard>

                <SectionCard title="Editorial Suite" icon={FileText}>
                  <div className="space-y-6">
                    {blogs.posts.map((b, i) => (
                      <div key={i} className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl space-y-6 relative group">
                        <button onClick={() => setBlogs({ ...blogs, posts: blogs.posts.filter((_, idx) => idx !== i) })} className="absolute top-6 right-6 text-white/20 hover:text-destructive transition-all"><Trash2 size={24} /></button>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <MediaInput value={b.image} folder="blogs" label="Cover Image" onChange={(url) => {
                            const updated = [...blogs.posts];
                            updated[i].image = url;
                            setBlogs({ ...blogs, posts: updated });
                          }} />
                          <div className="md:col-span-2 space-y-4">
                            <Input value={b.title} onChange={(e) => {
                              const updated = [...blogs.posts];
                              updated[i].title = e.target.value;
                              setBlogs({ ...blogs, posts: updated });
                            }} placeholder="Article Title" className="bg-white/5 border-white/10 text-white text-xl font-black h-14" />
                            <div className="grid grid-cols-2 gap-4">
                              <Input value={b.category} onChange={(e) => {
                                const updated = [...blogs.posts];
                                updated[i].category = e.target.value;
                                setBlogs({ ...blogs, posts: updated });
                              }} placeholder="Category" className="bg-white/5 border-white/10 text-gold-metallic text-xs font-black uppercase h-10" />
                              <Input value={b.date} onChange={(e) => {
                                const updated = [...blogs.posts];
                                updated[i].date = e.target.value;
                                setBlogs({ ...blogs, posts: updated });
                              }} placeholder="Date" className="bg-white/5 border-white/10 text-white/40 text-xs h-10" />
                            </div>
                            <Textarea value={b.excerpt} onChange={(e) => {
                              const updated = [...blogs.posts];
                              updated[i].excerpt = e.target.value;
                              setBlogs({ ...blogs, posts: updated });
                            }} placeholder="Short Excerpt" className="bg-white/5 border-white/10 text-white text-sm h-20" />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button onClick={() => setBlogs({ ...blogs, posts: [...blogs.posts, { title: "", category: "", excerpt: "", image: "", date: new Date().toLocaleDateString(), content: "" }] })} className="w-full bg-white/5 border border-dashed border-white/10 text-white/40 h-20 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all font-black uppercase tracking-widest text-xs">
                      <Plus size={20} /> New Article
                    </Button>
                  </div>
                </SectionCard>

                <div className="flex justify-end pt-8">
                  <Button disabled={saving} onClick={() => saveToFirestore("blogs", blogs, "Blogs Publication")} className="bg-gold-metallic text-black font-black uppercase tracking-widest text-xs px-12 h-14 rounded-2xl hover:brightness-110 shadow-gold gap-3">
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Push Blog Updates
                  </Button>
                </div>
              </div>
            )}

            {/* CONTACT */}
            {tab === "contact" && (
              <div className="space-y-12">
                <SectionCard title="Business Identity & Access" icon={Mail}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div>
                        <label className="text-[10px] font-black text-gold-metallic uppercase tracking-widest block mb-3">Corporate Headquarters</label>
                        <Textarea value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} className="bg-white/5 border-white/10 text-white min-h-[120px] rounded-2xl p-6 text-sm font-medium leading-relaxed" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gold-metallic uppercase tracking-widest block mb-3">Operating Window</label>
                        <Input value={contact.hours} onChange={(e) => setContact({ ...contact, hours: e.target.value })} className="bg-white/5 border-white/10 text-white h-14 rounded-2xl px-6 font-bold" />
                      </div>
                    </div>
                    <div className="space-y-8">
                      <div>
                        <label className="text-[10px] font-black text-gold-metallic uppercase tracking-widest block mb-3">Direct Hotline</label>
                        <Input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className="bg-white/5 border-white/10 text-gold-metallic h-16 rounded-2xl px-8 font-black text-2xl tracking-tighter" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gold-metallic uppercase tracking-widest block mb-3">Official Correspondence</label>
                        <Input value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className="bg-white/5 border-white/10 text-white h-14 rounded-2xl px-6 font-bold" />
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <div className="flex justify-end pt-8">
                  <Button disabled={saving} onClick={() => saveToFirestore("contact", contact, "Business Credentials")} className="bg-gold-metallic text-black font-black uppercase tracking-widest text-xs px-12 h-14 rounded-2xl hover:brightness-110 shadow-gold gap-3">
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Update Credentials
                  </Button>
                </div>
              </div>
            )}

            {/* CALCULATOR */}
            {tab === "calculator" && (
              <div className="space-y-12">
                <SectionCard title="Estimate Engine Logic" icon={Calculator}>
                  <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {calculator.materials.map((m, i) => (
                        <div key={i} className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl space-y-6 relative">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-gold-metallic uppercase tracking-widest">{m.label} Grade</span>
                            <Percent size={16} className="text-white/10" />
                          </div>
                          <div className="space-y-4">
                             <Input value={m.label} onChange={(e) => {
                               const updated = [...calculator.materials];
                               updated[i].label = e.target.value;
                               setCalculator({ materials: updated });
                             }} className="bg-white/5 border-white/10 text-white font-bold h-10 rounded-xl" />
                             <div className="flex items-end gap-2 text-white/40">
                               <span className="text-2xl font-black text-white">₹{m.price}</span>
                               <span className="text-[10px] font-bold uppercase pb-1">/ sqft</span>
                             </div>
                             <Input type="number" value={m.price} onChange={(e) => {
                               const updated = [...calculator.materials];
                               updated[i].price = Number(e.target.value);
                               setCalculator({ materials: updated });
                             }} className="bg-white/5 border-white/10 text-gold-metallic font-black h-12 rounded-xl text-lg text-center" />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gold-metallic/5 border border-gold-metallic/10 p-8 rounded-3xl">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gold-metallic flex items-center justify-center text-black shadow-gold shrink-0">
                          <Settings size={24} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-white font-black uppercase tracking-wider text-sm">Dynamic Calculation Logic</h4>
                          <p className="text-white/40 text-xs">The cost is calculated as: AREA (sqft) × GRADE PRICE (per sqft). Changes reflect instantly on the public calculator.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <div className="flex justify-end pt-8">
                  <Button disabled={saving} onClick={() => saveToFirestore("calculator", calculator, "Pricing Engine")} className="bg-gold-metallic text-black font-black uppercase tracking-widest text-xs px-12 h-14 rounded-2xl hover:brightness-110 shadow-gold gap-3">
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Synchronize Pricing
                  </Button>
                </div>
              </div>
            )}

            {/* CAREER PAGE */}
            {tab === "career" && (
              <div className="space-y-8">
                <div className="bg-black/40 border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
                  <h3 className="font-heading font-black text-xl text-white flex items-center gap-3 uppercase tracking-widest border-b border-white/5 pb-4"><Briefcase size={22} className="text-gold-metallic" /> Career Page Identity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-white uppercase tracking-widest">Hero Heading</label>
                      <Input value={career.heroHeading} onChange={(e) => setCareer({ ...career, heroHeading: e.target.value })} className="bg-white/5 border-white/10 text-white h-14 rounded-2xl font-black text-xl px-6" />
                      <label className="text-[10px] font-black text-white uppercase tracking-widest">Supporting Text</label>
                      <Textarea value={career.heroSubtext} onChange={(e) => setCareer({ ...career, heroSubtext: e.target.value })} className="bg-white/5 border-white/10 text-white min-h-[120px] rounded-2xl p-6 text-sm" />
                    </div>
                    <div className="space-y-4">
                      <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                        <img src={career.heroImage} className="w-full h-full object-cover" />
                      </div>
                      <MediaInput value={career.heroImage} folder="career" label="Hero Banner Image" onChange={(url) => setCareer({ ...career, heroImage: url })} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-8">
                  <Button disabled={saving} onClick={() => saveToFirestore("career", career, "Career Identity")} className="bg-gold-metallic text-black font-black uppercase tracking-widest text-xs px-12 h-14 rounded-2xl hover:brightness-110 shadow-gold gap-3 animate-shine-slow">
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Sync Career Portal
                  </Button>
                </div>
              </div>
            )}

            {/* LEADS */}
            {tab === "leads" && (
              <div className="bg-black/40 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                  <h3 className="font-heading font-black text-xl text-white flex items-center gap-3 uppercase tracking-widest"><Phone size={22} className="text-gold-metallic" /> Lead Inflow</h3>
                  <span className="text-[10px] font-black text-gold-metallic bg-gold-metallic/10 px-4 py-2 rounded-full uppercase tracking-widest border border-gold-metallic/20">{leads.length} Total</span>
                </div>
                {leads.length === 0 ? (
                  <div className="p-20 text-center"><Phone className="mx-auto mb-4 opacity-10" size={48} /><p className="text-white/20 font-black uppercase tracking-widest text-xs">No leads recorded via site forms</p></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-white/5">
                        <tr className="border-b border-white/5">
                          <th className="text-left p-6 text-[10px] font-black text-white/40 uppercase tracking-widest">#</th>
                          <th className="text-left p-6 text-[10px] font-black text-white/40 uppercase tracking-widest">Prospect Name</th>
                          <th className="text-left p-6 text-[10px] font-black text-white/40 uppercase tracking-widest">Contact Number</th>
                          <th className="text-left p-6 text-[10px] font-black text-white/40 uppercase tracking-widest">Form Source</th>
                          <th className="text-left p-6 text-[10px] font-black text-white/40 uppercase tracking-widest">Arrival Date</th>
                          <th className="text-right p-6 text-[10px] font-black text-white/40 uppercase tracking-widest">Control</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leads.map((lead, i) => (
                          <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                            <td className="p-6 text-white/40 font-bold">{i + 1}</td>
                            <td className="p-2"><Input value={lead.name || ""} onChange={(e) => updateItem(leads, setLeads, i, "name", e.target.value)} className="bg-transparent border-white/10 text-white font-black h-10 w-full" /></td>
                            <td className="p-2"><Input value={lead.phone} onChange={(e) => updateItem(leads, setLeads, i, "phone", e.target.value)} className="bg-transparent border-white/10 text-gold-metallic font-mono h-10 w-full" /></td>
                            <td className="p-2"><Input value={lead.type || ""} onChange={(e) => updateItem(leads, setLeads, i, "type", e.target.value)} className="bg-transparent border-white/10 text-white/60 text-xs h-10 w-full uppercase" /></td>
                            <td className="p-2"><Input value={lead.date || ""} onChange={(e) => updateItem(leads, setLeads, i, "date", e.target.value)} className="bg-transparent border-white/10 text-white/40 text-[11px] h-10 w-full" /></td>
                            <td className="p-6 text-right"><button onClick={() => deleteLead(i)} className="text-red-500/40 hover:text-red-500 p-2 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={18} /></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="p-8 border-t border-white/5 flex justify-end">
                  <Button disabled={saving} onClick={() => saveToFirestore("leads", { items: leads }, "Leads")} className="bg-gold-metallic text-black font-black uppercase tracking-widest text-xs px-12 h-14 rounded-2xl hover:brightness-110 shadow-gold gap-3">
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Save Leads
                  </Button>
                </div>
              </div>
            )}

            {/* APPLICATIONS */}
            {tab === "applications" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="font-heading font-black text-xl text-white flex items-center gap-3 uppercase tracking-widest"><Briefcase size={22} className="text-gold-metallic" /> Talent Pipeline</h3>
                  <span className="text-[10px] font-black text-gold-metallic bg-gold-metallic/10 px-4 py-2 rounded-full uppercase tracking-widest border border-gold-metallic/20">{applications.length} Candidates</span>
                </div>
                {applications.length === 0 ? (
                  <div className="bg-black/40 border border-white/10 rounded-3xl p-20 text-center text-white/20 uppercase tracking-widest text-xs font-black"><Briefcase size={40} className="mx-auto mb-4 opacity-10" /> No Applications Yet</div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {applications.map((app, i) => (
                      <div key={i} className="bg-black/40 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl hover:border-gold-metallic/30 transition-all">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-4">
                            <Input value={app.name} onChange={(e) => updateItem(applications, setApplications, i, "name", e.target.value)} className="bg-white/5 border-white/10 text-white font-black uppercase h-10 w-1/3" placeholder="Name" />
                            <Input value={app.position} onChange={(e) => updateItem(applications, setApplications, i, "position", e.target.value)} className="bg-white/5 border-white/10 text-gold-metallic text-xs font-black uppercase h-10 w-1/3" placeholder="Position" />
                          </div>
                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-bold text-white/40 uppercase tracking-tighter">
                            <span className="flex items-center gap-2"><Phone size={12} className="text-gold-metallic" /><Input value={app.phone} onChange={(e) => updateItem(applications, setApplications, i, "phone", e.target.value)} className="bg-transparent border-white/10 text-white h-8 w-32" /></span>
                            <span className="flex items-center gap-2"><Mail size={12} className="text-gold-metallic" /><Input value={app.email} onChange={(e) => updateItem(applications, setApplications, i, "email", e.target.value)} className="bg-transparent border-white/10 text-white h-8 w-40" /></span>
                            <span className="flex items-center gap-2"><FileText size={12} className="text-gold-metallic" /><Input value={app.resumeName || ""} onChange={(e) => updateItem(applications, setApplications, i, "resumeName", e.target.value)} className="bg-transparent border-white/10 text-white h-8 w-40" placeholder="Resume Link/Name" /></span>
                            <span className="flex items-center gap-2"><MapPin size={12} className="text-gold-metallic" /><Input value={app.date || ""} onChange={(e) => updateItem(applications, setApplications, i, "date", e.target.value)} className="bg-transparent border-white/10 text-white h-8 w-32" /></span>
                          </div>
                        </div>
                        <button onClick={() => deleteApp(i)} className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 transition-all hover:text-white"><Trash2 size={24} /></button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-end pt-8">
                  <Button disabled={saving} onClick={() => saveToFirestore("applications", { items: applications }, "Applications")} className="bg-gold-metallic text-black font-black uppercase tracking-widest text-xs px-12 h-14 rounded-2xl hover:brightness-110 shadow-gold gap-3 animate-shine-slow">
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Save Applications
                  </Button>
                </div>
              </div>
            )}

            {/* CAREER */}
            {tab === "career" && (
              <div className="space-y-12">
                <SectionCard title="Career Hero" icon={Briefcase}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Input value={career.heroHeading} onChange={(e) => setCareer({ ...career, heroHeading: e.target.value })} placeholder="Hero Heading" className="bg-white/5 border-white/10 text-white h-12 rounded-xl font-bold" />
                      <Textarea value={career.heroSubtext} onChange={(e) => setCareer({ ...career, heroSubtext: e.target.value })} placeholder="Hero Subtext" className="bg-white/5 border-white/10 text-white min-h-[100px] rounded-xl text-xs" />
                    </div>
                    <MediaInput value={career.heroImage} folder="career" label="Hero Image" onChange={(url) => setCareer({ ...career, heroImage: url })} />
                  </div>
                </SectionCard>

                <div className="flex justify-end pt-8">
                  <Button disabled={saving} onClick={() => saveToFirestore("career", career, "Career Page")} className="bg-gold-metallic text-black font-black uppercase tracking-widest text-xs px-12 h-14 rounded-2xl hover:brightness-110 shadow-gold gap-3">
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Update Career Hero
                  </Button>
                </div>
              </div>
            )}

            {/* LEADS & APPLICATIONS */}
            {(tab === "leads" || tab === "applications") && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                    {tab === "leads" ? <Phone className="text-gold-metallic" size={32} /> : <Briefcase className="text-gold-metallic" size={32} />}
                    {tab === "leads" ? "Customer Inquiries" : "Job Applications"}
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                       <Filter size={14} /> Filter: Recent
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {(tab === "leads" ? leads : applications).length === 0 ? (
                    <div className="bg-white/[0.02] border border-dashed border-white/10 rounded-3xl p-20 text-center">
                      <p className="text-white/20 font-bold uppercase tracking-widest text-sm">No {tab} found in database</p>
                    </div>
                  ) : (
                    (tab === "leads" ? leads : applications).map((item: any, i: number) => (
                      <div key={i} className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl hover:bg-white/[0.05] transition-all group flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-xl bg-gold-metallic/10 flex items-center justify-center text-gold-metallic font-black text-xl border border-gold-metallic/20">
                            {item.name?.[0] || "?"}
                          </div>
                          <div>
                            <h4 className="text-white font-bold">{item.name}</h4>
                            <p className="text-white/40 text-xs font-medium">{item.email} • {item.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-right">
                             <p className="text-[10px] font-black text-gold-metallic uppercase tracking-widest">{item.date || "New"}</p>
                             <p className="text-white/20 text-[10px] font-bold uppercase">{tab === "leads" ? item.service : item.position}</p>
                          </div>
                          <button onClick={() => {
                            if (tab === "leads") {
                              const updated = leads.filter((_, idx) => idx !== i);
                              setLeads(updated);
                              saveToFirestore("leads", { items: updated }, "Leads List");
                            } else {
                              const updated = applications.filter((_, idx) => idx !== i);
                              setApplications(updated);
                              saveToFirestore("applications", { items: updated }, "Applications List");
                            }
                          }} className="text-white/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* POPUPS */}
            {tab === "popups" && (
              <div className="space-y-12">
                <SectionCard title="Conversion Optimization" icon={Zap}>
                  <div className="space-y-10">
                    <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-6 rounded-2xl">
                       <div className="space-y-1">
                          <h4 className="text-white font-bold uppercase tracking-wider text-sm">Status: {popups.enabled ? "Active" : "Paused"}</h4>
                          <p className="text-white/40 text-xs">When enabled, the lead capture popup appears globally.</p>
                       </div>
                       <button onClick={() => setPopups({ ...popups, enabled: !popups.enabled })} className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${popups.enabled ? "bg-gold-metallic justify-end" : "bg-white/10 justify-start"}`}>
                         <div className={`w-6 h-6 rounded-full ${popups.enabled ? "bg-black shadow-lg" : "bg-white/20"}`} />
                       </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <Input value={popups.heading} onChange={(e) => setPopups({ ...popups, heading: e.target.value })} placeholder="Main Headline" className="bg-white/5 border-white/10 text-white h-14 rounded-2xl px-6 font-black text-lg" />
                        <Textarea value={popups.subtext} onChange={(e) => setPopups({ ...popups, subtext: e.target.value })} placeholder="Supporting Text" className="bg-white/5 border-white/10 text-white min-h-[120px] rounded-2xl p-6 text-sm" />
                        <Input value={popups.buttonText} onChange={(e) => setPopups({ ...popups, buttonText: e.target.value })} placeholder="CTA Button Text" className="bg-white/5 border-white/10 text-gold-metallic h-12 rounded-xl px-6 font-black uppercase tracking-widest text-xs" />
                      </div>
                      <div className="space-y-6">
                        <MediaInput value={popups.image} folder="popups" label="Visual Asset (Image)" onChange={(url) => setPopups({ ...popups, image: url })} />
                        <div className="bg-gold-metallic/5 border border-gold-metallic/10 p-6 rounded-2xl flex items-center gap-4">
                           <Info size={24} className="text-gold-metallic" />
                           <p className="text-white/40 text-[10px] font-medium leading-relaxed uppercase">Optimal image size: 800x1200px. High-contrast construction photography recommended.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <div className="flex justify-end pt-8">
                  <Button disabled={saving} onClick={() => saveToFirestore("popups", popups, "Lead Magnet Configuration")} className="bg-gold-metallic text-black font-black uppercase tracking-widest text-xs px-12 h-14 rounded-2xl hover:brightness-110 shadow-gold gap-3">
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Push Popup Updates
                  </Button>
                </div>
              </div>
            )}

            {/* LEGAL */}
            {tab === "legal" && (
              <div className="space-y-12">
                <SectionCard title="Terms of Engagement" icon={Shield}>
                  <div className="space-y-10">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-gold-metallic uppercase tracking-widest block">Privacy Policy Protocol</label>
                       <Textarea value={legal.privacy} onChange={(e) => setLegal({ ...legal, privacy: e.target.value })} className="bg-white/5 border-white/10 text-white min-h-[300px] rounded-3xl p-8 text-sm font-medium leading-loose" />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-gold-metallic uppercase tracking-widest block">Standard Terms & Conditions</label>
                       <Textarea value={legal.terms} onChange={(e) => setLegal({ ...legal, terms: e.target.value })} className="bg-white/5 border-white/10 text-white min-h-[300px] rounded-3xl p-8 text-sm font-medium leading-loose" />
                    </div>
                  </div>
                </SectionCard>

                <div className="flex justify-end pt-8">
                  <Button disabled={saving} onClick={() => saveToFirestore("legal", legal, "Legal Protocols")} className="bg-gold-metallic text-black font-black uppercase tracking-widest text-xs px-12 h-14 rounded-2xl hover:brightness-110 shadow-gold gap-3">
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Enforce Legal Documentation
                  </Button>
                </div>
              </div>
            )}

            {/* SETTINGS */}
            {tab === "settings" && (
              <div className="space-y-12">
                <SectionCard title="Global Platform Architecture" icon={Settings}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-10">
                      <div>
                         <label className="text-[10px] font-black text-gold-metallic uppercase tracking-widest block mb-4">Official Brand Logo</label>
                         <MediaInput value={settings.logo} folder="branding" label="Primary Logo" onChange={(url) => setSettings({ ...settings, logo: url })} />
                      </div>
                      <div>
                         <label className="text-[10px] font-black text-gold-metallic uppercase tracking-widest block mb-4">Official Contact Matrix</label>
                         <div className="space-y-4">
                            <Input value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} placeholder="Phone" className="bg-white/5 border-white/10 text-white h-12 rounded-xl px-6 font-bold" />
                            <Input value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} placeholder="Email" className="bg-white/5 border-white/10 text-white h-12 rounded-xl px-6 font-bold" />
                         </div>
                      </div>
                      <div>
                         <label className="text-[10px] font-black text-gold-metallic uppercase tracking-widest block mb-4">Headquarters Address</label>
                         <Textarea value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} className="bg-white/5 border-white/10 text-white min-h-[100px] rounded-2xl p-6 text-xs font-medium" />
                      </div>
                    </div>

                    <div className="space-y-10">
                      <div>
                         <label className="text-[10px] font-black text-gold-metallic uppercase tracking-widest block mb-4">Social Ecosystem Links</label>
                         <div className="grid grid-cols-2 gap-4">
                            <Input value={settings.socialLinks.facebook} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, facebook: e.target.value } })} placeholder="Facebook" className="bg-white/5 border-white/10 text-white/40 h-10 rounded-xl px-4 text-[10px]" />
                            <Input value={settings.socialLinks.instagram} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: e.target.value } })} placeholder="Instagram" className="bg-white/5 border-white/10 text-white/40 h-10 rounded-xl px-4 text-[10px]" />
                            <Input value={settings.socialLinks.linkedin} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, linkedin: e.target.value } })} placeholder="LinkedIn" className="bg-white/5 border-white/10 text-white/40 h-10 rounded-xl px-4 text-[10px]" />
                            <Input value={settings.socialLinks.twitter} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, twitter: e.target.value } })} placeholder="Twitter/X" className="bg-white/5 border-white/10 text-white/40 h-10 rounded-xl px-4 text-[10px]" />
                         </div>
                      </div>
                      <div className="bg-gold-metallic/5 border border-gold-metallic/10 p-6 rounded-2xl">
                         <h4 className="text-white font-black uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2"><ArrowUpRight size={12} /> Platform Integrity</h4>
                         <p className="text-white/40 text-[10px] leading-relaxed uppercase">These settings propagate across the Navbar, Footer, and Contact pages globally. Any changes here override local section defaults.</p>
                      </div>
                    </div>
                  </div>
                </SectionCard>

                <div className="flex justify-end pt-8">
                  <Button disabled={saving} onClick={() => saveToFirestore("settings", settings, "Global Environment")} className="btn-gold px-12 h-14 rounded-2xl gap-3 text-xs">
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Push Global Updates
                  </Button>
                </div>
              </div>
            )}

            {/* CITIES */}
            {tab === "cities" && (
              <div className="space-y-12">
                <SectionCard title="Geographic Reach" icon={MapPin}>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {cities.items.map((city: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-xl group">
                          <Input value={city} onChange={(e) => {
                            const updated = [...cities.items];
                            updated[i] = e.target.value;
                            setCities({ items: updated });
                          }} className="bg-transparent border-none text-white font-bold p-0 h-auto focus-visible:ring-0" />
                          <button onClick={() => setCities({ items: cities.items.filter((_, idx) => idx !== i) })} className="text-white/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      <button onClick={() => setCities({ items: [...cities.items, "New City"] })} className="flex items-center justify-center gap-2 border border-dashed border-white/20 p-4 rounded-xl text-white/40 hover:text-gold-metallic hover:border-gold-metallic transition-all text-xs font-bold uppercase tracking-widest">
                        <Plus size={16} /> Add City
                      </button>
                    </div>
                  </div>
                </SectionCard>

                <div className="flex justify-end pt-8">
                  <Button disabled={saving} onClick={() => saveToFirestore("cities", cities, "Service Cities")} className="btn-gold px-12 h-14 rounded-2xl gap-3 text-xs">
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Update Reach
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  </div>
);
};

export default AdminDashboard;
