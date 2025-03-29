import React from "react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type AvatarStatus = "online" | "offline" | "away" | "busy" | "none";

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  className?: string;
  border?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "",
  name,
  size = "md",
  status = "none",
  className = "",
  border = false,
}) => {
  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
  };

  const statusClasses = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    away: "bg-yellow-500",
    busy: "bg-red-500",
    none: "hidden",
  };

  const statusSizes = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
    xl: "w-4 h-4",
  };

  // Generate initials from name
  const getInitials = () => {
    if (!name) return "";

    const nameParts = name.trim().split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }

    return (
      nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const borderClass = border ? "border-2 border-background" : "";

  return (
    <div className="relative inline-flex">
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`
            rounded-full object-cover
            ${sizeClasses[size]}
            ${borderClass}
            ${className}
          `}
        />
      ) : (
        <div
          className={`
            rounded-full bg-accent-light text-accent-dark flex items-center justify-center font-medium
            ${sizeClasses[size]}
            ${borderClass}
            ${className}
          `}
        >
          {getInitials()}
        </div>
      )}

      {status !== "none" && (
        <span
          className={`
            absolute bottom-0 right-0 rounded-full ring-2 ring-background
            ${statusClasses[status]}
            ${statusSizes[size]}
          `}
        />
      )}
    </div>
  );
};

export default Avatar;
