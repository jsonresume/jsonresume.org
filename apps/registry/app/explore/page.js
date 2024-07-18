/* eslint-disable @next/next/no-img-element */
'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Loading from '../components/Loading';

const formatLocation = (location) => {
  if (!location) return 'Location not provided';

  const {
    postalCode = '',
    city = '',
    region = '',
    countryCode = '',
  } = location;

  const locationParts = [city, region, postalCode, countryCode].filter(
    (part) => part.trim() !== ''
  );

  if (locationParts.length === 0) return 'Location not provided';

  return locationParts.join(', ');
};

const Resumes = () => {
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
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {!data.length ? (
        <Loading />
      ) : (
        <>
          <input
            type="text"
            placeholder="Filter by name..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full p-3 mb-6 border border-gray-300 rounded"
          />
          <div className="flex flex-col gap-4">
            {filteredResumes.map((resume, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                initial={{
                  scale: [1, 1.1],
                }}
                whileInView={{
                  scale: [1.1, 1],
                }}
              >
                <Link
                  href={`/${resume.username}/dashboard`}
                  className="flex items-center p-4 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors duration-200"
                >
                  <img
                    src={resume.image}
                    alt={resume.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="text-lg font-bold">{resume.name}</div>
                    <div className="text-sm text-gray-600">
                      {formatLocation(resume.location)}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Resumes;
