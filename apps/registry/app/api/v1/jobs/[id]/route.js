/**
 * /api/v1/jobs/:id route module.
 *
 * The handler bodies live in ./handlers.js to keep this route file under the
 * 200-line policy; Next.js only needs the HTTP-method named exports here.
 *   - PUT   → updateJobState
 *   - PATCH → enrichJob
 *   - GET   → getJob
 */
import { updateJobState, enrichJob, getJob } from './handlers';

export const dynamic = 'force-dynamic';

export const PUT = updateJobState;
export const PATCH = enrichJob;
export const GET = getJob;
