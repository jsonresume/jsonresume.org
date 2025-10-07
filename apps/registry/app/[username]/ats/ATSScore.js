'use client';

import React, { useEffect, useState } from 'react';
import { usePublicResume } from '../../providers/PublicResumeProvider';
import { PublicViewBanner } from '../../components/PublicViewBanner';
import { ScoreDisplay } from './ATSScoreModule/components/ScoreDisplay';
import { ChecksList } from './ATSScoreModule/components/ChecksList';
import { RecommendationsList } from './ATSScoreModule/components/RecommendationsList';
import { logger } from '@/lib/logger';

const ATSScore = ({ params }) => {
  const { username } = params;
  const {
    resume,
    loading: resumeLoading,
    error: resumeError,
  } = usePublicResume();
  const [atsData, setAtsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const analyzeResume = async () => {
      if (!resume) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/ats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ resume }),
        });

        if (!response.ok) {
          throw new Error(`ATS analysis failed: ${response.statusText}`);
        }

        const data = await response.json();
        setAtsData(data);
        logger.debug(
          { score: data.score, rating: data.rating },
          'ATS analysis completed'
        );
      } catch (err) {
        logger.error({ error: err.message }, 'Error analyzing resume for ATS');
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    analyzeResume();
  }, [resume]);

  if (resumeLoading || loading) {
    return (
      <div className="p-8 text-lg">
        Analyzing resume for ATS compatibility...
      </div>
    );
  }

  if (resumeError) {
    return (
      <div className="p-8 text-lg text-red-600">
        Error loading resume: {resumeError}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-lg text-red-600">
        Error analyzing resume: {error}
      </div>
    );
  }

  if (!resume) {
    return <div className="p-8 text-lg">No resume found</div>;
  }

  if (!atsData) {
    return <div className="p-8 text-lg">Analyzing...</div>;
  }

  return (
    <>
      <PublicViewBanner username={username} />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">ATS Compatibility Score</h1>
        <p className="text-gray-600 mb-8">
          Your resume has been analyzed for Applicant Tracking System (ATS)
          compatibility.
        </p>

        <ScoreDisplay
          score={atsData.score}
          rating={atsData.rating}
          summary={atsData.summary}
        />

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Detailed Analysis</h2>
          <ChecksList checks={atsData.checks} />
        </div>

        {atsData.recommendations && atsData.recommendations.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
            <RecommendationsList recommendations={atsData.recommendations} />
          </div>
        )}
      </div>
    </>
  );
};

export default ATSScore;
