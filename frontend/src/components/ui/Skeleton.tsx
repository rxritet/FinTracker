interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: Readonly<SkeletonProps>) {
  return <div className={`animate-pulse rounded-md bg-slate-200 ${className}`} />;
}
