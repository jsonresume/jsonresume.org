import { useRouter } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';

export function ProfileCard({ resume, username, image }) {
  const router = useRouter();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col items-center">
        <img
          src={image}
          alt={`${resume.basics.name}`}
          className="w-[150px] h-[150px] rounded-full border-4 border-white shadow-md"
        />
        <h2 className="mt-4 mb-2 text-3xl font-semibold text-gray-800">
          {resume.basics.name}
        </h2>
        <p className="mb-2 text-xl text-gray-600">@{username}</p>
        <p className="mb-4 text-lg text-gray-700 text-center">
          {resume.basics.label}
        </p>
        {resume.basics.location && (
          <div className="flex items-center mb-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-1" />
            <span>
              {resume.basics.location.city}, {resume.basics.location.region}
            </span>
          </div>
        )}
        <div className="w-full mt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push('/editor')}
          >
            Edit Resume
          </Button>
        </div>
      </div>
    </div>
  );
}
