import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Loader2 } from "lucide-react";
import { useBlogPosts } from "@/hooks/useBlog";

const Blog = () => {
  const { data: blogPosts = [], isLoading } = useBlogPosts();

  return (
    <div className="min-h-screen pb-24 pt-20 md:pb-8">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="mb-1 font-display text-2xl font-bold sm:text-3xl">Blog</h1>
          <p className="text-sm text-muted-foreground">Tin tức, kinh nghiệm & chia sẻ</p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {blogPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={`/blog/${post.id}`}
                  className="group flex flex-col overflow-hidden rounded-xl bg-card card-shadow transition-all hover:card-shadow-hover"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-2.5 py-0.5 text-[10px] font-semibold text-primary-foreground backdrop-blur-sm">
                      {post.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h2 className="mb-1.5 font-display text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-base">
                      {post.title}
                    </h2>
                    <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
