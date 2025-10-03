import { Users, Globe2, Code2 } from 'lucide-react';

export function HeroSection({ totalCount }) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-gray-100/50 bg-[size:20px_20px] [mask-image:linear-gradient(to_bottom,white,transparent)]" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />

        <div className="relative">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
            Explore JSON Resumes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mb-8 leading-relaxed">
            Discover how professionals present their careers using the JSON
            Resume standard. Get inspired and see how others structure their
            experiences.
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{totalCount.toLocaleString()} Resumes</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4" />
              <span>Global Community</span>
            </div>
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              <span>Open Source</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
