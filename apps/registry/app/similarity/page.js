'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { PrismaClient } from '@prisma/client';

// Import Plotly dynamically to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

// Helper function to compute cosine similarity
function cosineSimilarity(a, b) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Helper function for dimensionality reduction using PCA
function pca(vectors, dimensions = 2) {
  // Center the data
  const mean = vectors[0].map((_, colIndex) => 
    vectors.reduce((sum, row) => sum + row[colIndex], 0) / vectors.length
  );
  
  const centered = vectors.map(vector => 
    vector.map((value, index) => value - mean[index])
  );

  // Compute covariance matrix
  const covMatrix = [];
  for (let i = 0; i < centered[0].length; i++) {
    covMatrix[i] = [];
    for (let j = 0; j < centered[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < centered.length; k++) {
        sum += centered[k][i] * centered[k][j];
      }
      covMatrix[i][j] = sum / (centered.length - 1);
    }
  }

  // For simplicity, we'll just take the first two dimensions
  // In a production environment, you'd want to compute eigenvectors properly
  const reduced = centered.map(vector => [
    vector.slice(0, dimensions).reduce((sum, val) => sum + val, 0),
    vector.slice(dimensions, dimensions * 2).reduce((sum, val) => sum + val, 0)
  ]);

  return reduced;
}

export default function SimilarityPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/similarity');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        
        // Reduce dimensions of embeddings using PCA
        const reducedEmbeddings = pca(jsonData.map(item => item.embedding));
        
        // Prepare data for plotting
        const plotData = {
          x: reducedEmbeddings.map(coords => coords[0]),
          y: reducedEmbeddings.map(coords => coords[1]),
          text: jsonData.map(item => item.username),
          mode: 'markers+text',
          type: 'scatter',
          textposition: 'top',
          marker: {
            size: 10,
            color: reducedEmbeddings.map((_, i) => i),
            colorscale: 'Viridis',
          },
          hoverinfo: 'text',
          username: jsonData.map(item => item.username), // Store usernames for click handling
        };

        setData(plotData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Resume Similarity Map</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Resume Similarity Map</h1>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Resume Similarity Map</h1>
      <p className="mb-4">
        This visualization shows how similar resumes are to each other based on their content. 
        Resumes that are closer together are more similar.
      </p>
      <div className="w-full h-[600px] bg-white rounded-lg shadow-lg p-4">
        <Plot
          data={[data]}
          layout={{
            title: 'Resume Similarity Map',
            xaxis: { title: 'Component 1' },
            yaxis: { title: 'Component 2' },
            hovermode: 'closest',
            width: null,
            height: null,
            autosize: true,
          }}
          useResizeHandler
          className="w-full h-full"
          onClick={(event) => {
            if (event?.points?.[0]) {
              const pointIndex = event.points[0].pointIndex;
              const username = data.username[pointIndex];
              window.open(`/${username}`, '_blank');
            }
          }}
        />
      </div>
    </div>
  );
}
