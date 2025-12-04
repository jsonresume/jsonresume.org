import { sendNotification } from '../sender.js';

/**
 * Send critical error notification
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 * @returns {Promise<boolean>} Success status
 */
export async function notifyCriticalError(error, context = {}) {
  const fields = [
    {
      name: 'Error Type',
      value: error.name || 'Error',
      inline: true,
    },
    {
      name: 'Message',
      value: error.message.substring(0, 1024), // Discord field limit
      inline: false,
    },
  ];

  if (context.endpoint) {
    fields.push({
      name: 'Endpoint',
      value: context.endpoint,
      inline: true,
    });
  }

  if (context.user) {
    fields.push({
      name: 'User',
      value: context.user,
      inline: true,
    });
  }

  if (error.stack) {
    const stackPreview = error.stack.substring(0, 1024);
    fields.push({
      name: 'Stack Trace',
      value: `\`\`\`\n${stackPreview}\n\`\`\``,
      inline: false,
    });
  }

  return await sendNotification({
    title: '🚨 Critical Error',
    description: 'A critical error occurred in production',
    color: 'error',
    fields,
  });
}

/**
 * Send deployment notification
 * @param {string} status - Deployment status (success/failure)
 * @param {Object} details - Deployment details
 * @returns {Promise<boolean>} Success status
 */
export async function notifyDeployment(status, details = {}) {
  const isSuccess = status === 'success';
  const emoji = isSuccess ? '✅' : '❌';

  const fields = [];

  if (details.environment) {
    fields.push({
      name: 'Environment',
      value: details.environment,
      inline: true,
    });
  }

  if (details.commit) {
    fields.push({
      name: 'Commit',
      value: details.commit.substring(0, 7),
      inline: true,
    });
  }

  if (details.message) {
    fields.push({
      name: 'Commit Message',
      value: details.message.substring(0, 200),
      inline: false,
    });
  }

  return await sendNotification({
    title: `${emoji} Deployment ${isSuccess ? 'Successful' : 'Failed'}`,
    description: isSuccess
      ? 'New version deployed successfully'
      : 'Deployment failed, please investigate',
    color: isSuccess ? 'success' : 'error',
    fields,
    url: details.url,
  });
}

/**
 * Send security vulnerability alert
 * @param {Object} vulnerability - Vulnerability details
 * @returns {Promise<boolean>} Success status
 */
export async function notifySecurityVulnerability(vulnerability) {
  const fields = [
    {
      name: 'Severity',
      value: vulnerability.severity || 'Unknown',
      inline: true,
    },
  ];

  if (vulnerability.package) {
    fields.push({
      name: 'Package',
      value: vulnerability.package,
      inline: true,
    });
  }

  if (vulnerability.cve) {
    fields.push({
      name: 'CVE',
      value: vulnerability.cve,
      inline: true,
    });
  }

  if (vulnerability.fixAvailable !== undefined) {
    fields.push({
      name: 'Fix Available',
      value: vulnerability.fixAvailable ? '✅ Yes' : '❌ No',
      inline: true,
    });
  }

  if (vulnerability.description) {
    fields.push({
      name: 'Description',
      value: vulnerability.description.substring(0, 500),
      inline: false,
    });
  }

  const isCritical = ['critical', 'high'].includes(
    vulnerability.severity?.toLowerCase()
  );

  return await sendNotification({
    title: `🔒 Security Vulnerability ${isCritical ? '(CRITICAL)' : ''}`,
    description: isCritical
      ? '⚠️ Critical security vulnerability detected'
      : 'Security vulnerability detected',
    color: isCritical ? 'error' : 'warning',
    fields,
    url: vulnerability.url,
  });
}
