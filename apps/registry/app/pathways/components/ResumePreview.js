'use client';

import {
  MapPin,
  Mail,
  Phone,
  Globe,
  Calendar,
  Award,
  BookOpen,
  Briefcase,
  User,
  Github,
  Linkedin,
  Twitter,
} from 'lucide-react';

export default function ResumePreview({ resumeData }) {
  if (!resumeData) return null;

  const { basics, work, education, skills, awards, publications, volunteer } =
    resumeData;

  const getProfileIcon = (network) => {
    const icons = {
      github: Github,
      linkedin: Linkedin,
      twitter: Twitter,
    };
    const Icon = icons[network?.toLowerCase()] || Globe;
    return <Icon className="w-4 h-4" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-full bg-white">
      <div className="max-w-4xl mx-auto p-8 lg:p-12">
        {/* Header Section */}
        {basics && (
          <header className="mb-10 pb-8 border-b-2 border-gray-200">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {basics.name || 'Your Name'}
            </h1>
            {basics.label && (
              <p className="text-xl text-gray-600 mb-4">{basics.label}</p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {basics.email && (
                <a
                  href={`mailto:${basics.email}`}
                  className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {basics.email}
                </a>
              )}
              {basics.phone && (
                <a
                  href={`tel:${basics.phone}`}
                  className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {basics.phone}
                </a>
              )}
              {basics.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {[
                    basics.location.city,
                    basics.location.region,
                    basics.location.countryCode,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              )}
              {basics.url && (
                <a
                  href={basics.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  {basics.url.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>

            {basics.profiles && basics.profiles.length > 0 && (
              <div className="flex gap-3 mt-4">
                {basics.profiles.map((profile, idx) => (
                  <a
                    key={idx}
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
                  >
                    {getProfileIcon(profile.network)}
                    <span>{profile.username || profile.network}</span>
                  </a>
                ))}
              </div>
            )}

            {basics.summary && (
              <p className="mt-6 text-gray-700 leading-relaxed">
                {basics.summary}
              </p>
            )}
          </header>
        )}

        {/* Work Experience Section */}
        {work && work.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-indigo-600" />
              Work Experience
            </h2>
            <div className="space-y-6">
              {work.map((job, idx) => (
                <div key={idx} className="relative pl-8">
                  <div className="absolute left-0 top-2 w-2 h-2 bg-indigo-600 rounded-full" />
                  <div className="border-l-2 border-gray-200 absolute left-1 top-4 h-full -ml-px" />

                  <div className="pb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {job.position}
                    </h3>
                    <div className="text-gray-700 font-medium">
                      {job.name}
                      {job.url && (
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-indigo-600 text-sm hover:underline"
                        >
                          ↗
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(job.startDate)}
                      {' - '}
                      {job.endDate ? formatDate(job.endDate) : 'Present'}
                    </div>
                    {job.summary && (
                      <p className="mt-3 text-gray-700 leading-relaxed">
                        {job.summary}
                      </p>
                    )}
                    {job.highlights && job.highlights.length > 0 && (
                      <ul className="mt-3 space-y-1">
                        {job.highlights.map((highlight, hidx) => (
                          <li
                            key={hidx}
                            className="text-gray-700 flex items-start"
                          >
                            <span className="text-indigo-600 mr-2">•</span>
                            <span className="flex-1">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {education && education.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              Education
            </h2>
            <div className="space-y-6">
              {education.map((edu, idx) => (
                <div key={idx} className="relative pl-8">
                  <div className="absolute left-0 top-2 w-2 h-2 bg-indigo-600 rounded-full" />
                  <div className="border-l-2 border-gray-200 absolute left-1 top-4 h-full -ml-px" />

                  <div className="pb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {edu.studyType} in {edu.area}
                    </h3>
                    <div className="text-gray-700 font-medium">
                      {edu.institution}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(edu.startDate)}
                      {' - '}
                      {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                    </div>
                    {edu.score && (
                      <p className="mt-2 text-gray-600">GPA: {edu.score}</p>
                    )}
                    {edu.courses && edu.courses.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Relevant Courses:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {edu.courses.map((course, cidx) => (
                            <span
                              key={cidx}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                            >
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-indigo-600" />
              Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((skill, idx) => (
                <div key={idx} className="flex flex-col">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">
                      {skill.name}
                    </span>
                    {skill.level && (
                      <span className="text-sm text-gray-600">
                        {skill.level}
                      </span>
                    )}
                  </div>
                  {skill.level && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${
                            skill.level === 'Master'
                              ? 100
                              : skill.level === 'Expert'
                              ? 90
                              : skill.level === 'Advanced'
                              ? 75
                              : skill.level === 'Intermediate'
                              ? 50
                              : 25
                          }%`,
                        }}
                      />
                    </div>
                  )}
                  {skill.keywords && skill.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {skill.keywords.map((keyword, kidx) => (
                        <span
                          key={kidx}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Awards Section */}
        {awards && awards.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="w-6 h-6 text-indigo-600" />
              Awards
            </h2>
            <div className="space-y-4">
              {awards.map((award, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {award.title}
                    </h3>
                    <p className="text-gray-600">
                      {award.awarder} • {formatDate(award.date)}
                    </p>
                    {award.summary && (
                      <p className="mt-1 text-gray-700">{award.summary}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Volunteer Section */}
        {volunteer && volunteer.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Volunteer Experience
            </h2>
            <div className="space-y-4">
              {volunteer.map((vol, idx) => (
                <div key={idx}>
                  <h3 className="font-semibold text-gray-900">
                    {vol.position} at {vol.organization}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(vol.startDate)} -{' '}
                    {vol.endDate ? formatDate(vol.endDate) : 'Present'}
                  </p>
                  {vol.summary && (
                    <p className="mt-2 text-gray-700">{vol.summary}</p>
                  )}
                  {vol.highlights && vol.highlights.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {vol.highlights.map((highlight, hidx) => (
                        <li
                          key={hidx}
                          className="text-gray-700 flex items-start"
                        >
                          <span className="text-indigo-600 mr-2">•</span>
                          <span className="flex-1">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Publications Section */}
        {publications && publications.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Publications
            </h2>
            <div className="space-y-4">
              {publications.map((pub, idx) => (
                <div key={idx}>
                  <h3 className="font-semibold text-gray-900">{pub.name}</h3>
                  <p className="text-gray-600">
                    {pub.publisher} • {formatDate(pub.releaseDate)}
                  </p>
                  {pub.summary && (
                    <p className="mt-1 text-gray-700">{pub.summary}</p>
                  )}
                  {pub.url && (
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 text-sm hover:underline"
                    >
                      View Publication →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
