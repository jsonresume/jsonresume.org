'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, File, AlertCircle } from 'lucide-react';

const ACCEPTED_FILE_TYPES = {
  'text/plain': '.txt',
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    '.docx',
  'application/rtf': '.rtf',
  'image/png': '.png',
  'image/jpeg': '.jpg,.jpeg',
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function FileUpload({ onFileUpload, isUploading = false }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validateFile = useCallback((file) => {
    if (file.size > MAX_FILE_SIZE) {
      return `File "${file.name}" is too large. Maximum size is 10MB.`;
    }

    if (!Object.keys(ACCEPTED_FILE_TYPES).includes(file.type)) {
      return `File "${file.name}" type is not supported. Supported types: PDF, DOC, DOCX, TXT, RTF, PNG, JPG.`;
    }

    return null;
  }, []);

  const handleFiles = useCallback(
    (files) => {
      setError('');
      const fileList = Array.from(files);

      // Validate all files first
      for (const file of fileList) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          return;
        }
      }

      setSelectedFiles(fileList);
    },
    [validateFile]
  );

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleChange = useCallback(
    (e) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles]
  );

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0 || isUploading) return;

    try {
      setError('');
      await onFileUpload(selectedFiles);
      setSelectedFiles([]);
    } catch (err) {
      setError(err.message || 'Failed to upload files');
    }
  }, [selectedFiles, isUploading, onFileUpload]);

  const removeFile = useCallback((index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return File;
    if (file.type === 'application/pdf') return FileText;
    return FileText;
  };

  return (
    <div className="w-full space-y-3">
      {/* Upload Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer ${
          dragActive
            ? 'border-indigo-400 bg-indigo-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={Object.values(ACCEPTED_FILE_TYPES).join(',')}
          onChange={handleChange}
          className="hidden"
          disabled={isUploading}
        />

        <div className="flex flex-col items-center justify-center text-center">
          <Upload
            className={`w-8 h-8 mb-2 ${
              dragActive ? 'text-indigo-500' : 'text-gray-400'
            }`}
          />
          <p className="text-sm font-medium text-gray-900">
            {dragActive ? 'Drop files here' : 'Upload resume files'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Click to browse or drag files here
          </p>
          <p className="text-xs text-gray-400 mt-1">
            PDF, DOC, DOCX, TXT, RTF, PNG, JPG (max 10MB each)
          </p>
        </div>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Selected Files ({selectedFiles.length})
          </p>
          {selectedFiles.map((file, index) => {
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
                    removeFile(index);
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
            onClick={handleUpload}
            disabled={isUploading || selectedFiles.length === 0}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading
              ? 'Processing...'
              : `Parse Resume${selectedFiles.length > 1 ? 's' : ''}`}
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
