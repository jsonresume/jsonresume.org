'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const FilterInput = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;

  width: calc(100% - 20px);
`;

const ResumeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ResumeItem = styled(Link)`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  padding: 10px;
  background: #fffdf1;
  text-decoration: none;
  color: inherit;
  transition: background 0.2s ease-in-out;
  &:hover {
    background: #fff18f;
  }
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 20px;
`;

const ResumeDetails = styled.div`
  display: flex;
  flex-direction: column;
  text-decoration: none;
`;

const ResumeName = styled.div`
  font-size: 18px;
  font-weight: bold;
  text-decoration: none;
`;

const ResumeLocation = styled.div`
  font-size: 14px;
  color: #666;
  text-decoration: none;
`;

const formatLocation = (location) => {
  if (!location) return 'Location not provided';

  const {
    // address = '',
    postalCode = '',
    city = '',
    region = '',
    countryCode = '',
  } = location;

  // Construct the location string by including only the parts that are provided
  const locationParts = [city, region, postalCode, countryCode].filter(
    (part) => part.trim() !== ''
  );

  if (locationParts.length === 0) return 'Location not provided';

  return locationParts.join(', ');
};

const Resumes = () => {
  // get all resumes
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('');
  const [filteredResumes, setFilteredResumes] = useState([]);

  useEffect(() => {
    setFilteredResumes(
      data.filter((resume) =>
        resume?.name?.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [filter, data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/resumes?limit=500');
        // let resumes = response.data;
        // remove ones with no avatar

        setData(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {!data && <div style={{ textAlign: 'center' }}>Loading...</div>}
      {data && (
        <>
          <Container>
            <FilterInput
              type="text"
              placeholder="Filter by name..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <ResumeList>
              {filteredResumes.map((resume, index) => (
                <ResumeItem key={index} href={`/${resume.username}/dashboard`}>
                  <Avatar src={resume.image} alt={resume.name} />
                  <ResumeDetails>
                    <ResumeName>{resume.name}</ResumeName>
                    <ResumeLocation>
                      {formatLocation(resume.location)}
                    </ResumeLocation>
                  </ResumeDetails>
                </ResumeItem>
              ))}
            </ResumeList>
          </Container>
        </>
      )}
    </div>
  );
};

export default Resumes;
