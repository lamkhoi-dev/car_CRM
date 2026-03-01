import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, User, Loader2 } from "lucide-react";
import { useBlogPost } from "@/hooks/useBlog";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading } = useBlogPost(id);

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
        <p className="text-muted-foreground">Post not found</p>
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
            <ArrowLeft className="h-4 w-4" /> Back
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
      </div>
    </div>
  );
};

export default BlogPost;
