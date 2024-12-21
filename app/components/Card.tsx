import Link from "next/link";
import clsx from "clsx";

interface CardProps {
  title: string;
  description?: string;
  href: string;
  className?: string;
}

export default function Card({ title, description, href, className }: CardProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "block p-6 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors",
        className
      )}
    >
      <h5 className="mb-2 text-xl font-semibold tracking-tight text-gray-900">
        {title}
      </h5>
      {description && (
        <p className="text-gray-600">
          {description}
        </p>
      )}
    </Link>
  );
}
