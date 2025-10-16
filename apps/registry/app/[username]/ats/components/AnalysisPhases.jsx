import { ScoreDisplay } from '../ATSScoreModule/components/ScoreDisplay';
import { PDFLoadingState, PDFErrorState } from './LoadingStates';

export function JSONStructurePhase({ atsData }) {
  return (
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
  );
}

export function PDFParseabilityPhase({ pdfData, pdfLoading, pdfError }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">
        📄 Phase 2: PDF Parseability Test
      </h2>
      <p className="text-gray-600 mb-4">
        Simulates uploading your PDF to an ATS system (Professional theme)
      </p>
      {pdfLoading && <PDFLoadingState />}
      {pdfError && <PDFErrorState error={pdfError} />}
      {pdfData && !pdfLoading && (
        <ScoreDisplay
          score={pdfData.score}
          rating={pdfData.rating}
          summary={pdfData.summary}
        />
      )}
    </div>
  );
}
