import Link from "next/link";
import { ReactNode } from "react";

interface SectionTitleProps {
  title: string;
  viewAllLink?: string;
  className?: string;
  children?: ReactNode;
}

export function SectionTitle({ 
  title, 
  viewAllLink, 
  className = "",
  children 
}: SectionTitleProps) {
  return (
    <div className={`${viewAllLink ? "flex items-center justify-between" : ""} mb-8 ${className}`}>
      <h3 className="text-3xl font-bold">{title}</h3>
      {children}
      {viewAllLink && (
        <Link href={viewAllLink} className="text-blue-700 hover:text-blue-800 font-medium">
          View All →
        </Link>
      )}
    </div>
  );
}
