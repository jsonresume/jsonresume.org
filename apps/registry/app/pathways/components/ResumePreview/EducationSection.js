import { BookOpen, Calendar } from 'lucide-react';
import { formatDate } from './utils';

export default function EducationSection({ education }) {
  if (!education || education.length === 0) return null;

  return (
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
              <div className="text-gray-700 font-medium">{edu.institution}</div>
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <Calendar className="w-3 h-3" />
                {formatDate(edu.startDate)} -{' '}
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
  );
}
