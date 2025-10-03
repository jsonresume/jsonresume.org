import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <Loader2 className="mr-2 h-16 w-16 animate-spin" />
    </div>
  );
}
