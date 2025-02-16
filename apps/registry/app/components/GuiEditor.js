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
        {
          name: '',
          position: '',
          startDate: '',
          endDate: '',
          location: '',
          url: '',
          summary: '',
          description: '',
          highlights: [],
        },
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

  const updateProfiles = (index, field, value) => {
    const newProfiles = [...(resume.basics?.profiles || [])];
    newProfiles[index] = { ...newProfiles[index], [field]: value };
    onChange({
      ...resume,
      basics: {
        ...resume.basics,
        profiles: newProfiles,
      },
    });
  };

  const addProfile = () => {
    onChange({
      ...resume,
      basics: {
        ...resume.basics,
        profiles: [
          ...(resume.basics?.profiles || []),
          { network: '', username: '', url: '' },
        ],
      },
    });
  };

  const removeProfile = (index) => {
    const newProfiles = [...(resume.basics?.profiles || [])];
    newProfiles.splice(index, 1);
    onChange({
      ...resume,
      basics: {
        ...resume.basics,
        profiles: newProfiles,
      },
    });
  };

  const updateVolunteer = (index, field, value) => {
    const newVolunteer = [...(resume.volunteer || [])];
    newVolunteer[index] = { ...newVolunteer[index], [field]: value };
    onChange({ ...resume, volunteer: newVolunteer });
  };

  const updateEducation = (index, field, value) => {
    const newEducation = [...(resume.education || [])];
    newEducation[index] = { ...newEducation[index], [field]: value };
    onChange({ ...resume, education: newEducation });
  };

  const updateAwards = (index, field, value) => {
    const newAwards = [...(resume.awards || [])];
    newAwards[index] = { ...newAwards[index], [field]: value };
    onChange({ ...resume, awards: newAwards });
  };

  const updateCertificates = (index, field, value) => {
    const newCertificates = [...(resume.certificates || [])];
    newCertificates[index] = { ...newCertificates[index], [field]: value };
    onChange({ ...resume, certificates: newCertificates });
  };

  const updatePublications = (index, field, value) => {
    const newPublications = [...(resume.publications || [])];
    newPublications[index] = { ...newPublications[index], [field]: value };
    onChange({ ...resume, publications: newPublications });
  };

  const updateSkills = (index, field, value) => {
    const newSkills = [...(resume.skills || [])];
    newSkills[index] = { ...newSkills[index], [field]: value };
    onChange({ ...resume, skills: newSkills });
  };

  const updateLanguages = (index, field, value) => {
    const newLanguages = [...(resume.languages || [])];
    newLanguages[index] = { ...newLanguages[index], [field]: value };
    onChange({ ...resume, languages: newLanguages });
  };

  const updateInterests = (index, field, value) => {
    const newInterests = [...(resume.interests || [])];
    newInterests[index] = { ...newInterests[index], [field]: value };
    onChange({ ...resume, interests: newInterests });
  };

  const updateReferences = (index, field, value) => {
    const newReferences = [...(resume.references || [])];
    newReferences[index] = { ...newReferences[index], [field]: value };
    onChange({ ...resume, references: newReferences });
  };

  const updateProjects = (index, field, value) => {
    const newProjects = [...(resume.projects || [])];
    newProjects[index] = { ...newProjects[index], [field]: value };
    onChange({ ...resume, projects: newProjects });
  };

  const addArrayItem = (section, template) => {
    onChange({
      ...resume,
      [section]: [...(resume[section] || []), template],
    });
  };

  const removeArrayItem = (section, index) => {
    const newArray = [...(resume[section] || [])];
    newArray.splice(index, 1);
    onChange({ ...resume, [section]: newArray });
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
                label="Summary"
                type="textarea"
                value={item.summary}
                onChange={(value) =>
                  updateWorkExperience(index, 'summary', value)
                }
                placeholder="Brief summary of your role and responsibilities..."
              />
              <FormField
                label="Description"
                type="textarea"
                value={item.description}
                onChange={(value) =>
                  updateWorkExperience(index, 'description', value)
                }
                placeholder="Detailed description of your work experience..."
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

      <FormSection title="Profiles">
        <ArrayField
          items={resume.basics?.profiles || []}
          onAdd={addProfile}
          onRemove={removeProfile}
          addLabel="Add Profile"
          renderItem={(item, index) => (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Network"
                value={item.network}
                onChange={(value) => updateProfiles(index, 'network', value)}
                placeholder="Twitter, LinkedIn, etc."
              />
              <FormField
                label="Username"
                value={item.username}
                onChange={(value) => updateProfiles(index, 'username', value)}
                placeholder="johndoe"
              />
              <FormField
                label="URL"
                type="url"
                value={item.url}
                onChange={(value) => updateProfiles(index, 'url', value)}
                placeholder="https://twitter.com/johndoe"
              />
            </div>
          )}
        />
      </FormSection>

      <FormSection title="Volunteer Experience">
        <ArrayField
          items={resume.volunteer || []}
          onAdd={() =>
            addArrayItem('volunteer', {
              organization: '',
              position: '',
              url: '',
              startDate: '',
              endDate: '',
              summary: '',
              highlights: [],
            })
          }
          onRemove={(index) => removeArrayItem('volunteer', index)}
          addLabel="Add Volunteer Experience"
          renderItem={(item, index) => (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Organization"
                  value={item.organization}
                  onChange={(value) =>
                    updateVolunteer(index, 'organization', value)
                  }
                  placeholder="Organization Name"
                />
                <FormField
                  label="Position"
                  value={item.position}
                  onChange={(value) =>
                    updateVolunteer(index, 'position', value)
                  }
                  placeholder="Volunteer Position"
                />
                <FormField
                  label="Start Date"
                  value={item.startDate}
                  onChange={(value) =>
                    updateVolunteer(index, 'startDate', value)
                  }
                  placeholder="YYYY-MM"
                />
                <FormField
                  label="End Date"
                  value={item.endDate}
                  onChange={(value) => updateVolunteer(index, 'endDate', value)}
                  placeholder="YYYY-MM or Present"
                />
                <FormField
                  label="URL"
                  type="url"
                  value={item.url}
                  onChange={(value) => updateVolunteer(index, 'url', value)}
                  placeholder="https://organization.com"
                />
              </div>
              <FormField
                label="Summary"
                type="textarea"
                value={item.summary}
                onChange={(value) => updateVolunteer(index, 'summary', value)}
                placeholder="Description of your volunteer work..."
              />
              <ArrayField
                items={item.highlights || []}
                onAdd={() => {
                  const newVolunteer = [...(resume.volunteer || [])];
                  newVolunteer[index] = {
                    ...newVolunteer[index],
                    highlights: [...(newVolunteer[index].highlights || []), ''],
                  };
                  onChange({ ...resume, volunteer: newVolunteer });
                }}
                onRemove={(highlightIndex) => {
                  const newVolunteer = [...(resume.volunteer || [])];
                  newVolunteer[index].highlights.splice(highlightIndex, 1);
                  onChange({ ...resume, volunteer: newVolunteer });
                }}
                addLabel="Add Highlight"
                renderItem={(highlight, highlightIndex) => (
                  <FormField
                    value={highlight}
                    onChange={(value) => {
                      const newVolunteer = [...(resume.volunteer || [])];
                      newVolunteer[index].highlights[highlightIndex] = value;
                      onChange({ ...resume, volunteer: newVolunteer });
                    }}
                    placeholder="Achievement or responsibility..."
                  />
                )}
              />
            </div>
          )}
        />
      </FormSection>

      <FormSection title="Education">
        <ArrayField
          items={resume.education || []}
          onAdd={() =>
            addArrayItem('education', {
              institution: '',
              area: '',
              studyType: '',
              startDate: '',
              endDate: '',
              score: '',
              courses: [],
            })
          }
          onRemove={(index) => removeArrayItem('education', index)}
          addLabel="Add Education"
          renderItem={(item, index) => (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Institution"
                  value={item.institution}
                  onChange={(value) =>
                    updateEducation(index, 'institution', value)
                  }
                  placeholder="University Name"
                />
                <FormField
                  label="Area"
                  value={item.area}
                  onChange={(value) => updateEducation(index, 'area', value)}
                  placeholder="Field of Study"
                />
                <FormField
                  label="Study Type"
                  value={item.studyType}
                  onChange={(value) =>
                    updateEducation(index, 'studyType', value)
                  }
                  placeholder="Bachelor, Master, etc."
                />
                <FormField
                  label="Start Date"
                  value={item.startDate}
                  onChange={(value) =>
                    updateEducation(index, 'startDate', value)
                  }
                  placeholder="YYYY-MM"
                />
                <FormField
                  label="End Date"
                  value={item.endDate}
                  onChange={(value) => updateEducation(index, 'endDate', value)}
                  placeholder="YYYY-MM or Present"
                />
                <FormField
                  label="Score"
                  value={item.score}
                  onChange={(value) => updateEducation(index, 'score', value)}
                  placeholder="Grade or GPA"
                />
              </div>
              <ArrayField
                items={item.courses || []}
                onAdd={() => {
                  const newEducation = [...(resume.education || [])];
                  newEducation[index] = {
                    ...newEducation[index],
                    courses: [...(newEducation[index].courses || []), ''],
                  };
                  onChange({ ...resume, education: newEducation });
                }}
                onRemove={(courseIndex) => {
                  const newEducation = [...(resume.education || [])];
                  newEducation[index].courses.splice(courseIndex, 1);
                  onChange({ ...resume, education: newEducation });
                }}
                addLabel="Add Course"
                renderItem={(course, courseIndex) => (
                  <FormField
                    value={course}
                    onChange={(value) => {
                      const newEducation = [...(resume.education || [])];
                      newEducation[index].courses[courseIndex] = value;
                      onChange({ ...resume, education: newEducation });
                    }}
                    placeholder="Course name or code"
                  />
                )}
              />
            </div>
          )}
        />
      </FormSection>

      <FormSection title="Awards">
        <ArrayField
          items={resume.awards || []}
          onAdd={() =>
            addArrayItem('awards', {
              title: '',
              date: '',
              awarder: '',
              summary: '',
            })
          }
          onRemove={(index) => removeArrayItem('awards', index)}
          addLabel="Add Award"
          renderItem={(item, index) => (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Title"
                value={item.title}
                onChange={(value) => updateAwards(index, 'title', value)}
                placeholder="Award Title"
              />
              <FormField
                label="Date"
                value={item.date}
                onChange={(value) => updateAwards(index, 'date', value)}
                placeholder="YYYY-MM-DD"
              />
              <FormField
                label="Awarder"
                value={item.awarder}
                onChange={(value) => updateAwards(index, 'awarder', value)}
                placeholder="Organization"
              />
              <FormField
                label="Summary"
                type="textarea"
                value={item.summary}
                onChange={(value) => updateAwards(index, 'summary', value)}
                placeholder="Description of the award..."
              />
            </div>
          )}
        />
      </FormSection>

      <FormSection title="Certificates">
        <ArrayField
          items={resume.certificates || []}
          onAdd={() =>
            addArrayItem('certificates', {
              name: '',
              date: '',
              issuer: '',
              url: '',
            })
          }
          onRemove={(index) => removeArrayItem('certificates', index)}
          addLabel="Add Certificate"
          renderItem={(item, index) => (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Name"
                value={item.name}
                onChange={(value) => updateCertificates(index, 'name', value)}
                placeholder="Certificate Name"
              />
              <FormField
                label="Date"
                value={item.date}
                onChange={(value) => updateCertificates(index, 'date', value)}
                placeholder="YYYY-MM-DD"
              />
              <FormField
                label="Issuer"
                value={item.issuer}
                onChange={(value) => updateCertificates(index, 'issuer', value)}
                placeholder="Issuing Organization"
              />
              <FormField
                label="URL"
                type="url"
                value={item.url}
                onChange={(value) => updateCertificates(index, 'url', value)}
                placeholder="https://certificate.com"
              />
            </div>
          )}
        />
      </FormSection>

      <FormSection title="Publications">
        <ArrayField
          items={resume.publications || []}
          onAdd={() =>
            addArrayItem('publications', {
              name: '',
              publisher: '',
              releaseDate: '',
              url: '',
              summary: '',
            })
          }
          onRemove={(index) => removeArrayItem('publications', index)}
          addLabel="Add Publication"
          renderItem={(item, index) => (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Name"
                value={item.name}
                onChange={(value) => updatePublications(index, 'name', value)}
                placeholder="Publication Title"
              />
              <FormField
                label="Publisher"
                value={item.publisher}
                onChange={(value) =>
                  updatePublications(index, 'publisher', value)
                }
                placeholder="Publisher Name"
              />
              <FormField
                label="Release Date"
                value={item.releaseDate}
                onChange={(value) =>
                  updatePublications(index, 'releaseDate', value)
                }
                placeholder="YYYY-MM-DD"
              />
              <FormField
                label="URL"
                type="url"
                value={item.url}
                onChange={(value) => updatePublications(index, 'url', value)}
                placeholder="https://publication.com"
              />
              <FormField
                label="Summary"
                type="textarea"
                value={item.summary}
                onChange={(value) =>
                  updatePublications(index, 'summary', value)
                }
                placeholder="Description of the publication..."
              />
            </div>
          )}
        />
      </FormSection>

      <FormSection title="Skills">
        <ArrayField
          items={resume.skills || []}
          onAdd={() =>
            addArrayItem('skills', {
              name: '',
              level: '',
              keywords: [],
            })
          }
          onRemove={(index) => removeArrayItem('skills', index)}
          addLabel="Add Skill"
          renderItem={(item, index) => (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Name"
                  value={item.name}
                  onChange={(value) => updateSkills(index, 'name', value)}
                  placeholder="Skill Name"
                />
                <FormField
                  label="Level"
                  value={item.level}
                  onChange={(value) => updateSkills(index, 'level', value)}
                  placeholder="Beginner, Intermediate, Expert"
                />
              </div>
              <ArrayField
                items={item.keywords || []}
                onAdd={() => {
                  const newSkills = [...(resume.skills || [])];
                  newSkills[index] = {
                    ...newSkills[index],
                    keywords: [...(newSkills[index].keywords || []), ''],
                  };
                  onChange({ ...resume, skills: newSkills });
                }}
                onRemove={(keywordIndex) => {
                  const newSkills = [...(resume.skills || [])];
                  newSkills[index].keywords.splice(keywordIndex, 1);
                  onChange({ ...resume, skills: newSkills });
                }}
                addLabel="Add Keyword"
                renderItem={(keyword, keywordIndex) => (
                  <FormField
                    value={keyword}
                    onChange={(value) => {
                      const newSkills = [...(resume.skills || [])];
                      newSkills[index].keywords[keywordIndex] = value;
                      onChange({ ...resume, skills: newSkills });
                    }}
                    placeholder="Related technology or tool"
                  />
                )}
              />
            </div>
          )}
        />
      </FormSection>

      <FormSection title="Languages">
        <ArrayField
          items={resume.languages || []}
          onAdd={() =>
            addArrayItem('languages', {
              language: '',
              fluency: '',
            })
          }
          onRemove={(index) => removeArrayItem('languages', index)}
          addLabel="Add Language"
          renderItem={(item, index) => (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Language"
                value={item.language}
                onChange={(value) => updateLanguages(index, 'language', value)}
                placeholder="Language Name"
              />
              <FormField
                label="Fluency"
                value={item.fluency}
                onChange={(value) => updateLanguages(index, 'fluency', value)}
                placeholder="Native Speaker, Fluent, Intermediate, etc."
              />
            </div>
          )}
        />
      </FormSection>

      <FormSection title="Interests">
        <ArrayField
          items={resume.interests || []}
          onAdd={() =>
            addArrayItem('interests', {
              name: '',
              keywords: [],
            })
          }
          onRemove={(index) => removeArrayItem('interests', index)}
          addLabel="Add Interest"
          renderItem={(item, index) => (
            <div className="space-y-4">
              <FormField
                label="Name"
                value={item.name}
                onChange={(value) => updateInterests(index, 'name', value)}
                placeholder="Interest Name"
              />
              <ArrayField
                items={item.keywords || []}
                onAdd={() => {
                  const newInterests = [...(resume.interests || [])];
                  newInterests[index] = {
                    ...newInterests[index],
                    keywords: [...(newInterests[index].keywords || []), ''],
                  };
                  onChange({ ...resume, interests: newInterests });
                }}
                onRemove={(keywordIndex) => {
                  const newInterests = [...(resume.interests || [])];
                  newInterests[index].keywords.splice(keywordIndex, 1);
                  onChange({ ...resume, interests: newInterests });
                }}
                addLabel="Add Keyword"
                renderItem={(keyword, keywordIndex) => (
                  <FormField
                    value={keyword}
                    onChange={(value) => {
                      const newInterests = [...(resume.interests || [])];
                      newInterests[index].keywords[keywordIndex] = value;
                      onChange({ ...resume, interests: newInterests });
                    }}
                    placeholder="Related activity or topic"
                  />
                )}
              />
            </div>
          )}
        />
      </FormSection>

      <FormSection title="References">
        <ArrayField
          items={resume.references || []}
          onAdd={() =>
            addArrayItem('references', {
              name: '',
              reference: '',
            })
          }
          onRemove={(index) => removeArrayItem('references', index)}
          addLabel="Add Reference"
          renderItem={(item, index) => (
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Name"
                value={item.name}
                onChange={(value) => updateReferences(index, 'name', value)}
                placeholder="Reference Name"
              />
              <FormField
                label="Reference"
                type="textarea"
                value={item.reference}
                onChange={(value) =>
                  updateReferences(index, 'reference', value)
                }
                placeholder="Reference text..."
              />
            </div>
          )}
        />
      </FormSection>

      <FormSection title="Projects">
        <ArrayField
          items={resume.projects || []}
          onAdd={() =>
            addArrayItem('projects', {
              name: '',
              description: '',
              highlights: [],
              keywords: [],
              startDate: '',
              endDate: '',
              url: '',
              roles: [],
            })
          }
          onRemove={(index) => removeArrayItem('projects', index)}
          addLabel="Add Project"
          renderItem={(item, index) => (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Name"
                  value={item.name}
                  onChange={(value) => updateProjects(index, 'name', value)}
                  placeholder="Project Name"
                />
                <FormField
                  label="URL"
                  type="url"
                  value={item.url}
                  onChange={(value) => updateProjects(index, 'url', value)}
                  placeholder="https://project.com"
                />
                <FormField
                  label="Start Date"
                  value={item.startDate}
                  onChange={(value) =>
                    updateProjects(index, 'startDate', value)
                  }
                  placeholder="YYYY-MM"
                />
                <FormField
                  label="End Date"
                  value={item.endDate}
                  onChange={(value) => updateProjects(index, 'endDate', value)}
                  placeholder="YYYY-MM or Present"
                />
              </div>
              <FormField
                label="Description"
                type="textarea"
                value={item.description}
                onChange={(value) =>
                  updateProjects(index, 'description', value)
                }
                placeholder="Project description..."
              />
              <ArrayField
                items={item.highlights || []}
                onAdd={() => {
                  const newProjects = [...(resume.projects || [])];
                  newProjects[index] = {
                    ...newProjects[index],
                    highlights: [...(newProjects[index].highlights || []), ''],
                  };
                  onChange({ ...resume, projects: newProjects });
                }}
                onRemove={(highlightIndex) => {
                  const newProjects = [...(resume.projects || [])];
                  newProjects[index].highlights.splice(highlightIndex, 1);
                  onChange({ ...resume, projects: newProjects });
                }}
                addLabel="Add Highlight"
                renderItem={(highlight, highlightIndex) => (
                  <FormField
                    value={highlight}
                    onChange={(value) => {
                      const newProjects = [...(resume.projects || [])];
                      newProjects[index].highlights[highlightIndex] = value;
                      onChange({ ...resume, projects: newProjects });
                    }}
                    placeholder="Project achievement or feature..."
                  />
                )}
              />
            </div>
          )}
        />
      </FormSection>
    </div>
  );
}
