'use client';

import { useState } from 'react';
import { Header } from './components/Header';
import { Controls } from './components/Controls';
import { GraphContainer } from './components/GraphContainer';

export default function Page() {
  const [dataSource, setDataSource] = useState('jobs');
  const [algorithm, setAlgorithm] = useState('mst');

  return (
    <div className="min-h-screen bg-accent-100">
      <div className="prose max-w-3xl mx-auto pt-8 px-4 sm:px-6 lg:px-8">
        <Header />
        <Controls
          dataSource={dataSource}
          setDataSource={setDataSource}
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
        />
      </div>
      <div className="w-full h-[600px] bg-white">
        <GraphContainer dataSource={dataSource} algorithm={algorithm} />
      </div>
    </div>
  );
}
