'use client';

import { memo, useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  getUserCurrency,
  detectCurrency,
  fetchExchangeRates,
  convertCurrency,
  formatCurrencyAmount,
} from '../utils/currencyUtils';

// Global state for exchange rates (shared across all nodes)
let globalRates = null;
let globalUserCurrency = null;
let ratesPromise = null;

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
 * Format salary for display with optional currency conversion
 */
function formatSalary(salary, rates, userCurrency) {
  if (!salary) return null;

  // Handle structured salary object
  if (typeof salary === 'object' && salary.min) {
    const sourceCurrency = salary.currency || 'USD';
    let min = salary.min;
    let max = salary.max || salary.min;

    // Convert if we have rates and currencies differ
    if (rates && userCurrency && sourceCurrency !== userCurrency) {
      min = convertCurrency(min, sourceCurrency, userCurrency, rates);
      max = convertCurrency(max, sourceCurrency, userCurrency, rates);
    }

    const displayCurrency =
      rates && userCurrency ? userCurrency : sourceCurrency;
    const symbol =
      displayCurrency === 'USD'
        ? '$'
        : displayCurrency === 'EUR'
        ? '€'
        : displayCurrency === 'GBP'
        ? '£'
        : '';

    return `${symbol}${Math.round(min / 1000)}k-${symbol}${Math.round(
      max / 1000
    )}k`;
  }

  // Handle string salary like "$120,000 - $150,000" or "120k-150k"
  const str = String(salary).toLowerCase();
  const sourceCurrency = detectCurrency(salary);

  // Extract numbers
  const numbers = str.match(/[\d,]+/g);
  if (!numbers || numbers.length === 0) return null;

  let values = numbers.map((n) => parseInt(n.replace(/,/g, ''), 10));

  // If values are small (like 120), multiply by 1000 (assume "k" notation)
  values = values.map((v) => (v < 1000 ? v * 1000 : v));

  // Convert if we have rates and currencies differ
  if (rates && userCurrency && sourceCurrency !== userCurrency) {
    values = values.map((v) =>
      convertCurrency(v, sourceCurrency, userCurrency, rates)
    );
  }

  const displayCurrency = rates && userCurrency ? userCurrency : sourceCurrency;
  const symbol =
    displayCurrency === 'USD'
      ? '$'
      : displayCurrency === 'EUR'
      ? '€'
      : displayCurrency === 'GBP'
      ? '£'
      : '';

  if (values.length >= 2) {
    const min = Math.min(...values);
    const max = Math.max(...values);
    return `${symbol}${Math.round(min / 1000)}k-${symbol}${Math.round(
      max / 1000
    )}k`;
  }

  return `${symbol}${Math.round(values[0] / 1000)}k`;
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
  const { jobInfo, isResume, isRead, showSalaryGradient, salaryLevel } = data;
  const [imgError, setImgError] = useState(false);
  const [rates, setRates] = useState(globalRates);
  const [userCurrency, setUserCurrency] = useState(globalUserCurrency);

  // Fetch exchange rates once (shared across all nodes)
  useEffect(() => {
    if (globalRates) {
      setRates(globalRates);
      setUserCurrency(globalUserCurrency);
      return;
    }

    if (!ratesPromise) {
      globalUserCurrency = getUserCurrency();
      setUserCurrency(globalUserCurrency);

      ratesPromise = fetchExchangeRates().then((r) => {
        globalRates = r;
        return r;
      });
    }

    ratesPromise.then((r) => setRates(r));
  }, []);

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
  const salary = formatSalary(jobInfo?.salary, rates, userCurrency);
  const isRemote =
    jobInfo?.remote === true ||
    jobInfo?.remote === 'true' ||
    String(jobInfo?.remote).toLowerCase().includes('remote');
  const jobType = jobInfo?.type;
  const website = jobInfo?.website || jobInfo?.url || jobInfo?.companyUrl;
  const domain = extractDomain(website || `${company.replace(/\s+/g, '')}.com`);

  // Calculate background based on salary when gradient mode is enabled
  const hasSalary = Boolean(salary);
  const level = salaryLevel ?? getSalaryLevel(jobInfo?.salary);
  const salaryColors = showSalaryGradient
    ? getSalaryColor(level, hasSalary)
    : null;

  return (
    <div
      className={`job-node-custom ${selected ? 'selected' : ''} ${
        isRead ? 'read' : ''
      } ${showSalaryGradient ? 'salary-gradient' : ''}`}
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
