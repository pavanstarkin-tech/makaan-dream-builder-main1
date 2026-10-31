import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import { Building2, Ruler, HardHat, PenTool, Wrench, Paintbrush, ArrowRight, CheckCircle2, Star, MapPin, Clock, Shield, Users, Award, Quote, Loader2, CalendarCheck, FlaskConical, Hammer, BadgeCheck, TrendingUp, Zap } from "lucide-react";
import CostCalculator from "@/components/CostCalculator";
import { Button } from "@/components/ui/button";
import { usePageContent } from "@/hooks/usePageContent";
import imgCivilConstruction from "@/assets/civil-construction.jpg";
import imgBuildingPlanning from "@/assets/building-planning.jpg";
import imgStructuralConsultancy from "@/assets/structural-consultancy.jpg";
import imgStructuralBlueprint from "@/assets/structural-blueprint.jpg";
import imgProject1 from "@/assets/project-1.jpg";
import imgProject2 from "@/assets/project-2.jpg";
import imgProject3 from "@/assets/project-3.jpg";
import imgProject4 from "@/assets/project-4.jpg";
import imgProject5 from "@/assets/project-5.jpg";
import imgProject6 from "@/assets/project-6.jpg";
import imgLakeview from "@/assets/lakeview.png";
import imgTechpark from "@/assets/techpark.png";
import imgLakeviewV2 from "@/assets/lakeview_v2.png";
import imgTechparkV2 from "@/assets/techpark_v2.png";
import imgModernPlanning from "@/assets/modern-planning-user.jpg";
import imgConstructionWorkers from "@/assets/construction-workers.jpg";
import imgElectricalPlumbing from "@/assets/electrical-plumbing.jpg";

const FALLBACK_IMG = "/placeholder.svg";
const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = FALLBACK_IMG; };

// Default Data Fallbacks (matching AdminDashboard)
const defaultProjects = {
  heroHeading: "Our Projects",
  heroSubtext: "Discover our landmark developments.",
  items: [
    // 6 Ongoing Projects
    { title: "Skyline Residency", category: "Ongoing", location: "Bargarh", image: imgProject1 },
    { title: "Riverside Complex", category: "Ongoing", location: "Jharsuguda", image: imgCivilConstruction },
    { title: "Sapphire Towers", category: "Ongoing", location: "Sambalpur", image: imgProject4 },
    { title: "Oasis Commercial Center", category: "Ongoing", location: "Bhubaneswar", image: imgProject5 },
    { title: "Grand Plaza Mall", category: "Ongoing", location: "Cuttack", image: imgProject6 },
    { title: "Metro Hub Expansion", category: "Ongoing", location: "Rourkela", image: imgConstructionWorkers },
    // 6 Completed Projects
    { title: "Sunrise Apartments", category: "Completed", location: "Bargarh", image: imgProject2 },
    { title: "Green Valley Villas", category: "Completed", location: "Sambalpur", image: imgProject3 },
    { title: "Golden Gate Estate", category: "Completed", location: "Jharsuguda", image: imgModernPlanning },
    { title: "Heritage Corporate Park", category: "Completed", location: "Bhubaneswar", image: imgStructuralBlueprint },
    { title: "Royal Pearl Society", category: "Completed", location: "Cuttack", image: imgTechpark },
    { title: "Elite Business Center", category: "Completed", location: "Rourkela", image: imgElectricalPlumbing },
    // 6 Upcoming Projects
    { title: "Royal Commercial Park", category: "Upcoming", location: "Rourkela", image: imgBuildingPlanning },
    { title: "Tech Hub Odisha", category: "Upcoming", location: "Cuttack", image: imgStructuralConsultancy },
    { title: "Lakeview Township", category: "Upcoming", location: "Bhubaneswar", image: imgLakeview },
    { title: "Paradise Resort & Spa", category: "Upcoming", location: "Puri", image: imgLakeviewV2 },
    { title: "Future Tech Park", category: "Upcoming", location: "Bhubaneswar", image: imgTechparkV2 },
    { title: "Smart City Pavilion", category: "Upcoming", location: "Bargarh", image: imgProject1 }
  ]
};

import { defaultData } from "@/lib/defaults";

const defaultHome = defaultData.home;

