/**
 * Anti-resume analytics — which skills/attributes a candidate tends to reject.
 */
import { flattenJobSkills } from '../helpers';

export function computeAntiResume(interestedJobs, rejectedJobs) {
  if (!rejectedJobs.length) {
    return { skills: [], attributes: [] };
  }
  const rejTotal = rejectedJobs.length || 1;
  const intTotal = interestedJobs.length || 1;

  const count = (jobs) => {
    const m = {};
    for (const j of jobs) {
      for (const s of flattenJobSkills(j)) {
        m[s] = (m[s] || 0) + 1;
      }
    }
    return m;
  };
  const rejSkills = count(rejectedJobs);
  const intSkills = count(interestedJobs);

  const skills = Object.entries(rejSkills)
    .map(([skill, rc]) => {
      const ic = intSkills[skill] || 0;
      const avoid = rc / rejTotal - ic / intTotal;
      return {
        skill,
        rejCount: rc,
        intCount: ic,
        avoidScore: Math.round(avoid * 100) / 100,
      };
    })
    .filter((s) => s.avoidScore > 0.05)
    .sort((a, b) => b.avoidScore - a.avoidScore)
    .slice(0, 8);

  const attrs = [];
  for (const attr of ['remote', 'experience', 'type']) {
    const rc = {},
      ic = {};
    for (const j of rejectedJobs) {
      if (j[attr]) {
        rc[j[attr]] = (rc[j[attr]] || 0) + 1;
      }
    }
    for (const j of interestedJobs) {
      if (j[attr]) {
        ic[j[attr]] = (ic[j[attr]] || 0) + 1;
      }
    }
    for (const [val, c] of Object.entries(rc)) {
      const score = c / rejTotal - (ic[val] || 0) / intTotal;
      if (score > 0.1) {
        attrs.push({
          attribute: attr,
          value: val,
          avoidScore: Math.round(score * 100) / 100,
        });
      }
    }
  }
  attrs.sort((a, b) => b.avoidScore - a.avoidScore);
  return { skills, attributes: attrs.slice(0, 6) };
}
