import { Search } from 'lucide-react';
import { Input } from '@repo/ui';

export function SearchBar({ searchTerm, onSearchChange, isLoading }) {
  return (
    <div className="relative mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search resumes by name, skills, or location..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 h-12 text-lg bg-white"
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
