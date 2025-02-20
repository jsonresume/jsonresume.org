import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Container, Box, Typography, Card, CardContent, Button, CircularProgress, List, ListItem } from '@mui/material';
import { styled } from '@mui/material/styles';

// Sample job postings - in production, this would come from an API or database
const SAMPLE_JOBS = [
  {
    title: "Founding Frontend Engineer",
    company: "Pincites",
    type: "Full-time",
    remote: "Full",
    description: "Pincites uses AI to help legal teams identify negotiation patterns...",
  },
  // Add more sample jobs here
];

const ScoreCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const ScoreSection = ({ title, score, details }) => (
  <Box mb={2}>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Box display="flex" alignItems="center" mb={1}>
      <CircularProgress
        variant="determinate"
        value={score * 100}
        size={60}
        thickness={4}
        sx={{ mr: 2 }}
      />
      <Typography variant="h4">{Math.round(score * 100)}%</Typography>
    </Box>
    <Typography variant="body1">{details}</Typography>
  </Box>
);

export default function JobRecommendations() {
  const router = useRouter();
  const { username } = router.query;
  const [selectedJob, setSelectedJob] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleJobSelect = async (job) => {
    setSelectedJob(job);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/job-recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          jobPosting: job,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Job Recommendations | JSON Resume</title>
      </Head>
      <Container maxWidth="lg">
        <Box py={4}>
          <Typography variant="h4" gutterBottom>
            Job Recommendations
          </Typography>
          
          {!username && (
            <Typography color="error">
              Please log in to view job recommendations
            </Typography>
          )}

          <Box display="flex" mt={4}>
            {/* Job List */}
            <Box flex={1} mr={4}>
              <Typography variant="h5" gutterBottom>
                Available Positions
              </Typography>
              <List>
                {SAMPLE_JOBS.map((job, index) => (
                  <ListItem key={index}>
                    <Card
                      sx={{
                        width: '100%',
                        cursor: 'pointer',
                        bgcolor: selectedJob === job ? 'action.selected' : 'background.paper',
                      }}
                      onClick={() => handleJobSelect(job)}
                    >
                      <CardContent>
                        <Typography variant="h6">{job.title}</Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                          {job.company}
                        </Typography>
                        <Typography variant="body2">
                          {job.type} • {job.remote}
                        </Typography>
                      </CardContent>
                    </Card>
                  </ListItem>
                ))}
              </List>
            </Box>

            {/* Results Section */}
            <Box flex={2}>
              {loading && (
                <Box display="flex" justifyContent="center" mt={4}>
                  <CircularProgress />
                </Box>
              )}

              {error && (
                <Typography color="error" mt={4}>
                  {error}
                </Typography>
              )}

              {results && !loading && (
                <ScoreCard>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      Match Analysis
                    </Typography>

                    <ScoreSection
                      title="Overall Match"
                      score={results.overallScore}
                      details={results.overallAnalysis}
                    />

                    <ScoreSection
                      title="Technical Skills"
                      score={results.skillsScore}
                      details={results.skillsAnalysis}
                    />

                    <ScoreSection
                      title="Culture Fit"
                      score={results.cultureFitScore}
                      details={results.cultureFitAnalysis}
                    />

                    {results.remoteScore !== undefined && (
                      <ScoreSection
                        title="Remote Work Readiness"
                        score={results.remoteScore}
                        details={results.remoteAnalysis}
                      />
                    )}

                    <Box mt={4}>
                      <Typography variant="h6" gutterBottom>
                        Key Highlights
                      </Typography>
                      <List>
                        {results.highlights?.map((highlight, index) => (
                          <ListItem key={index}>
                            <Typography variant="body1">• {highlight}</Typography>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </CardContent>
                </ScoreCard>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
}