const defaultServices = {
  hero: { heading: "Our Services", subtext: "Expert engineering solutions.", image: imgStructuralConsultancy },
  cards: [
    { title: "Civil Construction", desc: "Complete civil solutions.", image: imgCivilConstruction, icon: "Building2" },
    { title: "Building Planning", desc: "Modern architectural planning.", image: imgBuildingPlanning, icon: "HardHat" },
    { title: "Structural Consultancy", desc: "Expert structural guidance.", image: imgStructuralConsultancy, icon: "Ruler" },
    { title: "Electrical & Plumbing", desc: "Seamless facility integration.", image: imgElectricalPlumbing, icon: "Wrench" },
    { title: "Interior Finishing", desc: "Premium aesthetic details.", image: imgConstructionWorkers, icon: "Paintbrush" },
    { title: "Project Management", desc: "End-to-end execution.", image: imgProject1, icon: "Users" }
  ]
};

const defaultBlogs = {
  hero: { heading: "Insights & News", subtext: "Latest from the construction world.", image: "https://images.unsplash.com/photo-1516216628859-9bccecab13ca" },
  posts: [
    { title: "5 Tips for Planning Your Dream Home", category: "Planning", date: "Mar 10, 2026", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", excerpt: "Building a home is one of the biggest decisions. Here are the top tips to plan effectively." },
    { title: "Modern Architectural Trends in 2026", category: "Architecture", date: "Feb 28, 2026", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9", excerpt: "Discover the latest trends in architectural design, from sustainable materials to smart home integration." },
    { title: "The Importance of Quality Foundation", category: "Construction", date: "Feb 15, 2026", image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5", excerpt: "A strong foundation is critical. Learn why cutting corners here can lead to disaster later." }
  ]
};

const defaultSettings = {
  logo: "https://i.ibb.co/hxVp0VKt/Royal-Developers-Metallic-Emblem.png",
  phone: "+91 89262 77881",
  email: "info@royaldevelopers.com",
  socialLinks: { facebook: "", instagram: "", linkedin: "", twitter: "" }
};

const getIcon = (name: string) => {
  const icons: Record<string, any> = { Award, Users, Shield, Clock, Star, CheckCircle2, Building2, HardHat, Ruler, Paintbrush, Wrench, PenTool, Zap, TrendingUp, Hammer, BadgeCheck, FlaskConical, CalendarCheck };
  return icons[name] || CheckCircle2;
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({ opacity: 1, y: 0, scale: 1, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" } }),
};

const AutoScrollContainer = ({ children, speed = 1, className = "" }: { children: React.ReactNode, speed?: number, className?: string }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationFrameId: number;
    const scroll = () => {
      if (!isHovered) {
        el.scrollLeft += speed;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft -= el.scrollWidth / 2;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, speed]);

  return (
    <div 
      ref={scrollRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      className={`flex overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {children}
    </div>
  );
};

const Index = () => {
  const [heroIdx, setHeroIdx] = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  // Fetch dynamic content from Firestore
  const { data: homeData, loading: homeLoading, error: homeError } = usePageContent("home", defaultHome);
  const { data: projectsData, loading: projectsLoading, error: projectsError } = usePageContent("projects", defaultData.projects);
  const { data: servicesData, loading: servicesLoading, error: servicesError } = usePageContent("services", defaultData.services);
  const { data: blogsData, loading: blogsLoading, error: blogsError } = usePageContent("blogs", defaultData.blogs);
  const { data: citiesData, loading: citiesLoading, error: citiesError } = usePageContent("cities", defaultData.cities);
  const { data: settingsData, loading: settingsLoading, error: settingsError } = usePageContent("settings", defaultData.settings);

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  const currentHome = homeData || defaultHome;
  const heroImages = (currentHome.hero?.images?.length > 0) ? currentHome.hero.images : (defaultHome.hero?.images || []);
  const testimonials = (currentHome.testimonial?.length > 0) ? currentHome.testimonial : (defaultHome.testimonial || []);

  useEffect(() => {
    if (!heroImages || heroImages.length === 0) return;
    const interval = setInterval(() => setHeroIdx((prev) => (prev + 1) % heroImages.length), 5000);
    return () => clearInterval(interval);
  }, [heroImages]);

  useEffect(() => {
    if (!testimonials || testimonials.length === 0) return;
    const interval = setInterval(() => setTestimonialIdx((prev) => (prev + 1) % testimonials.length), 8000);
    return () => clearInterval(interval);
  }, [testimonials]);

  const hasError = homeError || projectsError || servicesError || blogsError || settingsError || citiesError;

  if (homeLoading || projectsLoading || servicesLoading || blogsLoading || citiesLoading || settingsLoading) {
    return (
    <div className="min-h-screen bg-black overflow-x-hidden font-sans selection:bg-gold-metallic/30 selection:text-white">
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-gold-metallic mr-2" /> <span className="text-white font-heading font-bold">Loading Royal Developers...</span>
      </div>
    </div>
    );
  }

  const portfolio = projectsData?.items || [];
  const ongoingProjects = portfolio.filter((p: any) => p.category === "Ongoing");
  const completedProjects = portfolio.filter((p: any) => p.category === "Completed");
  const upcomingProjects = portfolio.filter((p: any) => p.category === "Upcoming");

  return (
    <div className="min-h-screen bg-black overflow-x-hidden font-sans selection:bg-gold-metallic/30 selection:text-white">
      {(!isOnline || hasError) && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-red-500/10 border border-red-500/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-3 animate-bounce shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <div className={`w-2 h-2 rounded-full ${!isOnline ? 'bg-red-500' : 'bg-orange-500'} animate-pulse`} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/80">
            {!isOnline ? 'Offline Mode • Local Data' : `Sync Paused: ${[
              homeError && 'Home',
              projectsError && 'Projects',
              servicesError && 'Services',
              blogsError && 'Blogs',
              citiesError && 'Cities',
              settingsError && 'Settings'
            ].filter(Boolean).join(', ')} failed`}
          </span>
        </div>
      )}
      {/* Hero Video Background */}
      <section className="relative min-h-0 md:min-h-[100dvh] flex items-center justify-center overflow-hidden pt-28 sm:pt-32 md:pt-36 lg:pt-28 pb-12 sm:pb-16 md:py-28">
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden bg-black">
          <iframe
            src={currentHome.hero?.videoUrl || "https://www.youtube.com/embed/4BzjUq921Y4?autoplay=1&mute=1&controls=0&loop=1&playlist=4BzjUq921Y4&playsinline=1&showinfo=0&rel=0&modestbranding=1"}
            title="Royal Developers Construction"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-80"
            style={{
              width: "max(100%, 177.78vh)",
              height: "max(100%, 56.25vw)",
              minWidth: "100%",
              minHeight: "100%",
            }}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gold-metallic" />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            className="flex justify-center mt-4 sm:mt-1 mb-2 sm:mb-4"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1, y: [0, -4, 0] }}
            transition={{
              opacity: { delay: 0.1, duration: 0.8 },
              scale: { delay: 0.1, duration: 0.8 },
              y: { repeat: Infinity, duration: 5, ease: "easeInOut" }
            }}
          >
            <div className="flex items-center justify-center py-2">
              <img
                src={settingsData?.logo && settingsData.logo !== "/logo.png" && settingsData.logo !== "logo.png" && !settingsData.logo.includes("erasebg-transformed-19")
                  ? settingsData.logo
                  : "https://i.ibb.co/hxVp0VKt/Royal-Developers-Metallic-Emblem.png"
                }
                alt="Royal Developers Logo"
                className="h-32 sm:h-48 md:h-64 lg:h-72 w-auto max-w-[85vw] object-contain drop-shadow-[0_0_50px_rgba(212,175,55,0.45)] hover:scale-105 transition-transform duration-500 cursor-pointer"
              />
            </div>
          </motion.div>
          <motion.div
            className="inline-block mb-4 sm:mb-6 px-4 py-1.5 sm:px-6 sm:py-3 rounded-full bg-gold-metallic/10 border border-gold-metallic/40"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
          >
            <span className="font-heading font-black text-base sm:text-xl md:text-2xl text-gold-metallic tracking-widest uppercase">Plan Better. Build Better.</span>
          </motion.div>
          <motion.h2 className="font-heading font-bold text-lg sm:text-xl md:text-2xl text-white mb-2 sm:mb-4 drop-shadow-2xl text-shadow-strong"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
          >
            {homeData.hero.heading}
          </motion.h2>
          <motion.p className="text-white/90 font-medium text-sm sm:text-base md:text-lg mb-6 sm:mb-10 max-w-2xl mx-auto leading-relaxed text-shadow-strong"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          >
            {homeData.hero.subtext}
          </motion.p>
          <motion.div className="flex gap-3 justify-center flex-col sm:flex-row flex-wrap"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          >
            {homeData.hero.buttons?.map((btn: any, i: number) => (
              <Button
                key={i}
                asChild
                className={i === 0
                  ? "bg-gold-metallic text-black font-heading font-black px-7 py-5 text-sm shadow-gold hover:brightness-110 animate-shine"
                  : i === 1
                  ? "bg-white text-black font-heading font-black px-7 py-5 text-sm hover:bg-white/90"
                  : "bg-transparent border-2 border-gold-metallic text-gold-metallic font-heading font-black px-7 py-5 text-sm hover:bg-gold-metallic/10"
                }
              >
                <Link to={btn.link} className="flex items-center gap-2">
                  {i === 1 && <CalendarCheck size={16} />}
                  {btn.text}
                  {i === 0 && <ArrowRight size={16} />}
                </Link>
              </Button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="min-h-[70dvh] flex flex-col justify-center py-16 sm:py-20 md:py-24 px-4 bg-black border-b border-gold-metallic/20 relative overflow-hidden w-full max-w-full">
        <div className="container mx-auto max-w-5xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center w-full">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="w-full">
              <span className="text-gold-metallic font-heading font-black text-xs tracking-[0.4em] uppercase block mb-6">ESTABLISHED 2020</span>
              <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-5xl text-white mt-2 mb-6 md:mb-8 uppercase tracking-tight break-words">
                {homeData.aboutPreview.heading.includes(" ") ? (
                  <>
                    {homeData.aboutPreview.heading.split(" ").slice(0, -1).join(" ")} <span className="text-gold-metallic">{homeData.aboutPreview.heading.split(" ").slice(-1)}</span>
                  </>
                ) : (
                  <span className="text-gold-metallic">{homeData.aboutPreview.heading}</span>
                )}
              </h2>
              <p className="text-white/70 leading-relaxed mb-8 text-sm sm:text-base md:text-lg font-medium italic border-l-2 border-gold-metallic/30 pl-4 sm:pl-6 max-w-full break-words">
                {homeData.aboutPreview.description}
              </p>
              <Button asChild className="w-full sm:w-auto inline-flex items-center justify-center bg-gold-metallic text-black font-heading font-black px-8 sm:px-10 py-5 sm:py-7 text-xs sm:text-sm uppercase tracking-widest rounded-xl hover:brightness-110 shadow-gold">
                <Link to="/about">Our Philosophy</Link>
              </Button>
            </motion.div>
            <motion.div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 w-full max-w-full" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              {(homeData.stats || []).map((s: any) => (
                <div key={s.label} className="bg-white/5 border border-gold-metallic/10 rounded-2xl p-4 sm:p-6 md:p-8 text-center hover:border-gold-metallic/40 transition-all group flex flex-col justify-center items-center min-w-0 overflow-hidden shadow-lg">
                  <div className="font-heading font-black text-xl sm:text-3xl md:text-4xl text-gold-metallic group-hover:scale-110 transition-transform tracking-tight leading-none break-all sm:break-normal">{s.val}</div>
                  <div className="text-white/50 text-[9px] sm:text-[10px] uppercase font-black tracking-wider sm:tracking-widest mt-2 leading-tight text-center break-words">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="min-h-[75dvh] flex flex-col justify-center py-16 sm:py-20 md:py-24 px-4 bg-gradient-to-br from-[#0a0a0b] via-[#111114] to-[#0a0a0b] relative overflow-hidden border-y border-gold-metallic/20">
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gold-metallic/5 blur-[120px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], x: ["-30%", "-50%", "-30%"], y: ["-40%", "-20%", "-40%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
        />
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-gold-metallic font-heading font-bold text-sm tracking-[0.2em] px-5 py-2 rounded-full border border-gold-metallic/30 bg-gold-metallic/10 backdrop-blur-md relative inline-block">
              {homeData.servicesLabel || "WHAT WE DO"}
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gold-metallic/30 rounded-full" />
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mt-2">{homeData.servicesTitle}</h2>
          </div>
          <AutoScrollContainer speed={1} className="gap-6 pb-8">
            {[...servicesData.cards, ...servicesData.cards, ...servicesData.cards, ...servicesData.cards].map((s: any, i: number) => {
              const ServiceIcon = getIcon(s.icon || "Building2");
              return (
                <motion.div key={i}
                  className="relative group shrink-0 w-[260px] h-[180px] overflow-hidden rounded-2xl shadow-lg cursor-pointer"
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                >
                  <img src={s.image || imgCivilConstruction} alt={s.title} onError={handleImgError} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gold-metallic/60 group-hover:bg-gold-metallic/40 transition-colors duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center mb-3 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-500 shadow-lg shadow-accent/20">
                      <ServiceIcon className="text-white font-bold" size={16} />
                    </div>
                    <h3 className="font-heading font-black text-sm text-white mb-1 group-hover:text-gold-metallic transition-colors drop-shadow-xl text-shadow-strong leading-tight">{s.title}</h3>
                    <p className="text-white/80 text-[10px] opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 leading-tight drop-shadow-md text-shadow-strong line-clamp-2">
                      {s.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AutoScrollContainer>
          <div className="text-center mt-12">
            <Button asChild className="bg-black/50 border border-gold-metallic/30 text-gold-metallic hover:bg-gold-metallic/10 font-heading font-black px-10 py-7 text-sm uppercase tracking-widest rounded-xl transition-all shadow-gold">
              <Link to="/services">Explore All Capabilities <ArrowRight className="ml-2" size={16} /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="min-h-[75dvh] flex flex-col justify-center py-16 sm:py-20 md:py-24 px-4 bg-black relative overflow-hidden border-y border-gold-metallic/20">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-gold-metallic font-heading font-bold text-sm tracking-[0.2em] px-5 py-2 rounded-full border border-gold-metallic/30 bg-gold-metallic/10 backdrop-blur-md">
              {homeData.whyChooseLabel || "WHY CHOOSE US"}
            </span>
            <h2 className="font-heading font-extrabold text-4xl md:text-5xl text-white mt-6 mb-6 tracking-tight">
              {homeData.whyChooseTitle || "Experience Excellence"}
            </h2>
            <div className="w-24 h-1.5 bg-gold-metallic mx-auto rounded-full" />
          </div>
          <AutoScrollContainer speed={1} className="gap-6 pb-8 px-4 md:px-0">
            {[...homeData.whyChooseUs, ...homeData.whyChooseUs, ...homeData.whyChooseUs, ...homeData.whyChooseUs].map((item: any, i: number) => {
              const ItemIcon = getIcon(item.icon || "CheckCircle2");
              return (
                <motion.div key={i}
                  className="shrink-0 w-[300px] bg-white/5 border border-gold-metallic/20 rounded-2xl p-6 hover:border-gold-metallic hover:shadow-2xl hover:shadow-gold-metallic/20 transition-all duration-500 group"
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                  whileHover={{ y: -5 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gold-metallic flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
                    <ItemIcon className="text-black" size={24} />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-gold-metallic transition-colors">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-xs">{item.desc}</p>
                </motion.div>
              );
            })}
          </AutoScrollContainer>
        </div>
      </section>

      {/* Quality & Trust Section */}
      <section className="min-h-[80dvh] flex flex-col justify-center py-16 sm:py-20 md:py-24 px-4 bg-[#050505] border-y border-gold-metallic/20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold-metallic/5 blur-[100px]" />
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-gold-metallic font-heading font-black text-xs tracking-[0.4em] uppercase block mb-4">QUALITY ASSURANCE</span>
            <h2 className="font-heading font-black text-4xl md:text-5xl text-white uppercase tracking-tighter">Built to <span className="text-gold-metallic">Last</span></h2>
            <p className="text-white/50 mt-4 max-w-xl mx-auto text-sm leading-relaxed">Every project undergoes rigorous quality control, structural testing and precision finishing — because your trust is our foundation.</p>
            <div className="w-16 h-1 bg-gold-metallic mx-auto mt-6 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: BadgeCheck, title: "Quality Control", desc: "Every material is ISI-certified. We conduct stage-wise inspections — from foundation to finishing — with zero compromise on standards.", badge: "ISO Aligned" },
              { icon: FlaskConical, title: "Structural Testing", desc: "Load testing, soil testing, concrete cube strength tests and structural audits are conducted before and after construction milestones.", badge: "Tested & Certified" },
              { icon: Hammer, title: "Renovation Ready", desc: "Expert renovation and retrofitting services for existing buildings. We strengthen structures, revamp interiors and extend building life.", badge: "Specialists" },
              { icon: Shield, title: "Safety First", desc: "All sites follow strict safety protocols. Helmets, scaffolding, electrical safety and site management are non-negotiable at Royal Developers Raj Lakshman.", badge: "Safe Sites" },
              { icon: TrendingUp, title: "On-Time Delivery", desc: "Milestone-based project tracking with weekly updates. We maintain an on-time delivery record across 50+ projects.", badge: "Timeline Bound" },
              { icon: Users, title: "Trusted by Developers", desc: "Preferred engineering partner for real-estate developers, builders and industrialists across Odisha.", badge: "Developer Partner" },
            ].map((item, i) => (
              <motion.div key={i}
                className="bg-white/5 border border-gold-metallic/15 rounded-2xl p-8 hover:border-gold-metallic/50 transition-all duration-500 group relative"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                whileHover={{ y: -5 }}
              >
                <span className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest bg-gold-metallic/10 text-gold-metallic px-3 py-1 rounded-full border border-gold-metallic/20">{item.badge}</span>
                <div className="w-14 h-14 rounded-2xl bg-gold-metallic/10 border border-gold-metallic/20 flex items-center justify-center mb-6 group-hover:bg-gold-metallic transition-all duration-500">
                  <item.icon className="text-gold-metallic group-hover:text-black transition-colors" size={26} />
                </div>
                <h3 className="font-heading font-black text-lg text-white mb-3 group-hover:text-gold-metallic transition-colors">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-16 flex flex-wrap justify-center gap-4">
            {["Licensed Engineers", "5+ Years Experience", "50+ Projects Delivered", "100% Transparency", "ISI Materials Only", "Site Safety Guaranteed"].map((t, i) => (
              <div key={i} className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-gold-metallic/20">
                <CheckCircle2 size={14} className="text-gold-metallic shrink-0" />
                <span className="text-white/70 text-xs font-bold uppercase tracking-wider">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Strip */}
      <section className="py-16 px-4 bg-gold-metallic relative overflow-hidden">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.05)_0px,rgba(0,0,0,0.05)_1px,transparent_1px,transparent_10px)]" />
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <p className="text-black/60 font-black text-xs uppercase tracking-[0.3em] mb-2">Construction Pricing</p>
              <h2 className="font-heading font-black text-3xl md:text-4xl text-black">Starting from <span className="text-black/80">₹1,200 / sqft</span></h2>
              <p className="text-black/70 text-sm font-bold mt-2">Transparent pricing. No hidden costs. Customized to your project.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              {[
                { tier: "Basic", price: "₹1,200", desc: "Solid construction" },
                { tier: "Premium", price: "₹1,800", desc: "Enhanced finishing" },
                { tier: "Luxury", price: "₹2,500", desc: "Top-grade materials" },
              ].map((p, i) => (
                <div key={i} className={`px-6 py-4 rounded-2xl text-center border-2 ${i === 1 ? 'bg-black text-gold-metallic border-black' : 'bg-gold-metallic/20 text-black border-black/20'}`}>
                  <div className="font-heading font-black text-xs uppercase tracking-widest mb-1">{p.tier}</div>
                  <div className="font-heading font-black text-2xl">{p.price}<span className="text-xs font-bold">/sqft</span></div>
                  <div className="text-xs font-bold mt-1 opacity-70">{p.desc}</div>
                </div>
              ))}
            </div>
            <a
              href="https://wa.me/918926277881?text=Hi%2C%20I%27d%20like%20to%20get%20a%20custom%20construction%20quote."
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-black text-white font-heading font-black px-8 py-4 rounded-2xl hover:bg-black/80 transition-all shadow-lg shrink-0"
            >
              Get Custom Quote <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {[

        { title: "Ongoing Projects", label: "ACTIVE SITES", projects: ongoingProjects, style: "bg-black text-white border-b border-gold-metallic/10", cardStyle: "border-gold-metallic/10 bg-white/5" },
        { title: "Completed Projects", label: "SUCCESS STORIES", projects: completedProjects, style: "bg-[#050505] text-white border-b border-gold-metallic/10", cardStyle: "border-gold-metallic/10 bg-white/5" },
        { title: "Future Projects", label: "THE HORIZON", projects: upcomingProjects, style: "bg-black text-white", cardStyle: "border-gold-metallic/10 bg-white/5" }
      ].map((section, idx) => section.projects.length > 0 && (
        <section key={idx} className={`min-h-[60dvh] flex flex-col justify-center py-16 sm:py-20 md:py-24 px-4 ${section.style}`}>
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <span className="text-gold-metallic font-heading font-black text-xs tracking-[0.4em] uppercase block mb-4">{section.label}</span>
              <h2 className="font-heading font-black text-4xl md:text-5xl uppercase tracking-tighter text-white">{section.title}</h2>
              <div className="w-16 h-1 bg-gold-metallic mx-auto mt-6 rounded-full" />
            </div>
            <AutoScrollContainer speed={1} className="gap-6 pb-8 max-w-6xl mx-auto px-4">
              {[...section.projects, ...section.projects, ...section.projects, ...section.projects].map((p: any, i: number) => (
                <motion.div key={i} className={`group relative shrink-0 w-[260px] h-[180px] overflow-hidden rounded-2xl border ${section.cardStyle} hover:border-gold-metallic/40 transition-all duration-500`}
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                >
                  <img src={p.image || imgProject1} alt={p.title} onError={handleImgError} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-3 right-3 z-20">
                    <span className="text-[9px] font-black uppercase bg-gold-metallic text-black px-3 py-1 rounded-md shadow-gold">{p.category}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 z-10 transition-transform duration-500 group-hover:-translate-y-1">
                    <h3 className="font-heading font-black text-sm text-white uppercase tracking-tight mb-1 group-hover:text-gold-metallic transition-colors line-clamp-1">{p.title}</h3>
                    <p className="text-white/60 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5"><MapPin size={10} className="text-gold-metallic" />{p.location}</p>
                  </div>
                </motion.div>
              ))}
            </AutoScrollContainer>
          </div>
        </section>
      ))}

      {/* Cost Calculator Section */}
      <section className="min-h-[85dvh] flex flex-col justify-center py-16 sm:py-20 md:py-24 px-4 bg-black border-y border-gold-metallic/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-metallic/5 rounded-full blur-[120px]" />
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold-metallic font-heading font-black text-xs tracking-[0.4em] uppercase block mb-4">PLAN YOUR BUDGET</span>
            <h2 className="font-heading font-black text-4xl md:text-5xl text-white uppercase tracking-tighter">Cost <span className="text-gold-metallic">Calculator</span></h2>
            <div className="w-16 h-1 bg-gold-metallic mx-auto mt-6 rounded-full" />
          </div>
          <div className="max-w-4xl mx-auto bg-white/5 border border-gold-metallic/20 rounded-3xl p-3 sm:p-6 md:p-10 shadow-gold relative overflow-hidden">
             <CostCalculator />
          </div>
        </div>
      </section>

      {/* Cities We Serve */}
      <section className="min-h-[65dvh] flex flex-col justify-center py-16 sm:py-20 md:py-24 px-4 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gold-metallic" />
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="text-white font-heading font-bold text-sm tracking-[0.3em] px-6 py-2 rounded-full border border-gold-metallic/50 bg-gold-metallic/10">OUR REACH</span>
            <h2 className="font-heading font-extrabold text-4xl md:text-6xl text-gold-metallic mt-8 mb-4 drop-shadow-lg">Cities We Serve</h2>
            <div className="w-24 h-1.5 bg-white mx-auto rounded-full" />
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {citiesData.items.map((city: string, i: number) => (
              <motion.div key={i}
                className="bg-white/10 backdrop-blur-md border border-gold-metallic/30 rounded-2xl px-8 py-6 text-center hover:border-gold-metallic hover:bg-gold-metallic/10 transition-all duration-500 shadow-gold group"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                whileHover={{ y: -10, scale: 1.05 }}
              >
                <motion.div 
                  className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center mx-auto mb-4 border border-gold-metallic/50 shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: i * 0.2 }}
                >
                  <MapPin className="text-[#D4AF37]" size={24} />
                </motion.div>
                <span className="text-white font-heading font-bold text-lg tracking-widest">{city}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="min-h-[85dvh] flex flex-col justify-center py-16 sm:py-20 md:py-24 px-4 bg-black border-y border-gold-metallic/20 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gold-metallic/5 blur-[100px]" />
          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="text-center mb-16">
              <span className="text-gold-metallic font-heading font-black text-xs tracking-[0.4em] uppercase block mb-4">TESTIMONIALS</span>
              <h2 className="font-heading font-black text-4xl md:text-5xl text-white uppercase tracking-tighter">Voices Of Trust</h2>
            </div>
            <motion.div className="bg-white/5 border border-gold-metallic/20 rounded-3xl p-10 md:p-16 text-center shadow-gold relative"
              key={testimonialIdx} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            >
              <Quote className="text-gold-metallic mx-auto mb-8 opacity-40" size={48} />
              <p className="text-white text-xl md:text-2xl leading-relaxed mb-10 italic font-medium">"{testimonials[testimonialIdx].content}"</p>
              <div className="flex justify-center gap-2 mb-6">
                {Array.from({ length: testimonials[testimonialIdx].rating || 5 }).map((_, i) => (
                  <Star key={i} className="text-gold-metallic fill-gold-metallic" size={20} />
                ))}
              </div>
              <div className="pt-6 border-t border-white/5 inline-block">
                <p className="font-heading font-black text-2xl text-gold-metallic uppercase tracking-widest mb-1">{testimonials[testimonialIdx].name}</p>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">{testimonials[testimonialIdx].role}</p>
              </div>
            </motion.div>
            <div className="flex gap-3 justify-center mt-12">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIdx(i)} className={`h-1.5 transition-all duration-500 rounded-full ${testimonialIdx === i ? "bg-gold-metallic w-12" : "bg-white/10 w-4"}`} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Preview */}
      <section className="min-h-[75dvh] flex flex-col justify-center py-16 sm:py-20 md:py-24 px-4 bg-black border-y border-gold-metallic/20">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <span className="text-gold-metallic font-heading font-black text-xs tracking-[0.4em] uppercase block mb-4">INSIGHTS & NEWS</span>
            <h2 className="font-heading font-black text-4xl md:text-5xl text-white uppercase tracking-tighter">Architectural <span className="text-gold-metallic">Journal</span></h2>
            <div className="w-16 h-1 bg-gold-metallic mx-auto mt-6 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {blogsData.posts.slice(0, 3).map((post: any, i: number) => (
              <motion.div key={i}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-gold-metallic/40 transition-all duration-500 group cursor-pointer shadow-xl"
                variants={fadeUp} whileHover={{ y: -12 }} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={post.image || imgProject2} alt={post.title} onError={handleImgError} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 bg-gold-metallic text-black text-[10px] font-black uppercase tracking-widest rounded-lg shadow-gold">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="font-heading font-black text-xl text-white uppercase tracking-tight mb-4 group-hover:text-gold-metallic transition-colors leading-tight">{post.title}</h3>
                  <p className="text-white/40 text-sm mb-8 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{post.date || new Date().toLocaleDateString()}</span>
                    <Link to="/blogs" className="text-gold-metallic text-xs font-black uppercase tracking-widest hover:text-white transition-all flex items-center gap-2 group/btn">
                      READ ENTRY <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-16">
            <Button asChild className="bg-white/5 border border-gold-metallic/20 text-gold-metallic hover:bg-gold-metallic hover:text-black font-heading font-black px-12 py-8 text-sm uppercase tracking-[0.3em] rounded-xl transition-all shadow-gold">
              <Link to="/blogs">View All Articles</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative min-h-[75dvh] flex flex-col justify-center py-20 sm:py-24 md:py-28 px-4 overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <img src={homeData.cta?.image || defaultHome.cta.image} alt="Construction" onError={handleImgError} className="w-full h-full object-cover scale-110 transition-transform duration-1000 group-hover:scale-100 opacity-40" />
          <div className="absolute inset-0 bg-black/80" />
          <div className="absolute inset-0 border-y-2 border-gold-metallic/20" />
        </div>
        
        <div className="container mx-auto text-center max-w-3xl relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } } }}>
            <span className="text-gold-metallic font-heading font-bold text-sm tracking-[0.4em] mb-6 block uppercase">START YOUR JOURNEY</span>
            <h2 className="font-heading font-extrabold text-4xl md:text-7xl text-white mb-8 leading-tight text-shadow-strong">
              {(homeData.cta?.heading || defaultHome.cta?.heading)?.includes(" ") ? (
                <>
                  {(homeData.cta?.heading || defaultHome.cta?.heading).split(" ").slice(0, -1).join(" ")} <span className="text-gold-metallic">{(homeData.cta?.heading || defaultHome.cta?.heading).split(" ").slice(-1)}</span>
                </>
              ) : (
                <span className="text-gold-metallic">{homeData.cta?.heading || defaultHome.cta?.heading}</span>
              )}
            </h2>
            <div className="w-20 h-2 bg-gold-metallic mx-auto rounded-full shadow-gold-premium mb-12" />
            <p className="text-slate-300 mb-12 text-lg md:text-xl leading-relaxed">
              {homeData.cta?.subtext || defaultHome.cta?.subtext}
            </p>
            <div className="flex gap-4 sm:gap-8 justify-center flex-col sm:flex-row flex-wrap">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
                <Button asChild className="btn-gold hover:brightness-125 font-heading font-extrabold px-6 py-4 md:px-12 md:py-8 text-base md:text-xl rounded-2xl shadow-gold-premium transition-all animate-shine border-none w-full sm:w-auto">
                   <a href={`tel:${(settingsData.phone || defaultSettings.phone).replace(/\s+/g, '')}`}>CALL NOW</a>
                 </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }}>
                <Button asChild variant="outline" className="border-gold-metallic text-gold-metallic hover:bg-gold-metallic hover:text-black font-heading font-extrabold px-6 py-4 md:px-12 md:py-8 text-base md:text-xl rounded-2xl transition-all backdrop-blur-sm w-full sm:w-auto">
                  <a href={`https://wa.me/${(settingsData.phone || defaultSettings.phone).replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer">WHATSAPP</a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
      </section>
    </div>
  );
};

export default Index;
