import { memo } from 'react';
import { allAlgorithms } from '../utils/allAlgorithms';

export const Controls = memo(
  ({ dataSource, setDataSource, algorithm, setAlgorithm }) => (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Source
          </label>
          <select
            value={dataSource}
            onChange={(e) => setDataSource(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm rounded-md"
          >
            <option value="jobs">Job Listings</option>
            <option value="resumes">Resumes</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Algorithm
          </label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-secondary-500 focus:border-secondary-500 sm:text-sm rounded-md"
          >
            {Object.entries(allAlgorithms).map(([key, { name }]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
);

Controls.displayName = 'Controls';
