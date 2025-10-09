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
  const [pdfData, setPdfData] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState(null);

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

  // Phase 2: PDF Parseability Analysis (triggered after JSON analysis)
  useEffect(() => {
    const analyzePDF = async () => {
      if (!resume || !atsData) return;

      setPdfLoading(true);
      setPdfError(null);

      try {
        const response = await fetch('/api/ats/pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resume,
            username,
            theme: 'professional',
          }),
        });

        if (!response.ok) {
          throw new Error(`PDF analysis failed: ${response.statusText}`);
        }

        const data = await response.json();
        setPdfData(data);
        logger.debug(
          { score: data.score, rating: data.rating },
          'PDF parseability analysis completed'
        );
      } catch (err) {
        logger.error(
          { error: err.message },
          'Error analyzing PDF parseability'
        );
        setPdfError(err.message);
      } finally {
        setPdfLoading(false);
      }
    };

    analyzePDF();
  }, [resume, atsData, username]);

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
        <h1 className="text-3xl font-bold mb-2">ATS Compatibility Analysis</h1>
        <p className="text-gray-600 mb-8">
          Two-phase analysis: JSON structure + PDF parseability
        </p>

        {/* Phase 1: JSON Structure Score */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            📋 Phase 1: JSON Structure Analysis
          </h2>
          <p className="text-gray-600 mb-4">
            Analyzes your resume data structure, completeness, and formatting
          </p>
          <ScoreDisplay
            score={atsData.score}
            rating={atsData.rating}
            summary={atsData.summary}
          />
        </div>

        {/* Phase 2: PDF Parseability Score */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            📄 Phase 2: PDF Parseability Test
          </h2>
          <p className="text-gray-600 mb-4">
            Simulates uploading your PDF to an ATS system (Professional theme)
          </p>
          {pdfLoading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-4"></div>
                <div>
                  <p className="font-semibold text-blue-900">
                    Analyzing PDF...
                  </p>
                  <p className="text-sm text-blue-700">
                    Generating PDF → Extracting text → Checking field extraction
                  </p>
                </div>
              </div>
            </div>
          )}
          {pdfError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-900 font-semibold">PDF Analysis Failed</p>
              <p className="text-red-700 text-sm mt-2">{pdfError}</p>
            </div>
          )}
          {pdfData && !pdfLoading && (
            <ScoreDisplay
              score={pdfData.score}
              rating={pdfData.rating}
              summary={pdfData.summary}
            />
          )}
        </div>

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
