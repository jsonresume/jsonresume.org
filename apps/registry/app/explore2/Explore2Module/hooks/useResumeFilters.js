import { useState, useEffect } from 'react';
import { formatLocation } from '../../../utils/formatters';

export function useResumeFilters(data) {
  const [nameFilter, setNameFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [filteredResumes, setFilteredResumes] = useState([]);
  const [uniqueLocations, setUniqueLocations] = useState([]);
  const [uniquePositions, setUniquePositions] = useState([]);

  // Extract unique filter options when data changes
  useEffect(() => {
    if (!data.length) return;

    const locations = new Set(
      data.map((resume) => formatLocation(resume.location))
    );
    setUniqueLocations(Array.from(locations));

    const positions = new Set(
      data.flatMap((resume) =>
        resume.work ? resume.work.map((w) => w.position) : []
      )
    );
    setUniquePositions(Array.from(positions));
  }, [data]);

  // Apply filters when filter values or data change
  useEffect(() => {
    setFilteredResumes(
      data.filter((resume) => {
        const nameMatch = resume?.name
          ?.toLowerCase()
          .includes(nameFilter.toLowerCase());
        const locationMatch =
          locationFilter === '' ||
          formatLocation(resume.location)
            .toLowerCase()
            .includes(locationFilter.toLowerCase());
        const positionMatch =
          positionFilter === '' ||
          (resume.work &&
            resume.work.some((w) =>
              w.position.toLowerCase().includes(positionFilter.toLowerCase())
            ));
        return nameMatch && locationMatch && positionMatch;
      })
    );
  }, [nameFilter, locationFilter, positionFilter, data]);

  return {
    nameFilter,
    setNameFilter,
    locationFilter,
    setLocationFilter,
    positionFilter,
    setPositionFilter,
    filteredResumes,
    uniqueLocations,
    uniquePositions,
  };
}
