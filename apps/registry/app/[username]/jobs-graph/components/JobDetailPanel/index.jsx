import { highlightText } from '../../utils/textUtils';
import { PanelHeader } from './PanelHeader';
import { LocationSection } from './LocationSection';
import { SkillsSection } from './SkillsSection';
import { QualificationsSection } from './QualificationsSection';
import { PanelFooter } from './PanelFooter';

export const JobDetailPanel = ({
  selectedNode,
  filterText,
  username,
  readJobs,
  onMarkAsRead,
}) => {
  if (!selectedNode || !selectedNode.data.jobInfo) return null;

  const jobInfo = selectedNode.data.jobInfo;
  const isRead = readJobs.has(`${username}_${selectedNode.id}`);

  return (
    <div className="absolute top-4 right-4 max-w-lg bg-white rounded-xl shadow-xl border border-gray-200 divide-y divide-gray-100">
      <PanelHeader
        jobInfo={jobInfo}
        filterText={filterText}
        isRead={isRead}
        onMarkAsRead={() => onMarkAsRead(selectedNode.id)}
      />

      <div className="p-4 space-y-4">
        <LocationSection location={jobInfo.location} />

        {jobInfo.description && (
          <div className="text-gray-600 text-sm leading-relaxed">
            {filterText
              ? highlightText(jobInfo.description, filterText)
              : jobInfo.description}
          </div>
        )}

        <SkillsSection skills={jobInfo.skills} filterText={filterText} />
        <QualificationsSection
          qualifications={jobInfo.qualifications}
          filterText={filterText}
        />
      </div>

      <PanelFooter jobId={selectedNode.id} />
    </div>
  );
};
