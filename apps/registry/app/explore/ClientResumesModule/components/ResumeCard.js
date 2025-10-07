import Link from 'next/link';
import { MapPin, Briefcase, ExternalLink, LayoutDashboard } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  Button,
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@repo/ui';

export function ResumeCard({ resume }) {
  const locationString = [
    resume.location?.city,
    resume.location?.region,
    resume.location?.countryCode,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Avatar className="w-16 h-16 border-2 border-gray-100">
            <AvatarImage
              src={resume.image}
              alt={resume.name || resume.username}
            />
            <AvatarFallback>
              {(resume.name || resume.username)?.charAt(0)?.toUpperCase() ||
                'U'}
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {resume.name || resume.username}
            </h3>

            {resume.label && (
              <p className="text-gray-600 text-sm mb-2 truncate">
                <Briefcase className="inline-block w-4 h-4 mr-1 -mt-0.5" />
                {resume.label}
              </p>
            )}

            {locationString && (
              <p className="text-gray-500 text-sm flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{locationString}</span>
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-6 py-4 border-t flex gap-2 justify-end bg-gray-50">
        <Button variant="outline" size="sm" asChild>
          <Link
            href={`/${resume.username}`}
            className="flex items-center gap-1"
          >
            <ExternalLink className="w-4 h-4" />
            View Resume
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link
            href={`/${resume.username}/dashboard`}
            className="flex items-center gap-1"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
