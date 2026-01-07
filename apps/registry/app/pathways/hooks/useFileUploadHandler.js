'use client';

import { useState, useCallback } from 'react';
import pathwaysToast from '../utils/toastMessages';

/**
 * Hook to handle file upload and resume parsing workflow
 */
export default function useFileUploadHandler({ sendMessage }) {
  const [pendingResumeData, setPendingResumeData] = useState(null);
  const [isApplyingResume, setIsApplyingResume] = useState(false);

  // Handle file upload and resume extraction
  const handleFileUpload = useCallback((extractedData) => {
    const firstFile = extractedData[0];
    if (firstFile) {
      setPendingResumeData({
        filename: firstFile.filename,
        data: firstFile.data,
      });
      pathwaysToast.resumeParsed(firstFile.filename);
    }
  }, []);

  // Handle applying parsed resume data
  const handleApplyResumeData = useCallback(
    async (selectedData) => {
      if (!pendingResumeData) return;

      setIsApplyingResume(true);
      try {
        const uploadMessage = `I've uploaded a resume file (${
          pendingResumeData.filename
        }). Please analyze and update my resume with this information: ${JSON.stringify(
          selectedData,
          null,
          2
        )}`;
        sendMessage({ text: uploadMessage });
        setPendingResumeData(null);
      } catch (error) {
        pathwaysToast.uploadError(pendingResumeData.filename);
      } finally {
        setIsApplyingResume(false);
      }
    },
    [pendingResumeData, sendMessage]
  );

  // Handle dismissing the parse result
  const handleDismissParseResult = useCallback(() => {
    setPendingResumeData(null);
  }, []);

  return {
    pendingResumeData,
    isApplyingResume,
    handleFileUpload,
    handleApplyResumeData,
    handleDismissParseResult,
  };
}
