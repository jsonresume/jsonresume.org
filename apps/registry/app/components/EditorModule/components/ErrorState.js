import { FileJson } from 'lucide-react';
import { Badge, Card, CardContent } from '@repo/ui';

export function ErrorState({ error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:20px_20px]" />
      <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />

      <Card className="max-w-md w-full relative backdrop-blur-xl bg-white/80 border-none shadow-xl">
        <CardContent className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-6">
              <Badge variant="destructive">Error</Badge>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <FileJson className="w-8 h-8 text-primary" />
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                JSON Resume
              </h2>
            </div>
            <p className="text-red-600 max-w-sm mx-auto">{error}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
