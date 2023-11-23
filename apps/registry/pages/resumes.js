import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Image = styled.img`
  width: 200px;
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
        const response = await axios.get("/api/resumes");
        console.log({ response });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Data from API:</h1>
      <Images>
        {data.map((resume) => {
          return (
            <div key={resume.updated_at}>
              <a href={`https://registry.jsonresume.org/${resume.username}`}>
                <Image alt="The user" src={resume.image} />
              </a>
              <div>{resume.label?.substr(0, 30)}</div>
            </div>
          );
        })}
      </Images>
    </div>
  );
};

export default Resumes;
