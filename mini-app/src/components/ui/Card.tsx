import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  animate = true,
  hover = true,
  onClick,
}) => {
  return (
    <div
      className={`
        bg-paper rounded-xl shadow-sm overflow-hidden
        ${hover ? "hover:shadow-md transition-all duration-300" : ""}
        ${animate ? "animate-scale-in" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div className={`p-5 border-b border-border ${className}`}>{children}</div>
  );
};

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return <div className={`p-5 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div className={`p-4 bg-bg/50 border-t border-border ${className}`}>
      {children}
    </div>
  );
};

export default Card;
