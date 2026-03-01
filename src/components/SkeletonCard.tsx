const SkeletonCard = () => (
  <div className="overflow-hidden rounded-xl bg-card card-shadow">
    <div className="aspect-[16/10] animate-shimmer bg-gradient-to-r from-muted via-secondary to-muted bg-[length:200%_100%]" />
    <div className="space-y-3 p-4">
      <div className="h-5 w-3/4 animate-shimmer rounded bg-gradient-to-r from-muted via-secondary to-muted bg-[length:200%_100%]" />
      <div className="h-4 w-full animate-shimmer rounded bg-gradient-to-r from-muted via-secondary to-muted bg-[length:200%_100%]" />
      <div className="h-4 w-1/2 animate-shimmer rounded bg-gradient-to-r from-muted via-secondary to-muted bg-[length:200%_100%]" />
    </div>
  </div>
);

export default SkeletonCard;
