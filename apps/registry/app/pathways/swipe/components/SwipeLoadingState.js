import SwipeHeader from './SwipeHeader';

export default function SwipeLoadingState({ message }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SwipeHeader />
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] p-6">
        <div className="w-16 h-16 mb-6 relative">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
        </div>
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  );
}
