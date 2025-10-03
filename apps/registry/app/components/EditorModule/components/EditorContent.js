import { useResume } from '../../providers/ResumeProvider';
import ResumeEditor from '../../ResumeEditor';
import CreateResume from '../../CreateResume';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { sampleResume } from '../data/sampleResume';

export function EditorContent() {
  const { resume, loading, error, updateGist, createGist } = useResume();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-gray-50 relative overflow-hidden">
      {resume ? (
        <ResumeEditor
          resume={JSON.stringify(resume, undefined, 2)}
          updateGist={updateGist}
        />
      ) : (
        <CreateResume sampleResume={sampleResume} createGist={createGist} />
      )}
    </div>
  );
}
