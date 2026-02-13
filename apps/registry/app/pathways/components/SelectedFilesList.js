import { X, FileText, File } from 'lucide-react';

function getFileIcon(file) {
  if (file.type.startsWith('image/')) return File;
  return FileText;
}

export default function SelectedFilesList({
  files,
  onRemove,
  onUpload,
  isUploading,
}) {
  if (files.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">
        Selected Files ({files.length})
      </p>
      {files.map((file, index) => {
        const IconComponent = getFileIcon(file);
        return (
          <div
            key={index}
            className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
          >
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <IconComponent className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(index);
              }}
              className="p-1 text-gray-400 hover:text-gray-600"
              disabled={isUploading}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}

      <button
        onClick={onUpload}
        disabled={isUploading || files.length === 0}
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isUploading
          ? 'Processing...'
          : `Parse Resume${files.length > 1 ? 's' : ''}`}
      </button>
    </div>
  );
}
