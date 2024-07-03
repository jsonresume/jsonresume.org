'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const Heading = styled.h1`
  text-align: center;
`;

const Image = styled.img`
  width: 90px;
`;

const Images = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
`;

const Resumes = () => {
  // get all resumes
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/resumes?limit=300');
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
      <Heading>Here are some recent JSON Resume&nbsp;s</Heading>
      {!data && <div style={{ textAlign: 'center' }}>Loading...</div>}
      {data && (
        <Images>
          {data.map((resume) => {
            return (
              <div key={resume.updated_at}>
                <Link href={`/${resume.username}/dashboard`}>
                  <Image alt="The user" src={resume.image} />
                </Link>
                <div>{resume.label?.substr(0, 30)}</div>
              </div>
            );
          })}
        </Images>
      )}
    </div>
  );
};

export default Resumes;
