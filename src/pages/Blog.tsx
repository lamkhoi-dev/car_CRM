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

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : blogPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/blog/${post.id}`}
                className="group flex gap-4 overflow-hidden rounded-xl bg-card p-3 card-shadow transition-all hover:card-shadow-hover sm:p-4"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-24 w-24 flex-shrink-0 rounded-lg object-cover sm:h-32 sm:w-40"
                  loading="lazy"
                />
                <div className="flex flex-col justify-center">
                  <span className="mb-1 text-xs font-medium text-primary">
                    {post.category}
                  </span>
                  <h2 className="mb-1 font-display text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors sm:text-base">
                    {post.title}
                  </h2>
                  <p className="mb-2 line-clamp-2 text-xs text-muted-foreground hidden sm:block">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
