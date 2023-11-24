import styled from 'styled-components';
import SubTitle from './SubTitle';
import List from './List';
import DateRange from './DateRange';

const Project = styled.div`
  font-size: 16px;
  font-weight: 500;
  display: flex;
`;

const ProjectPosition = styled.div`
  font-weight: 600;
`;

const ProjectName = styled.div`
  color: #444;
`;

const Projects = ({ projects }) => {
  if (!projects) {
    return null;
  }

  return (
    <div>
      <SubTitle>Projects</SubTitle>
      {projects.slice(0, 1).map((w) => {
        return (
          <div>
            <Project>
              <ProjectPosition>{w.position}</ProjectPosition>
              &nbsp;-&nbsp;
              <ProjectName>{w.name}</ProjectName>
            </Project>
            <DateRange startDate={w.startDate} endDate={w.endDate} />
            <p>{w.summary}</p>
            <List items={w.highlights} />
          </div>
        );
      })}
    </div>
  );
};

export default Projects;
