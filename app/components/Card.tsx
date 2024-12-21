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
      <div className="flex items-start gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-gray-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
          />
        </svg>

        <div>
          <h5 className="mb-2 text-xl font-semibold tracking-tight text-gray-900">
            {title}
          </h5>
          {description && <p className="text-gray-600">{description}</p>}
        </div>
      </div>
    </Link>
  );
}
