'use client';

import ReactMarkdown from 'react-markdown';
import Loading from '../../../components/Loading';

export const LetterPreview = ({ submitting, letter }) => {
  if (submitting) {
    return <Loading />;
  }

  if (!submitting && letter) {
    return (
      <div className="min-w-full border border-gray-300 rounded-md p-6 bg-white shadow-md">
        <ReactMarkdown className="m-auto prose lg:prose-xl">
          {letter}
        </ReactMarkdown>
      </div>
    );
  }

  return null;
};
