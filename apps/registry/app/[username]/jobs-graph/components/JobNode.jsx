'use client';

import { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';

/**
 * Extract domain from URL for favicon
 */
function extractDomain(url) {
  if (!url) return null;
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname;
  } catch {
    return url.replace(/^(https?:\/\/)?/, '').split('/')[0];
  }
}

/**
 * Format normalized USD salary for display
 */
function formatNormalizedSalary(jobInfo) {
  const min = jobInfo?.salaryMin || jobInfo?.salaryUsd;
  const max = jobInfo?.salaryMax || jobInfo?.salaryUsd;

  if (!min && !max) return null;

  if (min === max || !max) {
    return `$${Math.round(min / 1000)}k`;
  }
  return `$${Math.round(min / 1000)}k-${Math.round(max / 1000)}k`;
}

/**
 * Get salary display info - returns both normalized USD and original string
 */
function getSalaryDisplay(jobInfo) {
  const hasNormalized =
    jobInfo?.salaryMin || jobInfo?.salaryMax || jobInfo?.salaryUsd;
  const originalString = jobInfo?.salary;

  if (!hasNormalized && !originalString) {
    return null;
  }

  const normalized = formatNormalizedSalary(jobInfo);

  // Check if original is different from normalized (e.g., different currency)
  const showOriginal =
    originalString &&
    normalized &&
    !originalString.toLowerCase().includes('usd') &&
    (originalString.includes('€') ||
      originalString.includes('£') ||
      originalString.includes('INR') ||
      originalString.includes('CAD') ||
      originalString.includes('AUD') ||
      /\b(EUR|GBP|JPY|CHF)\b/i.test(originalString));

  return {
    normalized: normalized || null,
    original: showOriginal ? originalString : null,
    display: normalized || originalString,
  };
}

/**
 * Get salary level (0-1) for gradient - uses salaryMax from normalized data
 */
function getSalaryLevel(jobInfo, salaryRange) {
  // Use normalized salaryMax from database (preferred)
  const salaryMax = jobInfo?.salaryMax || jobInfo?.salaryUsd;

  if (salaryMax && salaryRange?.p5 && salaryRange?.p95) {
    // Use percentile range for better distribution
    const range = salaryRange.p95 - salaryRange.p5;
    if (range > 0) {
      return Math.min(1, Math.max(0, (salaryMax - salaryRange.p5) / range));
    }
  }

  if (salaryMax) {
    // Fallback to static range if no salaryRange provided
    return Math.min(1, Math.max(0, (salaryMax - 50000) / 250000));
  }

  // Fallback to parsing salary string
  const salary = jobInfo?.salary;
  if (!salary) return 0.5;

  const str = String(salary).toLowerCase();
  const numbers = str.match(/[\d,]+/g);
  if (!numbers) return 0.5;

  const values = numbers.map((n) => parseInt(n.replace(/,/g, ''), 10));
  const normalized = values.map((v) => (v < 1000 ? v * 1000 : v));
  const max = Math.max(...normalized);

  // Normalize to 0-1 scale (assuming $50k-$300k range)
  return Math.min(1, Math.max(0, (max - 50000) / 250000));
}

/**
 * Get solid background color based on salary level (0-1)
 * Scale: light green -> dark green (gray if no salary)
 */
function getSalaryColor(level, hasSalary) {
  // No salary = gray
  if (!hasSalary) {
    return { bg: '#f1f5f9', border: '#e2e8f0' }; // slate-100
  }

  // Green scale from light to dark
  const colors = [
    { bg: '#dcfce7', border: '#bbf7d0' }, // 0.0 - green-100
    { bg: '#bbf7d0', border: '#86efac' }, // 0.25 - green-200
    { bg: '#86efac', border: '#4ade80' }, // 0.5 - green-300
    { bg: '#4ade80', border: '#22c55e' }, // 0.75 - green-400
    { bg: '#22c55e', border: '#16a34a' }, // 1.0 - green-500
  ];

  // Pick the nearest color based on level
  const idx = Math.min(Math.floor(level * colors.length), colors.length - 1);
  return colors[idx];
}

/**
 * Custom Job Node with rich design
 */
function JobNode({ data, selected }) {
  const {
    jobInfo,
    isResume,
    isRead,
    isInterested,
    showSalaryGradient,
    salaryLevel,
    childCount,
  } = data;
  const [imgError, setImgError] = useState(false);

  // Resume node rendering
  if (isResume) {
    return (
      <div className="resume-node-custom">
        <Handle type="source" position={Position.Right} />
        <div className="resume-icon">📄</div>
        <div className="resume-label">Your Resume</div>
        {childCount > 0 && (
          <div className="child-count-badge resume-child-count">
            {childCount}
          </div>
        )}
      </div>
    );
  }

  const title = jobInfo?.title || 'Unknown Position';
  const company = jobInfo?.company || 'Unknown Company';
  const salaryInfo = getSalaryDisplay(jobInfo);
  const isRemote =
    jobInfo?.remote === true ||
    jobInfo?.remote === 'true' ||
    String(jobInfo?.remote).toLowerCase().includes('remote');
  const jobType = jobInfo?.type;
  const website = jobInfo?.website || jobInfo?.url || jobInfo?.companyUrl;
  const domain = extractDomain(website || `${company.replace(/\s+/g, '')}.com`);

  // Calculate background based on salary when gradient mode is enabled
  const hasSalary = Boolean(salaryInfo?.display);
  const level = salaryLevel ?? getSalaryLevel(jobInfo, data.salaryRange);
  const salaryColors = showSalaryGradient
    ? getSalaryColor(level, hasSalary)
    : null;

  return (
    <div
      className={`job-node-custom ${selected ? 'selected' : ''} ${
        isRead ? 'read' : ''
      } ${isInterested ? 'interested' : ''} ${
        showSalaryGradient ? 'salary-gradient' : ''
      }`}
      style={
        showSalaryGradient && salaryColors
          ? {
              background: salaryColors.bg,
              borderColor: salaryColors.border,
            }
          : undefined
      }
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />

      {/* Header with favicon and company */}
      <div className="node-header">
        <div className="favicon-wrapper">
          {!imgError && domain ? (
            <img
              src={`/api/favicon?url=${encodeURIComponent(domain)}`}
              alt=""
              className="favicon"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="favicon-placeholder">
              {company.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="company-info">
          <span className="company-name">{company}</span>
          {isRemote && <span className="remote-badge">Remote</span>}
        </div>
      </div>

      {/* Job title */}
      <div className="job-title">{title}</div>

      {/* Footer with salary and type */}
      <div className="node-footer">
        {salaryInfo && (
          <div className="salary-badge">
            <span className="salary-icon">💰</span>
            <span className="salary-text">
              <span className="salary-normalized">{salaryInfo.display}</span>
              {salaryInfo.original && (
                <span className="salary-original">{salaryInfo.original}</span>
              )}
            </span>
          </div>
        )}
        {jobType && !salaryInfo && <div className="type-badge">{jobType}</div>}
      </div>

      {/* Child count badge */}
      {childCount > 0 && <div className="child-count-badge">{childCount}</div>}
    </div>
  );
}

export default memo(JobNode);
