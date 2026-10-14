import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageContent } from "@/hooks/usePageContent";
import { defaultData } from "@/lib/defaults";

const defaultBlogs = defaultData.blogs;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Blogs = () => {
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const { data: blogsData, loading } = usePageContent("blogs", defaultBlogs);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-gold-metallic"><Loader2 className="animate-spin mr-2" /> Loading Makaan Infra...</div>;
  }

  return (
    <div className="pt-20 bg-black min-h-screen">
      <section className="relative py-24 px-4 overflow-hidden group">
        <div className="absolute inset-0 z-0">
        <img 
          src={(blogsData.hero?.image) || defaultBlogs.hero.image} 
          alt="Blogs Hero" 
          className="w-full h-full object-cover scale-105 transition-transform duration-1000 group-hover:scale-100"
        />
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gold-metallic" />
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <motion.h1 className="font-heading font-extrabold text-5xl md:text-7xl text-white mb-6 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            {(blogsData.hero?.heading || defaultBlogs.hero.heading).includes("&") ? (
              <>
                {(blogsData.hero?.heading || defaultBlogs.hero.heading).split("&")[0]} <span className="text-gold-metallic">&</span> {(blogsData.hero?.heading || defaultBlogs.hero.heading).split("&")[1]}
              </>
            ) : (blogsData.hero?.heading || defaultBlogs.hero.heading).includes(" ") ? (
              <>
                {(blogsData.hero?.heading || defaultBlogs.hero.heading).split(" ").slice(0, -1).join(" ")} <span className="text-gold-metallic">{(blogsData.hero?.heading || defaultBlogs.hero.heading).split(" ").slice(-1)}</span>
              </>
            ) : (
              <span className="text-gold-metallic">{(blogsData.hero?.heading || defaultBlogs.hero.heading)}</span>
            )}
          </motion.h1>
          <motion.p className="text-white/90 font-medium max-w-2xl mx-auto text-xl leading-relaxed text-shadow-strong"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          >
            {blogsData.hero?.subtext || defaultBlogs.hero.subtext}
          </motion.p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <AnimatePresence mode="wait">
            {selectedPost ? (
              <motion.article key="detail" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-black border border-gold-metallic/20 rounded-3xl p-5 sm:p-8 md:p-16 shadow-gold-premium"
              >
                <Button variant="ghost" onClick={() => setSelectedPost(null)} className="mb-10 text-gold-metallic gap-3 hover:bg-gold-metallic/10 font-bold uppercase tracking-widest">
                  <ArrowLeft size={20} /> Back to Insights
                </Button>
                <div className="relative h-[200px] sm:h-[250px] md:h-[500px] w-full mb-8 sm:mb-12 rounded-2xl overflow-hidden shadow-gold border border-gold-metallic/10">
                  <img src={selectedPost.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"} alt={selectedPost.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30" />
                </div>
                <div className="max-w-3xl mx-auto">
                  <span className="text-sm font-heading font-black text-gold-metallic uppercase tracking-[0.3em]">{selectedPost.category}</span>
                  <h2 className="font-heading font-black text-4xl md:text-5xl text-white mt-4 mb-6 leading-tight drop-shadow-md">{selectedPost.title}</h2>
                  <p className="text-white/60 text-sm font-bold flex items-center gap-3 mb-12 pb-8 border-b border-gold-metallic/20 uppercase tracking-widest"><Calendar size={18} className="text-gold-metallic" />{selectedPost.date || new Date().toLocaleDateString()}</p>
                  <div className="text-white/90 leading-relaxed text-xl font-medium prose prose-invert max-w-none whitespace-pre-wrap">{selectedPost.content}</div>
                </div>
              </motion.article>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {blogsData.posts.map((post: any, i: number) => (
                  <motion.div key={i}
                    className="bg-black border border-gold-metallic/20 rounded-3xl overflow-hidden shadow-lg hover:shadow-gold-premium transition-all duration-500 cursor-pointer group"
                    onClick={() => setSelectedPost(post)}
                    initial="hidden" whileInView="visible" viewport={{ once: true }} 
                    variants={fadeUp} custom={i}
                    whileHover={{ y: -15, scale: 1.02 }}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img src={post.image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute top-6 left-6">
                        <span className="px-4 py-1.5 bg-gold-metallic text-black rounded-lg text-xs font-heading font-black uppercase tracking-widest shadow-gold">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="font-heading font-black text-2xl text-white mt-0 mb-4 group-hover:text-gold-metallic transition-colors leading-tight uppercase tracking-tight">{post.title}</h3>
                      <p className="text-white/60 font-medium text-base mb-8 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                      <div className="flex items-center justify-between pt-6 border-t border-gold-metallic/10">
                        <span className="text-xs text-white/40 font-black flex items-center gap-2 uppercase tracking-widest"><Calendar size={14} className="text-gold-metallic" />{post.date || new Date().toLocaleDateString()}</span>
                        <span className="text-gold-metallic text-sm font-black group-hover:translate-x-2 transition-transform flex items-center gap-2 uppercase tracking-widest">
                          Read <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Blogs;
