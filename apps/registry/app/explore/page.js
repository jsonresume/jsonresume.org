import ClientResumes from './ClientResumes';
import {
  METADATA,
  fetchResumes,
  HeroSection,
  SearchStatus,
} from './ExploreModule';

export const metadata = METADATA;
export const dynamic = 'force-dynamic';

export default async function ExplorePage({ searchParams }) {
  const page = Number(searchParams?.page) || 1;
  const search = searchParams?.search || '';
  const { resumes, totalCount, totalPages } = await fetchResumes(page, search);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <HeroSection totalCount={totalCount} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <SearchStatus totalCount={totalCount} search={search} />
        <ClientResumes
          initialResumes={resumes}
          currentPage={page}
          totalPages={totalPages}
          currentSearch={search}
        />
      </div>
    </div>
  );
}
