'use client';

import { Search } from 'lucide-react';
import { Input } from '@repo/ui';

export function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10"
        placeholder="Search jobs..."
      />
    </div>
  );
}
