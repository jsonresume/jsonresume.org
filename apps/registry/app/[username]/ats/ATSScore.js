'use client';

import React from 'react';
import { usePublicResume } from '../../providers/PublicResumeProvider';
import { PublicViewBanner } from '../../components/PublicViewBanner';
import { ChecksList } from './ATSScoreModule/components/ChecksList';
import { RecommendationsList } from './ATSScoreModule/components/RecommendationsList';
import { useATSAnalysis } from './hooks/useATSAnalysis';
import { usePDFAnalysis } from './hooks/usePDFAnalysis';
import {
  LoadingState,
  ErrorState,
  ResumeErrorState,
  NoResumeState,
  AnalyzingState,
} from './components/LoadingStates';
import {
  JSONStructurePhase,
  PDFParseabilityPhase,
} from './components/AnalysisPhases';

const ATSScore = ({ params }) => {
  const { username } = params;
  const {
    resume,
    loading: resumeLoading,
    error: resumeError,
  } = usePublicResume();

  // Phase 1: JSON Structure Analysis
  const {
    atsData,
    loading: atsLoading,
    error: atsError,
  } = useATSAnalysis(resume);

  // Phase 2: PDF Parseability Analysis
  const {
    pdfData,
    loading: pdfLoading,
    error: pdfError,
  } = usePDFAnalysis(resume, atsData, username);

  // Early returns for loading and error states
  if (resumeLoading || atsLoading) return <LoadingState />;
  if (resumeError) return <ResumeErrorState error={resumeError} />;
  if (atsError) return <ErrorState error={atsError} />;
  if (!resume) return <NoResumeState />;
  if (!atsData) return <AnalyzingState />;

  return (
    <>
      <PublicViewBanner username={username} />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">ATS Compatibility Analysis</h1>
        <p className="text-gray-600 mb-8">
          Two-phase analysis: JSON structure + PDF parseability
        </p>

        <JSONStructurePhase atsData={atsData} />
        <PDFParseabilityPhase
          pdfData={pdfData}
          pdfLoading={pdfLoading}
          pdfError={pdfError}
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
