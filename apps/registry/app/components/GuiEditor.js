'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@repo/ui';

const FormSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-lg mb-4">
      <button
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 rounded-t-lg hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-medium text-gray-900">{title}</h3>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {isOpen && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
};

const FormField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {type === 'textarea' ? (
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
      />
    ) : (
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    )}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const ArrayField = ({ items, onAdd, onRemove, renderItem, addLabel }) => (
  <div className="space-y-4">
    {items.map((item, index) => (
      <div key={index} className="relative border rounded-lg p-4">
        <Button
          variant="outline"
          size="sm"
          className="absolute top-2 right-2"
          onClick={() => onRemove(index)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        {renderItem(item, index)}
      </div>
    ))}
    <Button
      variant="outline"
      size="sm"
      onClick={onAdd}
      className="w-full flex items-center justify-center gap-2"
    >
      <Plus className="w-4 h-4" />
      {addLabel}
    </Button>
  </div>
);

export default function GuiEditor({ resume, onChange }) {
  const updateBasics = (field, value) => {
    onChange({
      ...resume,
      basics: {
        ...resume.basics,
        [field]: value,
      },
    });
  };

  const updateLocation = (field, value) => {
    onChange({
      ...resume,
      basics: {
        ...resume.basics,
        location: {
          ...resume.basics?.location,
          [field]: value,
        },
      },
    });
  };

  const updateWorkExperience = (index, field, value) => {
    const newWork = [...(resume.work || [])];
    newWork[index] = { ...newWork[index], [field]: value };
    onChange({ ...resume, work: newWork });
  };

  const addWorkExperience = () => {
    onChange({
      ...resume,
      work: [
        ...(resume.work || []),
        { name: '', position: '', startDate: '', endDate: '', highlights: [] },
      ],
    });
  };

  const removeWorkExperience = (index) => {
    const newWork = [...(resume.work || [])];
    newWork.splice(index, 1);
    onChange({ ...resume, work: newWork });
  };

  const addHighlight = (workIndex) => {
    const newWork = [...(resume.work || [])];
    newWork[workIndex] = {
      ...newWork[workIndex],
      highlights: [...(newWork[workIndex].highlights || []), ''],
    };
    onChange({ ...resume, work: newWork });
  };

  const updateHighlight = (workIndex, highlightIndex, value) => {
    const newWork = [...(resume.work || [])];
    newWork[workIndex].highlights[highlightIndex] = value;
    onChange({ ...resume, work: newWork });
  };

  const removeHighlight = (workIndex, highlightIndex) => {
    const newWork = [...(resume.work || [])];
    newWork[workIndex].highlights.splice(highlightIndex, 1);
    onChange({ ...resume, work: newWork });
  };

  return (
    <div className="h-full overflow-auto p-4">
      <FormSection title="Basic Information" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Full Name"
            value={resume.basics?.name}
            onChange={(value) => updateBasics('name', value)}
            placeholder="John Doe"
          />
          <FormField
            label="Label"
            value={resume.basics?.label}
            onChange={(value) => updateBasics('label', value)}
            placeholder="Software Engineer"
          />
          <FormField
            label="Email"
            type="email"
            value={resume.basics?.email}
            onChange={(value) => updateBasics('email', value)}
            placeholder="john@example.com"
          />
          <FormField
            label="Phone"
            value={resume.basics?.phone}
            onChange={(value) => updateBasics('phone', value)}
            placeholder="+1 (123) 456-7890"
          />
          <FormField
            label="Website"
            type="url"
            value={resume.basics?.url}
            onChange={(value) => updateBasics('url', value)}
            placeholder="https://example.com"
          />
          <FormField
            label="Image URL"
            type="url"
            value={resume.basics?.image}
            onChange={(value) => updateBasics('image', value)}
            placeholder="https://example.com/photo.jpg"
          />
        </div>
        <FormField
          label="Summary"
          type="textarea"
          value={resume.basics?.summary}
          onChange={(value) => updateBasics('summary', value)}
          placeholder="A brief summary about yourself..."
        />
      </FormSection>

      <FormSection title="Location">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Address"
            type="textarea"
            value={resume.basics?.location?.address}
            onChange={(value) => updateLocation('address', value)}
            placeholder="123 Main St"
          />
          <FormField
            label="Postal Code"
            value={resume.basics?.location?.postalCode}
            onChange={(value) => updateLocation('postalCode', value)}
            placeholder="12345"
          />
          <FormField
            label="City"
            value={resume.basics?.location?.city}
            onChange={(value) => updateLocation('city', value)}
            placeholder="San Francisco"
          />
          <FormField
            label="Region"
            value={resume.basics?.location?.region}
            onChange={(value) => updateLocation('region', value)}
            placeholder="California"
          />
          <FormField
            label="Country Code"
            value={resume.basics?.location?.countryCode}
            onChange={(value) => updateLocation('countryCode', value)}
            placeholder="US"
          />
        </div>
      </FormSection>

      <FormSection title="Work Experience">
        <ArrayField
          items={resume.work || []}
          onAdd={addWorkExperience}
          onRemove={removeWorkExperience}
          addLabel="Add Work Experience"
          renderItem={(item, index) => (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Company Name"
                  value={item.name}
                  onChange={(value) =>
                    updateWorkExperience(index, 'name', value)
                  }
                  placeholder="Company Name"
                />
                <FormField
                  label="Position"
                  value={item.position}
                  onChange={(value) =>
                    updateWorkExperience(index, 'position', value)
                  }
                  placeholder="Job Title"
                />
                <FormField
                  label="Start Date"
                  value={item.startDate}
                  onChange={(value) =>
                    updateWorkExperience(index, 'startDate', value)
                  }
                  placeholder="YYYY-MM"
                />
                <FormField
                  label="End Date"
                  value={item.endDate}
                  onChange={(value) =>
                    updateWorkExperience(index, 'endDate', value)
                  }
                  placeholder="YYYY-MM or Present"
                />
                <FormField
                  label="Location"
                  value={item.location}
                  onChange={(value) =>
                    updateWorkExperience(index, 'location', value)
                  }
                  placeholder="City, Country"
                />
                <FormField
                  label="Website"
                  type="url"
                  value={item.url}
                  onChange={(value) =>
                    updateWorkExperience(index, 'url', value)
                  }
                  placeholder="https://company.com"
                />
              </div>
              <FormField
                label="Description"
                type="textarea"
                value={item.description}
                onChange={(value) =>
                  updateWorkExperience(index, 'description', value)
                }
                placeholder="Company description..."
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Highlights
                </label>
                {(item.highlights || []).map((highlight, hIndex) => (
                  <div key={hIndex} className="flex gap-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) =>
                        updateHighlight(index, hIndex, e.target.value)
                      }
                      className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Achievement or responsibility..."
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeHighlight(index, hIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addHighlight(index)}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Highlight
                </Button>
              </div>
            </div>
          )}
        />
      </FormSection>
    </div>
  );
}
