'use client';

import Link from 'next/link';
import { ArrowLeft, LayoutGrid } from 'lucide-react';

export default function SwipeHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 h-14">
        <Link
          href="/pathways"
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Back</span>
        </Link>

        <h1 className="text-lg font-semibold text-gray-900">Job Swipe</h1>

        <Link
          href="/pathways"
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          title="View Graph"
        >
          <LayoutGrid className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
}
