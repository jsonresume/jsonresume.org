'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Input } from '@repo/ui/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

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
  return locationParts.length === 0
    ? 'Location not provided'
    : locationParts.join(', ');
};

const Resumes = () => {
  const [data, setData] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [filteredResumes, setFilteredResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uniqueLocations, setUniqueLocations] = useState([]);
  const [uniquePositions, setUniquePositions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/resumes?limit=500');
        setData(response.data);
        setLoading(false);

        // Extract unique locations and positions
        const locations = new Set(
          response.data.map((resume) => formatLocation(resume.location))
        );
        setUniqueLocations(Array.from(locations));

        const positions = new Set(
          response.data.flatMap((resume) =>
            resume.work ? resume.work.map((w) => w.position) : []
          )
        );
        setUniquePositions(Array.from(positions));
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex max-w-7xl mx-auto p-6">
      {/* Sidebar */}
      <div className="w-64 mr-8">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="name-filter" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name-filter"
                  placeholder="Filter by name..."
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="location-filter"
                  className="text-sm font-medium"
                >
                  Location
                </label>
                <Select
                  onValueChange={setLocationFilter}
                  value={locationFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asdsd">All Locations</SelectItem>
                    {uniqueLocations.map((location, index) => (
                      <SelectItem key={index} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  htmlFor="position-filter"
                  className="text-sm font-medium"
                >
                  Position
                </label>
                <Select
                  onValueChange={setPositionFilter}
                  value={positionFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asdsd">All Positions</SelectItem>
                    {uniquePositions.map((position, index) => (
                      <SelectItem key={index} value={position}>
                        {position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <ScrollArea className="h-[80vh]">
          <div className="space-y-4">
            {filteredResumes.map((resume, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={`/${resume.username}/dashboard`}>
                  <Card>
                    <CardHeader>
                      <CardTitle>{resume.name}</CardTitle>
                      <CardDescription>
                        {formatLocation(resume.location)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center">
                        <Image
                          src={resume.image}
                          alt={resume.name}
                          className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                          {resume.work && resume.work[0] && (
                            <p className="text-sm text-gray-600">
                              {resume.work[0].position} at{' '}
                              {resume.work[0].company}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Resumes;
