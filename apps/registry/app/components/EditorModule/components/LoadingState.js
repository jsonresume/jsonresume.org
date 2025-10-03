import { FileJson } from 'lucide-react';
import { Badge, Card, CardContent } from '@repo/ui';

export function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />

      <Card className="max-w-md w-full relative backdrop-blur-xl bg-white/80 border-none shadow-xl">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-6">
              <Badge className="animate-pulse" variant="secondary">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse mr-2" />
                Loading Resume
              </Badge>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <FileJson className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                JSON Resume
              </h2>
            </div>
            <p className="text-gray-600 max-w-sm mx-auto">
              Fetching your resume data...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
