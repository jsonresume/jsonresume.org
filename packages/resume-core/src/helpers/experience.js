/**
 * Resume Experience Calculation Helpers
 *
 * Re-exported from @jsonresume/utils (framework-free). The implementations
 * moved there in Wave 1; this shim keeps @jsonresume/core's public surface
 * byte-for-byte stable.
 *
 * @module @jsonresume/core/helpers/experience
 */
export {
  calculateTotalExperience,
  calculateCurrentRoleExperience,
  countCareerPositions,
  getCareerProgressionRate,
  countTotalHighlights,
} from '@jsonresume/utils/metrics';
