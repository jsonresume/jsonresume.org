import { JobPanelHeader } from './JobPanelHeader';
import { JobPanelContent } from './JobPanelContent';
import { JobPanelFooter } from './JobPanelFooter';

/**
 * Job detail panel for Pathways graph
 */
export function PathwaysJobPanel({
  selectedNode,
  filterText,
  readJobIds,
  onMarkAsRead,
  onClose,
  onPromptFeedback,
}) {
  if (!selectedNode || !selectedNode.data?.jobInfo) return null;

  const jobInfo = selectedNode.data.jobInfo;
  const isRead = readJobIds.has(selectedNode.id);
  const hnUrl = `https://news.ycombinator.com/item?id=${selectedNode.id}`;
  const companyUrl = jobInfo.website || jobInfo.url || jobInfo.companyUrl;

  return (
    <div className="absolute top-4 right-4 w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
      <JobPanelHeader
        jobInfo={jobInfo}
        filterText={filterText}
        hnUrl={hnUrl}
        companyUrl={companyUrl}
        onClose={onClose}
      />
      <JobPanelContent
        jobInfo={jobInfo}
        selectedNode={selectedNode}
        filterText={filterText}
      />
      <JobPanelFooter
        selectedNode={selectedNode}
        jobInfo={jobInfo}
        isRead={isRead}
        onMarkAsRead={onMarkAsRead}
        onClose={onClose}
        onPromptFeedback={onPromptFeedback}
      />
    </div>
  );
}
