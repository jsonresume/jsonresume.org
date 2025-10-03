import Link from 'next/link';
import { FileJson } from 'lucide-react';

/**
 * Logo component
 */
export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Link href="/" className="flex items-center gap-2">
        <FileJson className="w-6 h-6 text-gray-900" />
        <span className="text-lg font-bold text-gray-900">JSON Resume</span>
      </Link>
    </div>
  );
}
