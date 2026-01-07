import { MapPin, Mail, Phone, Globe } from 'lucide-react';
import { getProfileIcon } from './utils';

export default function HeaderSection({ basics }) {
  if (!basics) return null;

  return (
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
        <p className="mt-6 text-gray-700 leading-relaxed">{basics.summary}</p>
      )}
    </header>
  );
}
