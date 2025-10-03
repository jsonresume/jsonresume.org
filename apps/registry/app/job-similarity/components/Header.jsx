import { memo } from 'react';

export const Header = memo(() => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold mb-4">Job Market Similarity</h1>
    <div className="space-y-4 text-gray-700">
      <p>
        An interactive visualization of the tech job market, powered by data
        from HN "Who's Hiring" threads and the JSON Resume Registry. Each node
        represents a job category, with edges connecting similar roles. The size
        of each node indicates the number of job listings in that category.
      </p>
      <p>
        Hover over a node to see details about the companies and locations
        hiring for that role. Click a node to view the original job listing or
        resume profile.
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Jobs View:</strong> Job posts from "Who's Hiring" → GPT-4
          standardization → OpenAI embeddings
        </li>
        <li>
          <strong>Resumes View:</strong> JSON Resume profiles → OpenAI
          embeddings
        </li>
      </ul>
      <p>
        Multiple graph algorithms available to explore different relationships.
      </p>
    </div>
  </div>
));

Header.displayName = 'Header';
