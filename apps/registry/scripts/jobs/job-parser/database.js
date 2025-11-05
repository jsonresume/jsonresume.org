// Re-export all database operations
const { initializeSupabase } = require('./database/initializeSupabase');
const {
  fetchJobs,
  updateJob,
  markJobAsFailed,
} = require('./database/jobOperations');
const { getCompanyData } = require('./database/companyData');

module.exports = {
  initializeSupabase,
  fetchJobs,
  getCompanyData,
  updateJob,
  markJobAsFailed,
};
