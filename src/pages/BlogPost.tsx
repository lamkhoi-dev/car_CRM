import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, User, Loader2, ChevronRight } from "lucide-react";
import { useBlogPost, useBlogPosts } from "@/hooks/useBlog";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading } = useBlogPost(id);
  const { data: allPosts = [] } = useBlogPosts();

  const relatedPosts = allPosts
    .filter((p) => p.id !== id)
    .slice(0, 3);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <p className="text-muted-foreground">Không tìm thấy bài viết</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-16 md:pb-8">
      <img
        src={post.image}
        alt={post.title}
        className="h-48 w-full object-cover sm:h-72"
      />

      <div className="container max-w-2xl -mt-6 relative z-10">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-card p-5 card-shadow sm:p-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại
          </button>

          <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {post.category}
          </span>

          <h1 className="mb-3 font-display text-xl font-bold leading-tight sm:text-3xl">
            {post.title}
          </h1>

          <div className="mb-6 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" /> {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {post.readTime}
            </span>
            <span>{post.date}</span>
          </div>

          <div className="prose prose-sm prose-invert max-w-none">
            {post.content.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.article>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">Bài viết liên quan</h2>
              <Link
                to="/blog"
                className="flex items-center gap-1 text-xs font-medium text-primary"
              >
                Xem tất cả <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/blog/${rp.id}`}
                  className="group overflow-hidden rounded-xl bg-card card-shadow"
                >
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={rp.image}
                      alt={rp.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <span className="mb-1 block text-[10px] font-semibold text-primary">
                      {rp.category}
                    </span>
                    <h3 className="line-clamp-2 text-xs font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                      {rp.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default BlogPost;
