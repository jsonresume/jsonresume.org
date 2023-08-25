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
        const response = await axios.get("/api/themes");
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
  const themes = Object.values(data);
  console.log({ themes, data });
  return (
    <div>
      <h1>Data from API:</h1>
      <Images>
        {themes.map((resume) => {
          return (
            <div key={resume}>
              <a href={resume}>
                <Image
                  src={`https://screenshot-peach-beta.vercel.app/api?url=${resume}&height=720&width=1280`}
                />
              </a>
            </div>
          );
        })}
      </Images>
    </div>
  );
};

export default Resumes;
