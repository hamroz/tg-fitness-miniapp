import React from "react";

interface SkeletonProps {
  variant?: "text" | "rectangular" | "circular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = "text",
  width,
  height,
  animation = "pulse",
  className = "",
}) => {
  // Base classes for all skeleton variants
  let baseClasses = "bg-gray-200 dark:bg-gray-700";

  // Add animation classes
  if (animation === "pulse") {
    baseClasses += " animate-pulse";
  } else if (animation === "wave") {
    baseClasses += " skeleton-wave";
  }

  // Variant-specific styling
  let variantClasses = "";
  switch (variant) {
    case "text":
      variantClasses = "h-4 rounded w-full";
      break;
    case "rectangular":
      variantClasses = "";
      break;
    case "circular":
      variantClasses = "rounded-full";
      break;
    case "rounded":
      variantClasses = "rounded-lg";
      break;
    default:
      variantClasses = "";
  }

  // Custom dimensions
  const style: React.CSSProperties = {};
  if (width) {
    style.width = typeof width === "number" ? `${width}px` : width;
  }
  if (height) {
    style.height = typeof height === "number" ? `${height}px` : height;
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={style}
      role="status"
      aria-label="Loading..."
    />
  );
};

// Common preset skeletons
export const TextSkeleton: React.FC<Omit<SkeletonProps, "variant">> = (
  props
) => <Skeleton variant="text" {...props} />;

export const CircleSkeleton: React.FC<Omit<SkeletonProps, "variant">> = (
  props
) => <Skeleton variant="circular" {...props} />;

export const RectSkeleton: React.FC<Omit<SkeletonProps, "variant">> = (
  props
) => <Skeleton variant="rectangular" {...props} />;

export const RoundedSkeleton: React.FC<Omit<SkeletonProps, "variant">> = (
  props
) => <Skeleton variant="rounded" {...props} />;

export default Skeleton;
