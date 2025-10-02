export const LoadingAnimation = () => (
  <div className="loading-container">
    <div className="graph-loader">
      <div className="resume-node-loader" />
      <div className="job-nodes">
        <div className="job-node-loader n1" />
        <div className="job-node-loader n2" />
        <div className="job-node-loader n3" />
        <div className="job-node-loader n4" />
        <div className="job-node-loader n5" />
      </div>
      <svg
        className="connections"
        width="100%"
        height="100%"
        viewBox="0 0 400 300"
      >
        <path className="connection c1" d="M200,100 L120,180" />
        <path className="connection c2" d="M200,100 L200,180" />
        <path className="connection c3" d="M200,100 L280,180" />
        <path className="connection c4" d="M120,180 L80,260" />
        <path className="connection c5" d="M280,180 L320,260" />
      </svg>
      <div className="floating-icons">
        <div className="floating-icon i1">💼</div>
        <div className="floating-icon i2">📝</div>
        <div className="floating-icon i3">💻</div>
        <div className="floating-icon i4">📊</div>
      </div>
    </div>
    <div className="loading-text">
      <p className="text-lg">Analyzing job matches...</p>
      <p className="mt-2 text-sm text-gray-500">
        Building your personalized job graph. This might take a minute.
      </p>
    </div>
  </div>
);
