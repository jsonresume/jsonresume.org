'use client';

import { FormSection, ArrayField } from './FormComponents';
import { WorkFields, HighlightsList } from './WorkSection';

export const WorkSection = ({ resume, handlers }) => {
  const {
    updateWorkExperience,
    addWorkExperience,
    removeWorkExperience,
    addHighlight,
    updateHighlight,
    removeHighlight,
  } = handlers;

  return (
    <FormSection title="Work Experience">
      <ArrayField
        items={resume.work || []}
        onAdd={addWorkExperience}
        onRemove={removeWorkExperience}
        addLabel="Add Work Experience"
        renderItem={(item, index) => (
          <div className="space-y-4">
            <WorkFields
              item={item}
              index={index}
              updateWorkExperience={updateWorkExperience}
            />
            <HighlightsList
              highlights={item.highlights}
              workIndex={index}
              addHighlight={addHighlight}
              updateHighlight={updateHighlight}
              removeHighlight={removeHighlight}
            />
          </div>
        )}
      />
    </FormSection>
  );
};
