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
 * Format salary for display
 */
function formatSalary(salary) {
  if (!salary) return null;

  // Handle string salary like "$120,000 - $150,000" or "120k-150k"
  const str = String(salary).toLowerCase();

  // Extract numbers
  const numbers = str.match(/[\d,]+/g);
  if (!numbers || numbers.length === 0) return null;

  const values = numbers.map((n) => parseInt(n.replace(/,/g, ''), 10));

  // If values are small (like 120), multiply by 1000 (assume "k" notation)
  const normalized = values.map((v) => (v < 1000 ? v * 1000 : v));

  if (normalized.length >= 2) {
    const min = Math.min(...normalized);
    const max = Math.max(...normalized);
    return `$${Math.round(min / 1000)}k-$${Math.round(max / 1000)}k`;
  }

  return `$${Math.round(normalized[0] / 1000)}k`;
}

/**
 * Get salary level (0-1) for gradient
 */
function getSalaryLevel(salary) {
  if (!salary) return 0.5;

  const str = String(salary).toLowerCase();
  const numbers = str.match(/[\d,]+/g);
  if (!numbers) return 0.5;

  const values = numbers.map((n) => parseInt(n.replace(/,/g, ''), 10));
  const normalized = values.map((v) => (v < 1000 ? v * 1000 : v));
  const avg = normalized.reduce((a, b) => a + b, 0) / normalized.length;

  // Normalize to 0-1 scale (assuming $50k-$300k range)
  return Math.min(1, Math.max(0, (avg - 50000) / 250000));
}

/**
 * Custom Job Node with rich design
 */
function JobNode({ data, selected }) {
  const { jobInfo, isResume, isRead, showSalaryGradient, salaryLevel } = data;
  const [imgError, setImgError] = useState(false);

  // Resume node rendering
  if (isResume) {
    return (
      <div className="resume-node-custom">
        <Handle type="source" position={Position.Right} />
        <div className="resume-icon">📄</div>
        <div className="resume-label">Your Resume</div>
      </div>
    );
  }

  const title = jobInfo?.title || 'Unknown Position';
  const company = jobInfo?.company || 'Unknown Company';
  const salary = formatSalary(jobInfo?.salary);
  const isRemote =
    jobInfo?.remote === true ||
    jobInfo?.remote === 'true' ||
    String(jobInfo?.remote).toLowerCase().includes('remote');
  const jobType = jobInfo?.type;
  const website = jobInfo?.website || jobInfo?.url || jobInfo?.companyUrl;
  const domain = extractDomain(website || `${company.replace(/\s+/g, '')}.com`);

  // Calculate background based on salary or read status
  const level = showSalaryGradient
    ? salaryLevel ?? getSalaryLevel(jobInfo?.salary)
    : 0.5;

  return (
    <div
      className={`job-node-custom ${selected ? 'selected' : ''} ${
        isRead ? 'read' : ''
      }`}
      style={{
        '--salary-level': level,
      }}
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
        {salary && (
          <div className="salary-badge">
            <span className="salary-icon">💰</span>
            {salary}
          </div>
        )}
        {jobType && !salary && <div className="type-badge">{jobType}</div>}
      </div>
    </div>
  );
}

export default memo(JobNode);
