/**
 * Loading and error state components for ATS analysis
 */

export function LoadingState() {
  return (
    <div className="p-8 text-lg">Analyzing resume for ATS compatibility...</div>
  );
}

export function ErrorState({ error }) {
  return (
    <div className="p-8 text-lg text-red-600">
      Error analyzing resume: {error}
    </div>
  );
}

export function ResumeErrorState({ error }) {
  return (
    <div className="p-8 text-lg text-red-600">
      Error loading resume: {error}
    </div>
  );
}

export function NoResumeState() {
  return <div className="p-8 text-lg">No resume found</div>;
}

export function AnalyzingState() {
  return <div className="p-8 text-lg">Analyzing...</div>;
}

export function PDFLoadingState() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-4"></div>
        <div>
          <p className="font-semibold text-blue-900">Analyzing PDF...</p>
          <p className="text-sm text-blue-700">
            Generating PDF → Extracting text → Checking field extraction
          </p>
        </div>
      </div>
    </div>
  );
}

export function PDFErrorState({ error }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <p className="text-red-900 font-semibold">PDF Analysis Failed</p>
      <p className="text-red-700 text-sm mt-2">{error}</p>
    </div>
  );
}
