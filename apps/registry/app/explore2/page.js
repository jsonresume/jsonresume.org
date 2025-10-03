'use client';

import { useResumeData } from './Explore2Module/hooks/useResumeData';
import { useResumeFilters } from './Explore2Module/hooks/useResumeFilters';
import { LoadingSpinner } from './Explore2Module/components/LoadingSpinner';
import { FilterSidebar } from './Explore2Module/components/FilterSidebar';
import { ResumeList } from './Explore2Module/components/ResumeList';

const Resumes = () => {
  const { data, loading } = useResumeData();
  const {
    nameFilter,
    setNameFilter,
    locationFilter,
    setLocationFilter,
    positionFilter,
    setPositionFilter,
    filteredResumes,
    uniqueLocations,
    uniquePositions,
  } = useResumeFilters(data);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex max-w-7xl mx-auto p-6">
      <FilterSidebar
        nameFilter={nameFilter}
        onNameChange={setNameFilter}
        locationFilter={locationFilter}
        onLocationChange={setLocationFilter}
        positionFilter={positionFilter}
        onPositionChange={setPositionFilter}
        uniqueLocations={uniqueLocations}
        uniquePositions={uniquePositions}
      />
      <ResumeList resumes={filteredResumes} />
    </div>
  );
};

export default Resumes;
