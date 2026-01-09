/**
 * Debug test for pathways graph algorithm
 * Tests against thomasdavis resume to understand parent distribution
 */

import { describe, it, expect } from 'vitest';

// Use localhost for testing when LOCAL_TEST env var is set
const REGISTRY_URL = process.env.LOCAL_TEST
  ? 'http://localhost:3099'
  : 'https://registry.jsonresume.org';

describe('Pathways Graph Algorithm Debug', () => {
  it('should analyze parent distribution for thomasdavis', async () => {
    // Step 1: Get resume for thomasdavis
    console.log('\n=== Step 1: Fetching resume ===');
    const resumeRes = await fetch(
      `${REGISTRY_URL}/api/resume?username=thomasdavis`
    );
    const resumeData = await resumeRes.json();
    expect(resumeData).toBeDefined();
    console.log('Resume fetched for:', resumeData.basics?.name);

    // Step 2: Generate embedding for resume
    console.log('\n=== Step 2: Generating embedding ===');
    const embeddingRes = await fetch(`${REGISTRY_URL}/api/pathways/embedding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume: resumeData }),
    });
    const embeddingData = await embeddingRes.json();
    expect(embeddingData.embedding).toBeDefined();
    console.log('Embedding generated, length:', embeddingData.embedding.length);

    // Step 3: Fetch jobs with the embedding
    console.log('\n=== Step 3: Fetching jobs ===');
    const jobsRes = await fetch(`${REGISTRY_URL}/api/pathways/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embedding: embeddingData.embedding,
        resumeId: 'resume',
        timeRange: '1m',
        primaryBranches: 20,
      }),
    });
    const jobsData = await jobsRes.json();
    expect(jobsData.graphData).toBeDefined();

    // Check API version to verify deployment
    console.log('\n=== API Version ===');
    console.log('Version:', jobsData._version || 'NOT FOUND - old deployment');

    const { graphData, debug, topBranches } = jobsData;
    const { nodes, links } = graphData;

    console.log('\n=== Results ===');
    console.log('Total nodes:', nodes.length);
    console.log('Total links:', links.length);
    console.log(
      'Resume node has',
      nodes.find((n) => n.id === 'resume')?.childCount,
      'children'
    );

    // Analyze debug info
    console.log('\n=== Debug Info ===');
    console.log('Total secondary jobs:', debug.totalSecondary);
    console.log('Unique parents chosen:', debug.uniqueParents);
    console.log('Times resume was chosen:', debug.resumeChosen);
    console.log('\nTop 10 parents by child count:');
    debug.topParents.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.id}: ${p.count} children`);
    });

    // Analyze node child counts
    console.log('\n=== Node Child Count Distribution ===');
    const nodesWithChildren = nodes.filter((n) => n.childCount > 0);
    console.log('Nodes with children:', nodesWithChildren.length);

    const childCountBuckets = {};
    nodesWithChildren.forEach((n) => {
      const bucket =
        n.childCount <= 5
          ? '1-5'
          : n.childCount <= 10
          ? '6-10'
          : n.childCount <= 20
          ? '11-20'
          : n.childCount <= 50
          ? '21-50'
          : n.childCount <= 100
          ? '51-100'
          : '100+';
      childCountBuckets[bucket] = (childCountBuckets[bucket] || 0) + 1;
    });
    console.log('Distribution:', childCountBuckets);

    // Find the problematic node
    const maxChildNode = nodesWithChildren.reduce(
      (max, n) => (n.childCount > max.childCount ? n : max),
      { childCount: 0 }
    );

    console.log('\n=== Most Connected Node ===');
    console.log('Node ID:', maxChildNode.id);
    console.log('Label:', maxChildNode.label);
    console.log('Child count:', maxChildNode.childCount);
    console.log(
      'Group:',
      maxChildNode.group,
      maxChildNode.group === 1 ? '(primary)' : '(secondary)'
    );

    // Check if the problematic node is a primary or secondary
    const isPrimary = maxChildNode.group === 1;
    console.log('\nIs this a primary node?', isPrimary);

    // Analyze links to understand the tree structure
    console.log('\n=== Tree Structure Analysis ===');
    const resumeLinks = links.filter((l) => l.source === 'resume');
    console.log(
      'Links from resume:',
      resumeLinks.length,
      '(should be',
      20,
      ')'
    );

    // Count children per primary node
    const primaryNodes = nodes.filter((n) => n.group === 1);
    console.log('Primary nodes:', primaryNodes.length);

    const primaryChildCounts = primaryNodes
      .map((pn) => ({
        id: pn.id.slice(0, 8),
        label: pn.label?.slice(0, 30),
        children: pn.childCount,
      }))
      .sort((a, b) => b.children - a.children);

    console.log('\nPrimary nodes by child count:');
    primaryChildCounts.slice(0, 10).forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.label}: ${p.children} children`);
    });

    // Check if secondary nodes have children (indicating depth > 2)
    const secondaryNodes = nodes.filter((n) => n.group === 2);
    const secondaryWithChildren = secondaryNodes.filter(
      (n) => n.childCount > 0
    );
    console.log('\n=== Depth Analysis ===');
    console.log('Secondary nodes:', secondaryNodes.length);
    console.log('Secondary nodes with children:', secondaryWithChildren.length);

    if (secondaryWithChildren.length > 0) {
      console.log('Secondary nodes acting as parents:');
      secondaryWithChildren.slice(0, 5).forEach((n) => {
        console.log(`  - ${n.label?.slice(0, 30)}: ${n.childCount} children`);
      });
    }

    // Assertions to verify expected behavior
    expect(resumeLinks.length).toBe(20); // Should have 20 primary branches
    expect(maxChildNode.childCount).toBeLessThan(100); // No single node should have 100+ children
  }, 60000); // 60s timeout for API calls
});
